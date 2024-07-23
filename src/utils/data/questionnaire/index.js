import {questionnaireDataShort} from "./questionnaireDataShort";
import {questionnaireDataLong} from "./questionnaireDataLong";

const appVersion = import.meta.env.VITE_APP_VERSION;

let questionnaireData = appVersion === 'long' ?   questionnaireDataLong : questionnaireDataShort;
// console.log(questionnaireData);

export const areResponsesDifferent = (initialResponses, currentResponses) => {
  //  const filteredCurrentResponses = Object.keys(initialResponses).reduce((acc, key) => {
  //    if (currentResponses[key]) {
  //      acc[key] = currentResponses[key];
  //    }
  //    return acc;
  //  }, {});
   let result =JSON.stringify(initialResponses) !== JSON.stringify(currentResponses); 
   return result;
 };

export default questionnaireData;