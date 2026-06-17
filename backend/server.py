"""Career Explorer AI — FastAPI backend."""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import secrets
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, APIRouter, HTTPException, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

from auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional,
    get_current_admin,
)
from career_data import COUNTRY_CONFIG, CAREER_CATALOGUE, get_career_detail

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
log = logging.getLogger("careerexplorer")

# Mongo
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Career Explorer AI API")
app.state.db = db

api = APIRouter(prefix="/api")


# ----- Pydantic models -----
class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    country: Optional[str] = "US"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ForgotIn(BaseModel):
    email: EmailStr


class ResetIn(BaseModel):
    token: str
    password: str = Field(min_length=6, max_length=128)


class AssessmentIn(BaseModel):
    answers: Dict[str, str]
    ratings: Dict[str, int]
    top3: List[Dict[str, Any]]  # frontend-computed [{name, match, ...}]
    country: Optional[str] = "US"


class SavedIn(BaseModel):
    career: str


class AIExplainIn(BaseModel):
    answers: Dict[str, str]
    top3: List[Dict[str, Any]]


def _now():
    return datetime.now(timezone.utc).isoformat()


def _serialize(doc):
    if not doc:
        return doc
    doc.pop("_id", None)
    doc.pop("password_hash", None)
    return doc


def _cookie_kwargs():
    # samesite none + secure for cross-domain prod; allow lax fallback
    return dict(httponly=True, secure=True, samesite="none", max_age=60 * 60 * 24, path="/")


# ----- AUTH -----
@api.post("/auth/register")
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(409, "Email already registered")
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": payload.name.strip(),
        "country": (payload.country or "US").upper(),
        "role": "user",
        "password_hash": hash_password(payload.password),
        "created_at": _now(),
    }
    await db.users.insert_one(user)
    token = create_access_token(user["id"], email, "user")
    response.set_cookie("access_token", token, **_cookie_kwargs())
    return {"token": token, "user": _serialize(dict(user))}


@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token(user["id"], email, user.get("role", "user"))
    response.set_cookie("access_token", token, **_cookie_kwargs())
    return {"token": token, "user": _serialize(dict(user))}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api.patch("/auth/country")
async def update_country(country: dict, user: dict = Depends(get_current_user)):
    c = (country.get("country") or "US").upper()
    if c not in COUNTRY_CONFIG:
        raise HTTPException(400, "Unsupported country")
    await db.users.update_one({"id": user["id"]}, {"$set": {"country": c}})
    return {"country": c}


@api.post("/auth/forgot-password")
async def forgot(payload: ForgotIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    # Always return success to avoid email enumeration
    if user:
        token = secrets.token_urlsafe(32)
        await db.password_reset_tokens.insert_one({
            "token": token,
            "user_id": user["id"],
            "created_at": _now(),
            "used": False,
        })
        reset_link = f"{os.environ.get('APP_PUBLIC_URL', '')}/reset-password?token={token}"
        log.info("PASSWORD RESET TOKEN for %s: %s (link: %s)", email, token, reset_link)
        await _send_reset_email(email, user.get("name", ""), reset_link)
    return {"ok": True, "message": "If that email exists, a reset link has been sent."}


async def _send_reset_email(to_email: str, name: str, link: str):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        log.warning("RESEND_API_KEY not set — skipping email send. Link: %s", link)
        return
    try:
        import resend
        resend.api_key = api_key
        from_addr = os.environ.get("RESEND_FROM", "onboarding@resend.dev")
        html = f"""
        <div style="font-family:Manrope,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#0a0a0a">
          <h1 style="font-size:24px;font-weight:900;letter-spacing:-0.02em;margin:0 0 16px">Reset your password</h1>
          <p style="font-size:16px;line-height:1.6;color:#52525b">Hi {name or 'there'}, click the button below to reset your Career Explorer AI password. This link expires in 1 hour.</p>
          <p style="margin:28px 0"><a href="{link}" style="background:#0038FF;color:#fff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;display:inline-block">Reset password</a></p>
          <p style="font-size:13px;color:#52525b">If you didn't request this, you can ignore this email.</p>
          <p style="font-size:12px;color:#a1a1aa;margin-top:32px">Career Explorer AI</p>
        </div>
        """
        resend.Emails.send({
            "from": from_addr,
            "to": [to_email],
            "subject": "Reset your Career Explorer AI password",
            "html": html,
        })
        log.info("Reset email sent to %s", to_email)
    except Exception as e:
        log.exception("Failed to send reset email: %s", e)


@api.post("/auth/reset-password")
async def reset(payload: ResetIn):
    rec = await db.password_reset_tokens.find_one({"token": payload.token, "used": False})
    if not rec:
        raise HTTPException(400, "Invalid or used token")
    await db.users.update_one(
        {"id": rec["user_id"]}, {"$set": {"password_hash": hash_password(payload.password)}}
    )
    await db.password_reset_tokens.update_one({"_id": rec["_id"]}, {"$set": {"used": True}})
    return {"ok": True}


# ----- COUNTRIES -----
@api.get("/countries")
async def list_countries():
    return [{"code": k, **v} for k, v in COUNTRY_CONFIG.items()]


# ----- CAREERS -----
@api.get("/careers")
async def list_careers(country: str = "US"):
    country = (country or "US").upper()
    if country not in COUNTRY_CONFIG:
        country = "US"
    return [get_career_detail(name, country) for name in CAREER_CATALOGUE.keys()]


@api.get("/careers/{name}")
async def career_detail(name: str, country: str = "US"):
    # case-insensitive lookup
    country = (country or "US").upper()
    if country not in COUNTRY_CONFIG:
        country = "US"
    match = next((k for k in CAREER_CATALOGUE.keys() if k.lower() == name.lower()), None)
    # If not in detailed catalogue, still return generic detail (career may exist in frontend list)
    return get_career_detail(match or name, country)


# ----- ASSESSMENTS -----
@api.post("/assessments")
async def save_assessment(payload: AssessmentIn, user: dict = Depends(get_current_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "answers": payload.answers,
        "ratings": payload.ratings,
        "top3": payload.top3,
        "country": (payload.country or user.get("country") or "US").upper(),
        "created_at": _now(),
    }
    await db.assessments.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.get("/assessments")
async def list_assessments(user: dict = Depends(get_current_user)):
    docs = await db.assessments.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs


@api.delete("/assessments/{assessment_id}")
async def delete_assessment(assessment_id: str, user: dict = Depends(get_current_user)):
    res = await db.assessments.delete_one({"id": assessment_id, "user_id": user["id"]})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}


@api.get("/assessments/trends")
async def assessment_trends(user: dict = Depends(get_current_user)):
    """Return time-series of match% per career across the user's assessments.
    Each datapoint: { date, <careerName>: match%, ... }. Includes the top 5 unique
    careers across all attempts so chart stays readable."""
    docs = await db.assessments.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("created_at", 1).to_list(100)

    # collect unique career names from each assessment's top3
    counts = {}
    for d in docs:
        for c in d.get("top3", []):
            counts[c.get("name")] = counts.get(c.get("name"), 0) + 1
    top_names = [n for n, _ in sorted(counts.items(), key=lambda x: -x[1]) if n][:5]

    points = []
    for d in docs:
        row = {"date": (d.get("created_at") or "")[:10], "id": d.get("id")}
        match_map = {c.get("name"): c.get("match", 0) for c in d.get("top3", [])}
        for n in top_names:
            row[n] = match_map.get(n, 0)
        points.append(row)

    return {"careers": top_names, "points": points, "count": len(docs)}


# ----- SAVED CAREERS -----
@api.get("/saved-careers")
async def list_saved(user: dict = Depends(get_current_user)):
    docs = await db.saved_careers.find({"user_id": user["id"]}, {"_id": 0}).to_list(200)
    return docs


@api.post("/saved-careers")
async def add_saved(payload: SavedIn, user: dict = Depends(get_current_user)):
    existing = await db.saved_careers.find_one({"user_id": user["id"], "career": payload.career})
    if existing:
        return {"ok": True, "duplicate": True}
    doc = {"id": str(uuid.uuid4()), "user_id": user["id"], "career": payload.career, "created_at": _now()}
    await db.saved_careers.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.delete("/saved-careers/{career}")
async def remove_saved(career: str, user: dict = Depends(get_current_user)):
    await db.saved_careers.delete_one({"user_id": user["id"], "career": career})
    return {"ok": True}


# ----- ADMIN -----
@api.get("/admin/stats")
async def admin_stats(_: dict = Depends(get_current_admin)):
    total_users = await db.users.count_documents({"role": {"$ne": "admin"}})
    total_assessments = await db.assessments.count_documents({})
    total_saved = await db.saved_careers.count_documents({})

    # Aggregations: most selected #1 careers, most saved, popular categories
    top_careers_pipeline = [
        {"$project": {"first": {"$arrayElemAt": ["$top3", 0]}}},
        {"$group": {"_id": "$first.name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    top_careers = await db.assessments.aggregate(top_careers_pipeline).to_list(20)

    top_saved_pipeline = [
        {"$group": {"_id": "$career", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    top_saved = await db.saved_careers.aggregate(top_saved_pipeline).to_list(20)

    return {
        "total_users": total_users,
        "total_assessments": total_assessments,
        "total_saved": total_saved,
        "top_careers": [{"name": x["_id"] or "Unknown", "count": x["count"]} for x in top_careers],
        "top_saved": [{"name": x["_id"], "count": x["count"]} for x in top_saved],
    }


# ----- AI EXPLAIN (Claude Sonnet 4.5 via Emergent LLM Key) -----
@api.post("/ai/explain")
async def ai_explain(payload: AIExplainIn, user: dict = Depends(get_current_user)):
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(503, "AI explanations are not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as e:
        log.exception("emergentintegrations import failed")
        raise HTTPException(503, f"AI module unavailable: {e}")

    prompt = _build_ai_prompt(payload.answers, payload.top3)
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"explain-{user['id']}",
            system_message=(
                "You are a warm, insightful career counsellor for students and young professionals. "
                "Write concise, encouraging explanations grounded in the user's quiz answers. "
                "No filler, no headings, no markdown — write 2 short paragraphs (max ~140 words total)."
            ),
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        reply = await chat.send_message(UserMessage(text=prompt))
        text = getattr(reply, "text", None) or str(reply)
        return {"explanation": text.strip()}
    except Exception as e:
        log.exception("AI explain failed")
        raise HTTPException(502, f"AI generation failed: {e}")


def _build_ai_prompt(answers: dict, top3: list) -> str:
    top_names = ", ".join([f"{c.get('name')} ({c.get('match')}%)" for c in top3])
    answer_lines = "\n".join([f"- {k}: {v}" for k, v in answers.items()])
    return (
        f"User's top 3 career matches: {top_names}.\n\n"
        f"Their quiz answer keys → choice values:\n{answer_lines}\n\n"
        "Explain in 2 short paragraphs: (1) why #1 matches them based on patterns in their answers, "
        "and (2) one honest, supportive next step they should take this week. "
        "Address them as 'you'. Be specific to their answer signals, not generic."
    )


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.assessments.create_index([("user_id", 1), ("created_at", -1)])
        await db.saved_careers.create_index([("user_id", 1), ("career", 1)], unique=True)
        await db.password_reset_tokens.create_index("token", unique=True)
    except Exception as e:
        log.warning("Index creation issue: %s", e)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@careerexplorer.ai")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@2026!")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Admin",
            "country": "US",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": _now(),
        })
        log.info("Seeded admin user %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}}
        )

    # Write test credentials file
    try:
        mem = Path("/app/memory")
        mem.mkdir(exist_ok=True)
        (mem / "test_credentials.md").write_text(
            f"""# Career Explorer AI — Test Credentials

## Admin
- Email: `{admin_email}`
- Password: `{admin_password}`
- Role: admin

## Test user (optional — create via /api/auth/register)
- Email: `student@example.com`
- Password: `Student@2026!`

## Auth endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
"""
        )
    except Exception as e:
        log.warning("Failed to write test_credentials.md: %s", e)


@app.on_event("shutdown")
async def shutdown():
    client.close()


@api.get("/")
async def root():
    return {"app": "Career Explorer AI", "version": "2"}
