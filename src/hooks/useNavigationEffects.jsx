// useNavigationEffects.js
import { useEffect } from 'react';
import { buildEventData,sendImpressions } from '../utils/impression/impressionUtils';
import env from "@/utils/data/env";

export const useNavigationEffects = (state,moveToPrevQuestion) => {
    const { questionHistory,formProgressStep ,initialResponsesSet,currentQuestion,flowID,flowName, currentQuestionCode, questionnaireCompleted } = state;
    
      
     useEffect(() => {
         const handlePopState = (e) => {
            
            // console.log('before if',questionHistory)
            // console.log('before if currentQuestionCode',currentQuestionCode)

             if (questionHistory.length > 1) {
                // console.log('questionHistory>1')
                 if (questionnaireCompleted) {
                    // console.log('questionnaireCompleted questionHistory>1')

                     window.location.href = "https://ridgecrestfg.com";
                 } else if (currentQuestionCode !== "loader") {
                    // console.log('inside if currentQuestionCode',currentQuestionCode)

                     sendImpressions(
                         buildEventData(formProgressStep,currentQuestion,flowID,flowName,env.USER_ACTION_CLICK_PREV_BROWSER),
                         env.USER_EVENT_NAME,
                         env.STREAM_STEP_NAME
                     );

                     moveToPrevQuestion();
                 }
             } else {
                // console.log(window.history);
             window.history.go(-1);
             }
            //  console.log('in use eefct navigation handlePopState');

         };
        //  console.log('in use eefct navigation');
         window.addEventListener("popstate", handlePopState);
         return () => window.removeEventListener("popstate", handlePopState);
     }, [questionHistory, currentQuestionCode,initialResponsesSet, questionnaireCompleted, moveToPrevQuestion, sendImpressions, buildEventData]);
};
