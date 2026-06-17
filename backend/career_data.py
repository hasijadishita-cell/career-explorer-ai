"""Career data with country-aware salaries, education paths, roadmap stages and outlook.

Salaries are annual approximate ranges (in local currency abbreviation) for entry/early-career.
Mock data — no live sources.
"""

# Multiplier mock vs USD base (rough heuristic + currency code)
COUNTRY_CONFIG = {
    "US": {"label": "United States", "currency": "USD", "mult": 1.0, "symbol": "$"},
    "UK": {"label": "United Kingdom", "currency": "GBP", "mult": 0.70, "symbol": "£"},
    "CA": {"label": "Canada", "currency": "CAD", "mult": 1.05, "symbol": "C$"},
    "AU": {"label": "Australia", "currency": "AUD", "mult": 1.20, "symbol": "A$"},
    "IN": {"label": "India", "currency": "INR", "mult": 38.0, "symbol": "₹"},
}

# Detailed catalogue. Salaries below are USD-base annual ranges; we scale at read time.
CAREER_CATALOGUE = {
    "Software Engineer": {
        "category": "Technology",
        "description": "Design, build and maintain software systems that power apps, websites and digital products used by millions.",
        "skills": ["Problem Solving", "Coding", "Algorithms", "System Design", "Collaboration"],
        "salary_usd": [70000, 160000],
        "education": "Bachelor's in Computer Science, Software Engineering or related field. Many self-taught engineers also enter via bootcamps.",
        "universities": ["MIT", "Stanford", "Carnegie Mellon", "IIT Bombay", "University of Waterloo"],
        "certifications": ["AWS Certified Developer", "Google Cloud Associate Engineer", "Meta Front-End Developer"],
        "daily": ["Write & review code", "Design APIs and data models", "Debug production issues", "Collaborate in stand-ups & code reviews", "Continuous learning"],
        "wlb": 4,
        "outlook": "Very High — 23% projected growth this decade",
        "roadmap": {
            "beginner": {
                "skills": ["HTML/CSS/JS basics", "Python or JavaScript", "Git & GitHub", "Data structures basics"],
                "courses": ["CS50 by Harvard", "freeCodeCamp Full-Stack", "Codecademy Pro"],
            },
            "intermediate": {
                "projects": ["Personal portfolio site", "REST API with auth", "Full-stack CRUD app", "Open-source contributions"],
                "certifications": ["AWS Cloud Practitioner", "Meta Back-End Developer"],
            },
            "advanced": {
                "internships": ["FAANG SWE intern", "Startup engineering intern", "Open Source Summer (GSoC)"],
                "jobs": ["Junior SWE", "Full-Stack Developer", "Platform Engineer"],
            },
        },
    },
    "AI Engineer": {
        "category": "Technology",
        "description": "Build intelligent systems and machine learning models that can learn, predict and automate complex tasks.",
        "skills": ["Machine Learning", "Python", "Mathematics", "Data Modelling", "Research"],
        "salary_usd": [95000, 200000],
        "education": "Bachelor's or Master's in CS, Mathematics, Statistics or AI; strong applied math foundation.",
        "universities": ["Stanford", "MIT", "CMU", "ETH Zurich", "IISc Bangalore"],
        "certifications": ["DeepLearning.AI Specialization", "Google ML Engineer", "AWS ML Specialty"],
        "daily": ["Train and fine-tune models", "Curate datasets", "Read papers", "Deploy ML services", "A/B test predictions"],
        "wlb": 3,
        "outlook": "Explosive — fastest growing tech role this decade",
        "roadmap": {
            "beginner": {"skills": ["Python", "Linear algebra & stats", "Pandas/NumPy", "Intro ML"], "courses": ["Andrew Ng ML Specialization", "Fast.ai Practical DL"]},
            "intermediate": {"projects": ["Sentiment classifier", "Image classifier on CIFAR", "RAG chatbot", "Kaggle competitions"], "certifications": ["TensorFlow Developer", "DeepLearning.AI Generative AI"]},
            "advanced": {"internships": ["Research Lab Intern", "Applied Scientist Intern"], "jobs": ["ML Engineer", "Applied Scientist", "Research Engineer"]},
        },
    },
    "Cybersecurity Analyst": {
        "category": "Technology",
        "description": "Protect organisations from digital threats by uncovering vulnerabilities and defending systems from attack.",
        "skills": ["Networking", "Threat Analysis", "Curiosity", "Attention to Detail", "Ethical Hacking"],
        "salary_usd": [70000, 140000],
        "education": "Bachelor's in CS, Information Security, or related — plus industry certifications.",
        "universities": ["CMU", "Georgia Tech", "Royal Holloway", "IIIT Hyderabad"],
        "certifications": ["CompTIA Security+", "CEH", "OSCP", "CISSP"],
        "daily": ["Monitor SIEM dashboards", "Investigate incidents", "Run penetration tests", "Patch & harden systems", "Train teams on security"],
        "wlb": 3,
        "outlook": "Very High — 32% growth, severe global shortage",
        "roadmap": {
            "beginner": {"skills": ["Networking basics", "Linux CLI", "Python scripting"], "courses": ["TryHackMe Pre-Security", "Cisco CCNA Intro"]},
            "intermediate": {"projects": ["Home lab with VMs", "CTF challenges", "Bug bounty reports"], "certifications": ["CompTIA Security+", "eJPT"]},
            "advanced": {"internships": ["SOC Analyst Intern", "Red Team Intern"], "jobs": ["SOC Analyst", "Penetration Tester", "Security Engineer"]},
        },
    },
    "Data Scientist": {
        "category": "Technology",
        "description": "Turn raw data into stories and decisions using statistics, machine learning and visualisation.",
        "skills": ["Statistics", "Python / SQL", "Storytelling", "Modelling", "Critical Thinking"],
        "salary_usd": [85000, 170000],
        "education": "Bachelor's or Master's in Statistics, CS, Math or Economics.",
        "universities": ["Berkeley", "CMU", "ISI Kolkata", "Imperial College London"],
        "certifications": ["Google Data Analytics", "DataCamp Data Scientist", "Microsoft Azure Data Scientist"],
        "daily": ["Clean datasets", "Build dashboards", "Run experiments", "Present insights", "Model deployment"],
        "wlb": 4,
        "outlook": "High — 36% projected growth",
        "roadmap": {
            "beginner": {"skills": ["Python", "SQL", "Stats fundamentals"], "courses": ["IBM Data Science Cert", "DataCamp Intro"]},
            "intermediate": {"projects": ["Kaggle dataset analysis", "BI dashboard", "End-to-end ML pipeline"], "certifications": ["Google Advanced Data Analytics"]},
            "advanced": {"internships": ["Analytics intern", "Data Science intern"], "jobs": ["Junior Data Scientist", "Analytics Engineer"]},
        },
    },
    "Product Manager": {
        "category": "Technology",
        "description": "Lead the vision, strategy and roadmap of digital products — sitting at the intersection of design, engineering and business.",
        "skills": ["Strategy", "Communication", "User Empathy", "Prioritisation", "Leadership"],
        "salary_usd": [90000, 200000],
        "education": "Bachelor's in any field — common: CS, Business, Design; MBA optional for senior roles.",
        "universities": ["Stanford GSB", "Wharton", "INSEAD", "IIM Ahmedabad"],
        "certifications": ["Reforge PM", "Product School PM Cert"],
        "daily": ["Customer interviews", "Roadmap planning", "Sprint reviews", "Stakeholder updates", "Spec writing"],
        "wlb": 3,
        "outlook": "High — strong demand across software companies",
        "roadmap": {
            "beginner": {"skills": ["Product thinking", "Basic SQL", "Market research"], "courses": ["Reforge Intro to PM", "Lenny's Newsletter PM 101"]},
            "intermediate": {"projects": ["Side project as PM", "Case studies", "Mock PRDs"], "certifications": ["Product School PM"]},
            "advanced": {"internships": ["APM internship", "Startup PM"], "jobs": ["Associate PM", "Product Manager"]},
        },
    },
}

# Generic fallback for careers not in the detailed catalogue
_GENERIC_DEFAULTS = {
    "salary_usd": [40000, 90000],
    "education": "Relevant bachelor's degree, plus on-the-job experience.",
    "universities": ["Top public university", "Specialist institute in the field"],
    "certifications": ["Industry-recognised certification in the field"],
    "daily": ["Specialised craft work", "Collaborating with team", "Continuous learning", "Client/stakeholder communication"],
    "wlb": 3,
    "outlook": "Stable demand",
    "roadmap": {
        "beginner": {"skills": ["Foundational knowledge", "Communication", "Software/tools of the trade"], "courses": ["Intro online course", "University foundation course"]},
        "intermediate": {"projects": ["Portfolio piece", "Internship project"], "certifications": ["Field certification"]},
        "advanced": {"internships": ["Industry internship"], "jobs": ["Junior practitioner", "Specialist role"]},
    },
}

# Country-localised salary formatting
def get_salary_range(career_name: str, country: str) -> dict:
    info = CAREER_CATALOGUE.get(career_name, {})
    low_usd, high_usd = info.get("salary_usd") or _GENERIC_DEFAULTS["salary_usd"]
    cc = COUNTRY_CONFIG.get(country, COUNTRY_CONFIG["US"])
    low = round(low_usd * cc["mult"])
    high = round(high_usd * cc["mult"])
    return {
        "country": country,
        "currency": cc["currency"],
        "symbol": cc["symbol"],
        "low": low,
        "high": high,
        "display": f"{cc['symbol']}{low:,} – {cc['symbol']}{high:,}",
    }


def get_career_detail(career_name: str, country: str = "US") -> dict:
    info = CAREER_CATALOGUE.get(career_name)
    if info is None:
        info = _GENERIC_DEFAULTS.copy()
    return {
        "name": career_name,
        "category": info.get("category"),
        "description": info.get("description"),
        "skills": info.get("skills"),
        "education": info.get("education", _GENERIC_DEFAULTS["education"]),
        "universities": info.get("universities", _GENERIC_DEFAULTS["universities"]),
        "certifications": info.get("certifications", _GENERIC_DEFAULTS["certifications"]),
        "daily": info.get("daily", _GENERIC_DEFAULTS["daily"]),
        "wlb": info.get("wlb", _GENERIC_DEFAULTS["wlb"]),
        "outlook": info.get("outlook", _GENERIC_DEFAULTS["outlook"]),
        "roadmap": info.get("roadmap", _GENERIC_DEFAULTS["roadmap"]),
        "salary": get_salary_range(career_name, country),
    }
