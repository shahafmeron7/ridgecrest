
function isValidZipCode(zipCode) {
    const regex = /^\d{5}(?:-\d{4})?$|^(\d{3} \d{3})$/;
    return regex.test(zipCode) && !zipCode.includes("0000");
  }
  function isValidPhone(phone) {
    return /^(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?([2-9]\d{2})[-.\s]?(?!\1{3})\d{4}$/.test(
      phone
    );
  }
  export const validateField = (type, val) => {
    switch (type) {
        case "email":
            return validator.isEmail(val);
        case "zip":
            return isValidZipCode(val);
        case "name":
        case "company_name":
            return val.trim().length >= 2;
        case "phone":
            return isValidPhone(val);
        case "percentage":
            return val >= 0 && val <= 100;
        case "address":
            return isValidAddress(val);
        case "url":
            return validator.isURL(val);
        case "tax_id":
            return /^\d{7,9}$/.test(val);
        default:
            return true;
    }
};