import * as actionTypes from "./actionTypes";
import questionnaireData from "@/utils/data/questionnaire/index.js";
export const initialState = () => {
 
  const initialQuestionCode = questionnaireData.questions[0]?.code;
  const currentQuestion = questionnaireData.questions.find(
    (q) => q.code === initialQuestionCode
  );
  const formQuestions = questionnaireData.questions.filter(
    (q) => q.type === "form-type" || q.type === "document"
  );
  const flowID = questionnaireData.flow_id;
  const flowName = questionnaireData.flow_name;
  return {
    currentQuestion: currentQuestion || {},
    formQuestions: formQuestions || {},
    currentQuestionCode: initialQuestionCode,
    questionHistory: [initialQuestionCode],
    isAnimatingOut: false,
    responses: {},
    midFormResponses: {},
    fullFormResponses:{},
    errResponses: {},
    questionnaireStarted: false,
    questionnaireCompleted: false,
    formProgressStep: currentQuestion.formSteps[0].step,
    inputModified: false,
    nextBtnEnabled: false,
    progressBarWidth: 0,
    sendFirstSubmit:true,
    fullFormSubmitted:false,
    dropdownPaddingNeeded: false,
    paddingValue:0,
    responsesUpdated: false, //first rendering responses updated with params.

    flowID,
    flowName,
    initialResponsesSet:false,
  };
};

export function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_QUESTION_CODE:
      const newQuestion = questionnaireData.questions.find(
        (q) => q.code === action.payload
      );
      return {
        ...state,
        currentQuestionCode: action.payload,
        currentQuestion: newQuestion || {},
      };
    case actionTypes.APPEND_TO_QUESTION_HISTORY:
      return {
        ...state,
        questionHistory: [...state.questionHistory, action.payload],
      };
    case actionTypes.UPDATE_FORM_PROGRESS_STEP:
      return {
        ...state,
        formProgressStep: action.payload,
      };
    case actionTypes.SET_QUESTION_HISTORY:
      return {
        ...state,
        questionHistory: action.payload,
      };
    case actionTypes.SET_PROGRESS_BAR_WIDTH:
      return { ...state, progressBarWidth: action.payload };
    case actionTypes.SET_IS_ANIMATING_OUT:
      return {
        ...state,
        isAnimatingOut: action.payload,
      };
    case actionTypes.SET_RESPONSES:
      //  console.log('setting responses to true')

      return {
        ...state,
        responses: {
          ...state.responses,
          ...action.payload,
        },
        initialResponsesSet: true, // Set to true when initial responses are set

      };
    case actionTypes.UPDATE_RESPONSES:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.questionCode]: action.response,
        },
      

      };
  case actionTypes.SET_FIRST_RESPONSES_FORM:
    return {
     ...state,
     midFormResponses:{
      ...state.midFormResponses,
      ...action.payload
     }    
    }
   case actionTypes.SET_FINAL_RESPONSES:
    return {
      ...state,
      fullFormResponses: {
           ...state.fullFormResponses,
          ...action.payload,
      }
    }
    case actionTypes.SET_ERR_RESPONSES:
      return {
        ...state,
        errResponses: action.payload,
      };

    case actionTypes.CHANGE_NEXT_BTN_STATE:
      return {
        ...state,
        nextBtnEnabled: action.isEnabled,
      };
    case actionTypes.TOGGLE_QUESTIONNAIRE_STARTED:
      return { ...state, questionnaireStarted: action.payload };

    case actionTypes.TOGGLE_QUESTIONNAIRE_COMPLETED:
      return { ...state, questionnaireCompleted: action.payload };
      case actionTypes.TOGGLE_SEND_FIRST_SUBMIT:
        return {...state,sendFirstSubmit:action.payload};
        case actionTypes.TOGGLE_SEND_FINAL_SUBMIT:
          return {...state,fullFormSubmitted:action.payload};
    case actionTypes.SET_TARGET_FORM_ID:
      return { ...state, targetFormID: action.payload };

    case actionTypes.SET_INPUT_MODIFIED:
      return { ...state, inputModified: action.payload };
    case actionTypes.UPDATE_DROPDOWN_PADDING:
      return {
        ...state,
        dropdownPaddingNeeded: action.payload.isNeeded,
        paddingValue: action.payload.paddingValue,
      };

    default:
      return state;
  }
}
