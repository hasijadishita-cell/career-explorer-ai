import React, { createContext, useContext, useEffect, useState } from "react";

const AssessmentContext = createContext(null);

const STORAGE_KEY = "career_explorer_state_v1";

const defaultState = {
  answers: {},
  ratings: {},
  currentStep: 0,
  finishedAssessment: false,
  finishedRating: false,
};

function readInitialState() {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
  } catch (e) {
    return defaultState;
  }
}

export function AssessmentProvider({ children }) {
  const [state, setState] = useState(readInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore quota/serialization errors
    }
  }, [state]);

  const setAnswer = (qid, value) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [qid]: value } }));

  const setRating = (careerName, value) =>
    setState((s) => ({ ...s, ratings: { ...s.ratings, [careerName]: value } }));

  const setCurrentStep = (step) => setState((s) => ({ ...s, currentStep: step }));

  const markAssessmentFinished = () =>
    setState((s) => ({ ...s, finishedAssessment: true }));

  const markRatingFinished = () =>
    setState((s) => ({ ...s, finishedRating: true }));

  const reset = () => {
    setState(defaultState);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        hydrated: true,
        setAnswer,
        setRating,
        setCurrentStep,
        markAssessmentFinished,
        markRatingFinished,
        reset,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used inside AssessmentProvider");
  return ctx;
}
