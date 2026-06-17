import { CAREERS, CAREER_NAMES, QUESTIONS } from "../data/careerData";

// Compute career points based on quiz answers (Q2-Q9, Q1 has no scoring)
export function computeQuizScores(answers) {
  const scores = {};
  CAREER_NAMES.forEach((c) => (scores[c] = 0));

  QUESTIONS.forEach((q) => {
    if (!q.scoring) return;
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options.find((o) => o.value === answer);
    if (!option || !option.careers) return;
    const weight = q.weight || 1;
    option.careers.forEach((career) => {
      if (scores[career] !== undefined) scores[career] += weight;
    });
  });

  return scores;
}

// Returns top N careers ranked by quiz score
export function getTopCareers(scores, n = 10) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, score]) => ({ name, score, ...CAREERS[name] }));
}

// Compute match percentage. Combine quiz score + user rating.
// Max possible quiz score per career is approximately the number of scoring questions × weight.
// We normalise so that the #1 quiz-scored career maps near (but not always) 100%.
export function computeFinalResults(quizScores, ratings) {
  // Find max quiz score for normalisation
  const maxQuiz = Math.max(1, ...Object.values(quizScores));

  const combined = CAREER_NAMES.map((name) => {
    const quiz = quizScores[name] || 0;
    const rating = ratings[name] || 0; // 0-5
    // Normalise to 0..100. 60% weight quiz, 40% weight rating.
    const quizNorm = (quiz / maxQuiz) * 100;
    const ratingNorm = (rating / 5) * 100;
    const match = Math.round(quizNorm * 0.6 + ratingNorm * 0.4);
    return {
      name,
      ...CAREERS[name],
      quizScore: quiz,
      rating,
      match,
    };
  });

  combined.sort((a, b) => b.match - a.match || b.quizScore - a.quizScore);
  return combined;
}

// Build a "why this matches" string based on answers
export function buildWhyMatches(careerName, answers) {
  const reasons = [];
  QUESTIONS.forEach((q) => {
    if (!q.scoring) return;
    const ans = answers[q.id];
    if (!ans) return;
    const opt = q.options.find((o) => o.value === ans);
    if (!opt || !opt.careers) return;
    if (opt.careers.includes(careerName)) {
      reasons.push(opt.label);
    }
  });
  if (reasons.length === 0) {
    return "Based on your answers, this career direction aligns with your overall interests.";
  }
  const top = reasons.slice(0, 3);
  return `Your interest in ${top.join(", ")} strongly aligns with the daily work of a ${careerName}.`;
}
