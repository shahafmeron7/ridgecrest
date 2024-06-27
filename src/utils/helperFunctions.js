
function isValidZipCode(zipCode) {
  const regex = /^\d{5}(?:-\d{4})?$|^(\d{3} \d{3})$/;
  return regex.test(zipCode) && !zipCode.includes("0000");
}
function isValidPhone(phone) {
  return /^(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?([2-9]\d{2})[-.\s]?(?!\1{3})\d{4}$/.test(
    phone
  );
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}
export function updatePaycorResponseFormat(finalResponses) {
  // // Helper function to format answer with potential 'other_text'
  // function formatAnswer(questionCode) {
  //   let baseAnswer = questionCode.question + ' ' + questionCode.users_answer;
  //   // Append 'other_text' to the answer if 'users_answer' is "Other" and 'other_text' exists
  //   if (questionCode.other_text) {
  //     baseAnswer += ' : ' + questionCode.other_text;
  //   }
  //   return baseAnswer;
  // }

  // // Concatenate the formatted answers for 'purchase_time'
  // finalResponses['purchase_time'].answer = 
  //   formatAnswer(finalResponses['purchase_time']) + ', ' + 
  //   formatAnswer(finalResponses['solution_reason']);

  // // Concatenate the formatted answers for 'solution_reason' similarly
  // finalResponses['solution_reason'].answer = 
  //   formatAnswer(finalResponses['purchase_time']) + ', ' + 
  //   formatAnswer(finalResponses['solution_reason']);

    let phoneNumber = finalResponses['phone'].answer;
  finalResponses['phone'].answer=formatPhoneNumber(phoneNumber);
}

export const validateField = (type, val) => {
    switch (type) {
      case "email":
        return /^\S+@\S+\.\S+$/.test(val);
      case "zip_code":
        return isValidZipCode(val);
      case "first_name":
      case "last_name":
      case "company_name":
          return val.trim().length >= 2;
      case "phone":
        return isValidPhone(val);
      default:
        return true;
    }
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
    // console.log(to_send)
      window.dispatchEvent(logEvent);
  }
  