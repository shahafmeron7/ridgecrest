// src/context/questionnaire/eventHandlers.js
import * as actionTypes from "./../../reducers/actionTypes.js";
import { useCallback } from "react";
import { validateField } from "@/utils/validationUtils";
import { gsap } from "gsap";
import questionnaireData from "@/utils/data/questionnaire/index";

import { areResponsesDifferent } from "@/utils/data/questionnaire/index.js";
import {
  buildEventData,
  sendImpressions,
} from "@/utils/impression/impressionUtils";



import env from "@/utils/data/env";

const TIME_DELAY_NEXT_QUESTION = 0.2;

export const QuestionnaireHandlers = (state, dispatch) => {
  const findQuestion = (questionCode) => {
    return questionnaireData.questions.find((q) => q.code === questionCode);
  };
  const animateAndNavigate = (
    onComplete,
    nextProgressWidth = null,
    delay = 0
  ) => {
    dispatch({ type: actionTypes.SET_IS_ANIMATING_OUT, payload: true });
    const tl = gsap.timeline({
      onComplete: () => {
        dispatch({ type: actionTypes.SET_IS_ANIMATING_OUT, payload: false });
        onComplete();
        window.scrollTo({ top: 0, behavior: 'smooth' });

      },
    });

    // tl.to(".progressLine", {
    //   width: `${nextProgressWidth}%`,
    //   duration: 0.3,
    //   ease: "none",
    // });

    tl.to(
      ".animateFadeOut",
      {
        opacity: 0,
        delay: delay,
        duration: 0.1,
      },
      `+=0.1`
    );
    
  };

  const moveToPrevQuestion = () => {
    const { questionHistory, formProgressStep, currentQuestion } = state;

    if (formProgressStep > 1) {
      // If there are previous form steps, move back to the previous form step
      animateAndNavigate(() => {
        dispatch({
          type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
          payload: formProgressStep - 1,
        });
      }, 100);
    } else if (questionHistory.length > 1) {
      // If there are no previous form steps, move back to the previous general question
      const newHistory = questionHistory.slice(0, -1);
      const prevQuestionCode = newHistory[newHistory.length - 1];

      const prevQuestion = findQuestion(prevQuestionCode);
      const prevStep = prevQuestion.step;
      const newProgressBarWidth = Math.min(
        100,
        Math.round(((prevStep - 1) / (4 - 1)) * 100)
      );

      animateAndNavigate(() => {
        dispatch({
          type: actionTypes.SET_CURRENT_QUESTION_CODE,
          payload: prevQuestionCode,
        });
        dispatch({
          type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
          payload: prevQuestion.formSteps ? prevQuestion.formSteps.length : 1,
        });
      }, newProgressBarWidth);

      dispatch({ type: actionTypes.SET_QUESTION_HISTORY, payload: newHistory });
      
    }
  };
  const proceedToNextStep = () => {
    const { currentQuestion, formProgressStep } =state;
    const currentFormStep = formProgressStep;
    const totalFormSteps = currentQuestion.formSteps.length;
  
    if (currentFormStep < totalFormSteps) {
      // Move to next form step within the current question
      handleFormStepNavigation(currentFormStep + 1);
    } else {
      // Move to the next question and reset formProgressStep
      const nextQuestionCode = currentQuestion.answers[0]?.next_question_code;
      if (nextQuestionCode) {
        handleNextQuestionNavigation(nextQuestionCode);
      }
    }
  };
  const handleFormStepNavigation = (nextStep) => {
    animateAndNavigate(
      () => {
        dispatch({
          type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
          payload: nextStep,
        });
      },
      100, // need to replace this with progress with (old leadgens). for now it does not matter.
      TIME_DELAY_NEXT_QUESTION
    );
  };
  const handleNextQuestionNavigation = (nextQuestionCode) => {
    animateAndNavigate(
      () => {
        dispatch({
          type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
          payload: 1,
        });
        handleNavigateNextQuestion(nextQuestionCode);
      },
      100, // need to replace this with progress with (old leadgens). for now it does not matter.
      TIME_DELAY_NEXT_QUESTION
    );
  };
  const handleProceedToNext = (proceedToNext,newErrResponses) => {
    const { currentQuestion, formProgressStep,  flowID,flowName } =state;

    if (proceedToNext) {
      proceedToNextStep();
  
      const eventData = buildEventData(
        formProgressStep,
        currentQuestion,
        flowID,
        flowName,
        env.USER_ACTION_CLICK_NEXT
      );
      sendImpressions(eventData, env.USER_EVENT_NAME, env.STREAM_STEP_NAME);
    } else {
      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };
  const checkFormFileFields = () => {
    let proceedToNext = true;
    let nextQuestionCode;
    const { currentQuestion, responses, formProgressStep } =
      state;
    const newErrResponses = {};
    const subquestions =
      currentQuestion.formSteps?.[formProgressStep - 1].subquestions;
      if (currentQuestion.type === "document") {
        const sub  = subquestions[0]
        const response = responses[sub.code]?.answer;
  
        //fallback to document type or any new type of step.
       if (sub.element === "checkbox") {
          if (
            response === null ||
            response === undefined ||
            response === "off" ||
            response.trim() === ""
          ) {
            // console.log('checkbox',response)
  
            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question
  
          }
        nextQuestionCode = currentQuestion.answers[0]?.next_question_code;
        // console.log('document proceed next,',nextQuestionCode);
      }
    }
    if(proceedToNext){
      return proceedToNext
    }else{
      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  }
  const moveToNextQuestion = () => {
    let proceedToNext = true;
    let nextQuestionCode;
    const { currentQuestion, responses, flowID, flowName, formProgressStep } =
      state;
    const newErrResponses = {};
    const subquestions =
      currentQuestion.formSteps?.[formProgressStep - 1].subquestions;

    if (
      currentQuestion.type === "details-question" ||
      currentQuestion.type === "form-type"
    ) {
      subquestions.forEach((sub) => {
        const response = responses[sub.code]?.answer;
        if (sub.element === "input" || sub.element === "free_text") {
          if (!sub.code.includes('website') && !validateField(sub.validationCode, response)) {

            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question
          }
        } else if (sub.element === "dropdown" || sub.element === "selection") {
          if (
            response === null ||
            response === undefined ||
            response.trim() === ""
          ) {
            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question
          }
        } else if (sub.element === "checkbox") {
          if (
            response === null ||
            response === undefined ||
            response === "off" ||
            response.trim() === ""
          ) {

            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question

          }
        }else if(sub.element==="birthdate"){
          // console.log('next question move response ', response);
           if(!Object.keys(response).every(key => response[key] !== '')){
            proceedToNext = false;
            newErrResponses[sub.code] = true; 
          }
          
        }
        else if (sub.element === "percentage") {
          if (
            response === null ||
            response === undefined ||
            response.trim() === ""
          ) {
            //  console.log('percentage',response)

            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question

          }
        }

      });

      nextQuestionCode = currentQuestion.answers[0]?.next_question_code;

      // console.log("movetonextquestion", proceedToNext);
    } else if (currentQuestion.type === "one-selection") {
      const response = responses[currentQuestion.code];
      if (response && response.answerIndexes) {
        const selectedIndex = response.answerIndexes[0];

        nextQuestionCode =
          currentQuestion.answers[selectedIndex]?.next_question_code;
      } else {
        proceedToNext = false;
      }
    } else if (currentQuestion.type === "multi-selection") {
      const response = responses[currentQuestion.code];
      if (
        response &&
        response.answerIndexes &&
        response.answerIndexes.length > 0
      ) {
        nextQuestionCode =
          currentQuestion.answers[response.answerIndexes[0]]
            ?.next_question_code;
      } else {
        proceedToNext = false;
      }
    }
    else if (currentQuestion.type === "document") {
      const sub  = subquestions[0]
      const response = responses[sub.code]?.answer;

      //fallback to document type or any new type of step.
     if (sub.element === "checkbox") {
        if (
          response === null ||
          response === undefined ||
          response === "off" ||
          response.trim() === ""
        ) {
          // console.log('checkbox',response)

          proceedToNext = false;
          newErrResponses[sub.code] = true; // Set error for this sub-question

        }
      nextQuestionCode = currentQuestion.answers[0]?.next_question_code;
      // console.log('document proceed next,',nextQuestionCode);
    }
  }
    handleProceedToNext(proceedToNext,newErrResponses);
    // if (proceedToNext) {
    //   const currentFormStep = formProgressStep;
    //   const totalFormSteps = currentQuestion.formSteps.length;
    //   if (currentFormStep < totalFormSteps) {
    //     // Move to next form step within the current question
    //     // console.log('moving form step')
    //     animateAndNavigate(
    //       () => {
    //         dispatch({
    //           type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
    //           payload: currentFormStep + 1,
    //         });
    //       },
    //       100, // need to replace this with progress with (old leadgens). for now it does not matter.
    //       TIME_DELAY_NEXT_QUESTION
    //     );
    //   } else {
    //     // Move to the next question and reset formProgressStep
    //     nextQuestionCode = currentQuestion.answers[0]?.next_question_code;

    //     if (nextQuestionCode) {
    //       // console.log('moving question code')

    //       animateAndNavigate(
    //         () => {
    //           // goToNext(nextQuestionCode)
    //           dispatch({
    //             type: actionTypes.UPDATE_FORM_PROGRESS_STEP,
    //             payload: 1,
    //           });
    //           handleNavigateNextQuestion(nextQuestionCode);
    //         },
    //         100, // need to replace this with progress with (old leadgens). for now it does not matter.
    //         TIME_DELAY_NEXT_QUESTION
    //       );
    //     }
    //   }
    //   const eventData = buildEventData(
    //     formProgressStep,
    //     currentQuestion,
    //     flowID,
    //     flowName,
    //     env.USER_ACTION_CLICK_NEXT
    //   );
    //   sendImpressions(eventData, env.USER_EVENT_NAME, env.STREAM_STEP_NAME);

    // } else {
    //   dispatch({
    //     type: actionTypes.SET_ERR_RESPONSES,
    //     payload: newErrResponses,
    //   });
    // }
  };

  const handleNavigateNextQuestion = (nextQuestionCode) => {
    // console.log('im navigating next with ;',nextQuestionCode)
    if (nextQuestionCode !== "loader") {
      dispatch({
        type: actionTypes.APPEND_TO_QUESTION_HISTORY,
        payload: nextQuestionCode,
      });
    }
    dispatch({
      type: actionTypes.SET_CURRENT_QUESTION_CODE,
      payload: nextQuestionCode,
    });
    window.history.pushState({}, null, " ");
    // window.history.pushState({ questionCode: nextQuestionCode }, null, " ");

  };

  const handleMultipleAnswerSelection = (questionCode, selectedIndexes) => {
    const { currentQuestion } = state;
    const answersData = selectedIndexes.map((index) => {
      return {
        text: currentQuestion.answers[index].text,
        index: index,
      };
    });

    const response = {
      answer: answersData.map((answer) => answer.text).join(", "),
      answerIndexes: selectedIndexes,
      step: currentQuestion.step,
      question: currentQuestion.text,
    };

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: response,
    });
  };
  const checkAndEnableNextButton = useCallback(() => {
    const { currentQuestion, responses, formProgressStep } = state;
    const subquestions =
      currentQuestion.formSteps?.[formProgressStep - 1].subquestions;
    // console.log("checkAndEnableNextButton subq",subquestions);
    if (
      currentQuestion.type === "details-question" ||
      currentQuestion.type === "form-type"
    ) {
      // Check if all subquestions have been answered
      const allSubquestionsAnswered = subquestions.every((sub) => {
        const response = responses[sub.code];

        // Check for different input types
        if (sub.element === "input" || sub.element === "free_text" || sub.element==="percentage") {
          if(sub.code.includes('website')) return true;
          return response && response.answer && response.answer.trim() !== "";
        } 
         else if (sub.element === "dropdown" || sub.element === "selection") {
           return response && response.answer !== null && response.answer !== "";
        } 
         else if (sub.element === "birthdate") {
           return (
             response &&
             response.answer && (

               response.answer.day !== "" ||
               response.answer.month !== "" ||
               response.answer.year !== ""
              )
           );
         } 
        
        return true;
        // else if (sub.element === "checkbox") {
        //   return (
        //     response &&
        //     response.answer &&
        //     response.answer.trim() !== "" &&
        //     response.answer != "false"
        //   );
        // }
        // Fallback to default check for other types
        // return response && response.answer && response.answer.trim() !== "";
      });
      dispatch({
        type: actionTypes.CHANGE_NEXT_BTN_STATE,
        isEnabled: allSubquestionsAnswered,
      });
    } else {
      const response = responses[currentQuestion.code];
      let isAnswered = false;

      if (response) {
        // Separate logic for one-selection, which may include an 'other' text input
        if (currentQuestion.type === "one-selection") {
          if (response.answerIndexes.length > 0) {
            const answerIndex = response.answerIndexes[0]; // Since one-selection should have only one index
            if (currentQuestion.answers[answerIndex].isOther) {
              // Check if other text is not empty when 'Other' option is selected
              isAnswered =
                response.other_text !== undefined &&
                response.other_text !== null &&
                response.other_text.trim() !== "";
            } else {
              // Regular answer is selected

              isAnswered = true;
            }
          }
        } else if (currentQuestion.type === "multi-selection") {
          isAnswered = response.answerIndexes.length > 0;
        }
      }
      dispatch({
        type: actionTypes.CHANGE_NEXT_BTN_STATE,
        isEnabled: isAnswered,
      });
    }
  }, [
    state.currentQuestionCode,
    state.formProgressStep,
    state.responses,
    dispatch,
  ]);

  const handleAnswerSelection = (questionCode, answerIndex) => {
    const { currentQuestion, responses } = state;
    const answer = currentQuestion.answers[answerIndex];
    const answerText = answer?.text;
    const existingResponse = responses[questionCode] || {};

    const newResponse = {
      ...existingResponse,
      answer: answerText,
      answerIndexes: [answerIndex],
      step: currentQuestion.step,
      question: currentQuestion.text,
    };

    if (answer?.isOther) {
      newResponse.other_text = existingResponse.other_text || "";
    } else {
      if (newResponse.other_text) {
        delete newResponse.other_text;
      }
    }

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: newResponse,
    });
    const nextQuestionCode = answer?.next_question_code;
    if (nextQuestionCode) {
      const nextStep = findQuestion(nextQuestionCode).step;
      const newProgressBarWidth = Math.min(
        100,
        Math.round(((nextStep - 1) / (4 - 1)) * 100)
      );
      dispatch({
        type: actionTypes.SET_PROGRESS_BAR_WIDTH,
        payload: newProgressBarWidth,
      });

      animateAndNavigate(
        () => {
          handleNavigateNextQuestion(nextQuestionCode);
        },
        newProgressBarWidth,
        TIME_DELAY_NEXT_QUESTION
      );
    }
  };
  const handleDateChange = (questionCode, type, inputValue, inputIndex) => {
    // console.log('date type',type);
    const { currentQuestion, responses,errResponses, formProgressStep } = state;
    const subquestions =
      currentQuestion.formSteps?.[formProgressStep - 1].subquestions;
// console.log('handle date change');
    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type"
          ? subquestions.find((sub) => sub.code === questionCode).text
          : currentQuestion.text,
      answerIndexes: [-1, -1, -1], // Initial indexes for day, month, year

      answer: {
        day: "",
        month: "",
        year: "",
      },
    };
    // console.log("currentResponse",currentResponse);
    // console.log("inputValue",inputValue);

    // Update the specific type (day, month, or year) in the answer
    const answerToUpdate = currentResponse.dob_answer || currentResponse.answer;
      answerToUpdate[type] = inputValue;
    //  console.log('updated answer',answerToUpdate)
    // Update the answerIndexes based on the type
    const updatedAnswerIndexes = [...currentResponse.answerIndexes];
    if (type === "day") {
      updatedAnswerIndexes[0] = inputIndex;
    } else if (type === "month") {
      updatedAnswerIndexes[1] = inputIndex;
    } else if (type === "year") {
      updatedAnswerIndexes[2] = inputIndex;
    }
    // Update the response with the new answer
    const updatedResponse = {
      ...currentResponse,
      answer: answerToUpdate,
      answerIndexes: updatedAnswerIndexes,
    };

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });
    if (errResponses[questionCode]) {
      const newErrResponses = { ...errResponses };

      delete newErrResponses[questionCode]; // Remove the error entry for this question

      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };

  const handleSelectionInputChange = (
    questionCode,
    answerIndex,
    type = null
  ) => {
    const { currentQuestion, responses,errResponses, formProgressStep } = state;
    const subquestions =
      currentQuestion.formSteps[formProgressStep - 1].subquestions;
      // console.log('answer index,',answerIndex);
    let selectedAnswer =
      type === "checkbox"
        ? answerIndex === 0
          ? "off"
          : "on"
        : subquestions.find((sub) => sub.code === questionCode).answers[
            answerIndex
          ];

    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type" ||
        currentQuestion.type === "document"

          ? subquestions.find((sub) => sub.code === questionCode).text
          : currentQuestion.text,
      answerIndexes: [],
    };

    const updatedResponse = {
      ...currentResponse,
      answerIndexes: [answerIndex],
      answer: selectedAnswer,
    };
    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });
    if (errResponses[questionCode]) {
      const newErrResponses = { ...errResponses };

      delete newErrResponses[questionCode]; // Remove the error entry for this question

      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };
  const handleCheckboxChange = (questionCode, isChecked) => {
    const { currentQuestion, responses, errResponses, formProgressStep } =
      state;
  };
  const handleInputChange = (questionCode, inputValue, isOther = false) => {
    const { currentQuestion, responses, errResponses, formProgressStep } =
      state;
    const subquestions =
      currentQuestion.formSteps[formProgressStep - 1].subquestions;

    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type"
          ? subquestions.find((sub) => sub.code === questionCode).text
          : currentQuestion.text,
      answerIndexes: [],
    };

    let updatedResponse;

    if (!isOther) {
      updatedResponse = {
        ...currentResponse,
        answer: inputValue,
      };
    } else {
      const otherIndex = currentQuestion.answers.findIndex(
        (answer) => answer.isOther
      );
      const otherAnswerText = currentQuestion.answers[otherIndex].text;
      updatedResponse = {
        ...currentResponse,
        answer: otherAnswerText,
        other_text: inputValue,
        answerIndexes: [otherIndex],
      };
    }
    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });

    if (errResponses[questionCode]) {
      const newErrResponses = { ...errResponses };

      delete newErrResponses[questionCode]; // Remove the error entry for this question

      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };
  const completeMidForm=()=>{
    const { responses ,midFormResponses} = state;
  const relevantKeys = ['privacy_consent', 'annual_revenue', 'phone', 'email', 'full_name'];
  let midResponses = {};

  // Filter responses to only include relevant keys
  const filteredResponses = Object.keys(responses)
    .filter(key => relevantKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = responses[key];
      return obj;
    }, {});
  // Adjust the filtered responses
  Object.entries(filteredResponses).forEach(([key, value]) => {
    value.users_answer = value.answer;
  });

  // Remove answerIndexes from filtered responses
  midResponses = Object.keys(filteredResponses).reduce((acc, key) => {
    const { answerIndexes, ...responseWithoutIndexes } = filteredResponses[key];
    acc[key] = responseWithoutIndexes;
    return acc;
  }, {});
  if (areResponsesDifferent(midFormResponses, midResponses)) {
    sendImpressions(
      midResponses,
      env.FIRST_SUBMIT_EVENT_NAME,
      env.STREAM_FINAL_NAME,
      env.RIDGE_FORM_ID,
    );
    dispatch({ type: actionTypes.SET_FIRST_RESPONSES_FORM, payload: midResponses });

  }
  
  }
  const completeQuestionnaire = () => {
    const { responses,fullFormResponses } = state;
    let finalResponses = {};

    // console.log('final responses complete before birth_date change');
    // console.log('responses',responses);
    Object.entries(responses).forEach(([key, value]) => {
      value.users_answer = value.answer;
      if (key === "birth_date") {
        
        const { day, month, year } = value.dob_answer || value.answer;
        // console.log('in dob:',day,month,year);
        const monthIndex = new Date(`${month} 1`).getMonth() + 1;
        const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
        value.dob_answer= value.dob_answer || value.answer;
        value.answer = `${day}/${formattedMonth}/${year}`;
        value.users_answer = `${day}/${formattedMonth}/${year}`;
      }
    });
  
    finalResponses = Object.keys(responses).reduce((acc, key) => {
      const { answerIndexes,dob_answer, ...responseWithoutIndexes } = responses[key];
      acc[key] = responseWithoutIndexes;
      return acc;
    }, {});

    if (areResponsesDifferent(fullFormResponses, finalResponses)) {
    // console.log('different changing responses fullform');

      sendImpressions(
        finalResponses,
        env.FINAL_SUBMIT_EVENT_NAME,
        env.STREAM_STEP_NAME,
        env.RIDGE_FORM_ID
      );
      dispatch({ type: actionTypes.SET_FINAL_RESPONSES, payload: finalResponses });

    }
    
  }

  const changeNextBtnState = (isEnabled) => {
    dispatch({ type: actionTypes.CHANGE_NEXT_BTN_STATE, isEnabled: isEnabled });
  };
  const toggleDropdownPadding= (isNeeded,paddingValue) => {

    dispatch({ type: actionTypes.UPDATE_DROPDOWN_PADDING, payload: {isNeeded,paddingValue} });
  }

  return {
    animateAndNavigate,
    moveToPrevQuestion,
    checkAndEnableNextButton,
    moveToNextQuestion,
    handleNavigateNextQuestion,
    handleMultipleAnswerSelection,
    handleAnswerSelection,
    handleInputChange,
    handleDateChange,
    handleSelectionInputChange,
    completeQuestionnaire,
    changeNextBtnState,
    toggleDropdownPadding,
    checkFormFileFields,
    proceedToNextStep,
    completeMidForm
  };
};
