import validator from "validator";
function isValidZipCode(zipCode) {
  // const regex = /^\d{5}(?:-\d{4})?$|^(\d{3} \d{3})$/;
  const regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return regex.test(zipCode) && !zipCode.includes("0000");
}
function isValidPhone(phone) {
  return /^(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?([2-9]\d{2})[-.\s]?(?!\1{3})\d{4}$/.test(
    phone
  );
}
function isValidAddress(address) {
  const regex = /^[#.0-9a-zA-Z\s,-]+$/;
  return regex.test(address);
}
function validateURL(url) {
  const regex =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  // const regex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?([a-zA-Z0-9-._~:@!$&'()*+,;=]*)?$/;

  // console.log('url validation', regex)
  return regex.test(url);
}
function validateCompanyName(name) {
  const regex = /^.{2,}$/;
  return regex.test(name);

}
function validateName(name) {
  const regex = /^[a-zA-Z\s]{2,}$/;
  return regex.test(name);
}
function validateSSN(ssn) {
  const regex = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return regex.test(ssn);
}
function validateTaxID(taxId) {
  return /^\d{7,9}$/.test(taxId);
}
export const validateField = (type, val) => {
  if(!val){
    return false;
  }
  switch (type) {
    case "email":
      return validator.isEmail(val);
    case "zip":
      return isValidZipCode(val);
    case "company_name":
      return validateCompanyName(val)

    case "name":
      return validateName(val);
    case "phone":
      return isValidPhone(val);
    case "address":
      return isValidAddress(val);
    case "url":
      return validateURL(val);
    case "tax_id":
      return /^\d{2}-\d{7}$/.test(val);
    case "ssn":
      return validateSSN(val);
    default:
      return true;
  }
};
