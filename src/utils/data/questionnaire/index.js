import {questionnaireDataShort} from "./questionnaireDataShort";
import {questionnaireDataLong} from "./questionnaireDataLong";

const appVersion = import.meta.env.VITE_APP_VERSION;

let questionnaireData = appVersion === 'long' ?   questionnaireDataLong : questionnaireDataShort;
// console.log(questionnaireData);

export default questionnaireData;