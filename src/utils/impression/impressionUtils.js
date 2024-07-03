// src/context/questionnaire/utils/impressionUtils.js

export const buildEventData = (formProgressStep,currentQuestion, flowID,flowName, action = null) => {
    const { step, code, text, type,formSteps } = currentQuestion;
    const subquestions =formSteps[formProgressStep-1].subquestions;


    let questionsData;
    if (type === "details-question" || type === "form-type") {
      questionsData = subquestions.map((sub) => ({
        code: sub.code,
        text: sub.text,
      }));
    } else {
      questionsData = [{ code, text }];
    }
    const currentStep = step >=10 ? step : `0${step}`
    //if this is final step we sent only step without progress of the form substeps.
    const eventStep = code==="thank_you" ? currentStep : `${currentStep}${formProgressStep}`
    const eventData = {
      context: {
        step:eventStep,
        questions: questionsData,
        flow_id: flowID,
        flow_name: flowName,
      },
    };

    if (action) {
      eventData["action"] = action;
    }

    return eventData;
  };
export const sendImpressions = (data,eventName,stream,formID=null)=>{
   
  sendLeadgenImpression(data,eventName,stream,formID);
  
}

function sendLeadgenImpression(data, eventName,stream,formID=null) {
  var to_send = {
    extra: {
      extra_data: data,
      ...(formID !== null && { form: formID })
    },
    event: eventName,
    api: "sonary.com",
    stream: stream,
  };
  let logEvent = new CustomEvent("ry_send_log", {
    detail: to_send,
    bubbles: true,
    composed: false,
  });
  console.log(to_send)
    // window.dispatchEvent(logEvent);
}
