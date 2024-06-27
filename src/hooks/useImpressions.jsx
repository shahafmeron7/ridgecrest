// useImpressions.js
import { useEffect, useRef } from 'react';
import { buildEventData,sendImpressions } from '../utils/impression/impressionUtils';
import Impression from '../utils/impression/impression';
import env from "@/utils/data/env";

export const useFirstImpression = () => {
    const hasSentImpression = useRef(false);

    useEffect(() => {
        if (!hasSentImpression.current) {
            Impression();
            sendImpressions(
                {},
                env.FIRST_EVENT_NAME,
                env.STREAM_STEP_NAME
            );
            hasSentImpression.current = true;
        }
    }, []);
};

export const useQuestionImpressions = (state) => {
    const  { currentQuestionCode,currentQuestion,flowID,flowName } =state 
    useEffect(() => {
        sendImpressions(
            buildEventData(currentQuestion,flowID,flowName),
            env.STEP_EVENT_NAME,
            env.STREAM_STEP_NAME
        );
    }, [currentQuestionCode,currentQuestion,flowID,flowName]);
};

export const useUnloadImpressions = (state) => {
    const  { currentQuestion,flowID,flowName } = state 

    useEffect(() => {
        const handleUnload = (e) => {
            // e.preventDefault();
            sendImpressions(
                buildEventData(currentQuestion,flowID,flowName,env.USER_ACTION_EXIT),
                env.USER_EVENT_NAME,
                env.STREAM_STEP_NAME
            );
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    },[]);
};
