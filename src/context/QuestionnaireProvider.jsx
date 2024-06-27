import React, { useReducer, useMemo } from "react";
import QuestionnaireContext from "./QuestionnaireContext";
import { initialState, reducer } from "./../reducers/questionnaireReducer.js"
import { QuestionnaireHandlers } from "./handlers/QuestionnaireHandlers.jsx"
import { useFirstImpression,useQuestionImpressions,useUnloadImpressions } from "@/hooks/useImpressions";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { useNavigationEffects } from "@/hooks/useNavigationEffects";
// import {useHistoryStack} from 'hooks/useHistoryStack'
// import { useLocalStorage } from "@/hooks/useLocalStorage";

export const QuestionnaireProvider = ({ children }) => {

  // const localState = JSON.parse(localStorage.getItem('questionnaireState'));
  // const initial = localState || initialState();
  const initial =initialState();

  const [state, dispatch] = useReducer(reducer, initial);

  // useLocalStorage(state, 'questionnaireState');
  // const { goToNext, goToPrevious } = useHistoryStack(dispatch, state.currentQuestionCode, state);

   const handlers = QuestionnaireHandlers(state, dispatch);


  useQuestionnaireState(state,dispatch,handlers.completeQuestionnaire);
  useFirstImpression();
  useQuestionImpressions(state);
  useUnloadImpressions(state);
  useNavigationEffects(state,handlers.moveToPrevQuestion);

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      ...handlers,
    }),
    [state, dispatch]
  );

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
};
