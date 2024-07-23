// useQuestionnaireState.js
import * as actionTypes from '@/reducers/actionTypes'
import { useEffect } from 'react';
 const appVersion = import.meta.env.VITE_APP_VERSION;


export const useQuestionnaireState = (state,dispatch,completeMidForm,completeQuestionnaire) => {
     const { currentQuestion, currentQuestionCode,formProgressStep,sendFirstSubmit,fullFormSubmitted } = state;
    useEffect(() => {
        if (currentQuestion?.step > 1 || (currentQuestion?.step === 1 && formProgressStep > 1)) {
            dispatch({ type: actionTypes.TOGGLE_QUESTIONNAIRE_STARTED, payload: true });
        } else {
            dispatch({ type: actionTypes.TOGGLE_QUESTIONNAIRE_STARTED, payload: false });
        }
        if (currentQuestionCode === "thank_you") {
            dispatch({ type: actionTypes.TOGGLE_QUESTIONNAIRE_COMPLETED, payload: true });
            if(appVersion !== 'long'){
                completeQuestionnaire()
            } 
        } 

        if(currentQuestionCode==="financial_information" && !fullFormSubmitted){
            // console.log('in document page, sending form:');
            dispatch({ type: actionTypes.TOGGLE_SEND_FINAL_SUBMIT, payload: true });
            completeQuestionnaire()
        }
        else if(currentQuestionCode!=="financial_information" && currentQuestion.step <=3){
            // console.log('test');
            dispatch({ type: actionTypes.TOGGLE_SEND_FINAL_SUBMIT, payload: false });

        }
          // Handle the mid-form completion when the first question is answered
          if (currentQuestionCode === "business_information" && formProgressStep === 1) {
            if (sendFirstSubmit) {
                // console.log('useQuestionnaire inside if', currentQuestionCode, formProgressStep);
                dispatch({ type: actionTypes.TOGGLE_SEND_FIRST_SUBMIT, payload: false });
                completeMidForm();
            }
        }

        // Handle the mid-form completion when user moves back to the first question and proceeds again
        if (currentQuestionCode !== "business_information" && !sendFirstSubmit) {
            // console.log('log', currentQuestionCode, formProgressStep);
            
            if (currentQuestion?.step === 1 && formProgressStep === 1) {
                // console.log('useQuestionnaire moved back to first question', currentQuestionCode, formProgressStep);
                dispatch({ type: actionTypes.TOGGLE_SEND_FIRST_SUBMIT, payload: true });
                
            }
        }
    }, [currentQuestion, currentQuestionCode, formProgressStep, dispatch]);
};
