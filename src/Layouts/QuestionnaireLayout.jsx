import React from "react";
import styles from './QuestionnaireLayout.module.css'
import useIsWideScreen from "@/hooks/useIsWideScreen";

import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
const QuestionnaireLayout = React.forwardRef(({ children }, ref) => {
  const { questionnaireStarted,currentQuestionCode } = useQuestionnaire();
  const isEmailStep = currentQuestionCode ==="email";
  const isWideScreen = useIsWideScreen();
  const mobileStyle = {
    // height: "80vh",
    // minHeight: "100%",
    // overflowY: "scroll",
    // paddingBottom:" 80px", 
     paddingTop:"0px"
  }
  return (
    <div ref={ref}  className={styles.questionnaireLayout} >
      <div className={styles.questionnaireWrapper} >
      <div className={styles.questionnaireContent}>

      {children}
      </div>
      </div>
    </div>
  );
});


export default QuestionnaireLayout;
