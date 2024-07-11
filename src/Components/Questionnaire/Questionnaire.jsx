import React, { useContext } from "react";

import QuestionnaireLayout from "@/layouts/QuestionnaireLayout";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import useLoader from "@/hooks/useLoader";
import useAnimations from "@/hooks/useAnimations";
import AnswersContent from "@/components/Questionnaire/types/AnswersContent";

import Loader from "@/components/Questionnaire/types/Loader";
import QuestionnaireWrapper from "@/layouts/QuestionnaireWrapper";
import FormProgress from "@/components/UI/Form/FormProgress";

import FormIcons from "@/components/UI/Form/FormIcons";
import QuestionnaireButtons from "@/components/UI/Form/QuestionnaireButtons";
import QuestionnaireTitle from "@/components/UI/QuestionnaireTitle";

import styles from "./Questionnaire.module.css";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import OsanoVisibilityContext from "@/context/OsanoVisibilityContext";

const Questionnaire = () => {
  const { questionnaireStarted,dropdownPaddingNeeded,paddingValue } = useQuestionnaire();
  const { osanoShown } = useContext(OsanoVisibilityContext);
  const isWideScreen = useIsWideScreen();
  const showLoader = useLoader();
  const layoutRef = useAnimations();
  const paddingBottomDropdown = dropdownPaddingNeeded ? paddingValue : 0;
  const baseMobilePadding = osanoShown ? 170 : 88;
  
  const mobileStyle = {
    paddingBottom: `${baseMobilePadding + paddingBottomDropdown}px`,
  };

  const computedStyle = questionnaireStarted && !isWideScreen ? mobileStyle : { paddingBottom: `${paddingBottomDropdown}px` };


  if (showLoader) {
    return (
      <QuestionnaireLayout ref={layoutRef}>
        <QuestionnaireWrapper>
          <Loader />
        </QuestionnaireWrapper>
      </QuestionnaireLayout>
    );
  }

  return (
    <QuestionnaireLayout ref={layoutRef}>
      <QuestionnaireTitle />
      <FormProgress />
      <QuestionnaireWrapper>
        <div
          className={styles.contentWrapper}
          style={computedStyle}
        >
          <AnswersContent />
        
          <QuestionnaireButtons />
          {!questionnaireStarted && <FormIcons />}
        </div>
      </QuestionnaireWrapper>
    </QuestionnaireLayout>
  );
};

export default Questionnaire;
