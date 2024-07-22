import React, { useReducer, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

import QuestionnaireContext from "./QuestionnaireContext";
import { initialState, reducer } from "./../reducers/questionnaireReducer.js"
import { QuestionnaireHandlers } from "./handlers/QuestionnaireHandlers.jsx"
import { useFirstImpression,useQuestionImpressions,useUnloadImpressions } from "@/hooks/useImpressions";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { useNavigationEffects } from "@/hooks/useNavigationEffects";
import * as actionTypes from '@/reducers/actionTypes.js'
import {formatPhoneNumber} from '@/utils/formatUtils.js'

export const QuestionnaireProvider = ({ children }) => {


  const initial =initialState();
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initial);

   const handlers = QuestionnaireHandlers(state, dispatch);


  useQuestionnaireState(state,dispatch,   
     handlers.completeMidForm,
    handlers.completeQuestionnaire);
  useFirstImpression();
  useQuestionImpressions(state);
  useUnloadImpressions(state);
  useNavigationEffects(state,handlers.moveToPrevQuestion);

  useEffect(() => {
    if (!state.initialResponsesSet) {
      const queryParams = new URLSearchParams(location.search);
      const fullname = queryParams.get('fullname');
      const email = queryParams.get('email');
      const phone = queryParams.get('phone');
      const revenue = queryParams.get('revenue');
      const privacy = queryParams.get('privacy');

      if (fullname || email || phone || revenue || privacy) {
        const responses = {};
        if (fullname) {
          responses['full_name'] = {
            step: 1,
            question: "Full name",
            answerIndexes: [],
            answer: fullname
          };
        }
        if (email) {
          responses['email'] = {
            step: 1,
            question: "Email",
            answerIndexes: [],
            answer: email
          };
        }
        if (phone) {
          responses['phone'] = {
            step: 1,
            question: "Phone number",
            answerIndexes: [],
            answer: formatPhoneNumber(phone)
          };
        }
        if (revenue) {
          const answers = ['Under $200k','$200k-$500k','Over $500k']
          responses['annual_revenue'] = {
            step: 1,
            question: "How much is your annual revenue?",
            answerIndexes: [Number(revenue)],
            answer: answers[revenue]
          };
        }
        if (privacy) {
          responses['privacy_consent'] = {
            step: 1,
            question: "By checking this box, you electronically consent to the Ridge Crest Financial Group, LLC Terms and Conditions and Privacy policy",
            answerIndexes: [privacy==="on" ? 1: 0],
            answer: privacy
          };
        }

        dispatch({
          type: actionTypes.SET_RESPONSES,
          payload: responses
        });
        // if (areAllFieldsFilled(state.currentQuestion, responses)) {
          // }
        }
      }
      else{
        // console.log('movetonext');
        handlers.moveToNextQuestion();
      }
  }, [location.search, state.initialResponsesSet]);

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
