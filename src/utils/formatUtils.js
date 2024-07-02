const formatPhoneNumber = (value) => {
   const phoneNumber = value.replace(/[^\d]/g, "");
   const phoneNumberLength = phoneNumber.length;
 
   if (phoneNumberLength < 4) return phoneNumber;
   if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
   return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
 };
 
 const formatTaxId = (value) => {
   const taxId = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
   const taxIdLength = taxId.length;
 
   if (taxIdLength <= 2) return taxId;
   return `${taxId.slice(0, 2)}-${taxId.slice(2, 9)}`;
 };
 
 const formatSSN = (value) => {
   const ssn = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
   const ssnLength = ssn.length;
 
   if (ssnLength <= 3) return ssn;
   if (ssnLength <= 5) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
   return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
 };
 
 const formatInputValue = (value, validationCode) => {
   switch (validationCode) {
     case "phone":
       return formatPhoneNumber(value);
     case "ssn":
       return formatSSN(value);
     case "tax_id":
       return formatTaxId(value);
     case "zip":
       return value.replace(/[^\d]/g, ""); // Only allow numbers
     default:
       return value;
   }
 };
 
 export default formatInputValue;
 