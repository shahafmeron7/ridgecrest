export const isRedirectParams = () => {
   const queryParams = new URLSearchParams(window.location.search);
   let responses = {}
   const fullname = queryParams.get('fullname');
   const email = queryParams.get('email');
   const phone = queryParams.get('phone');
   const revenue = queryParams.get('revenue');
   console.log('here')
 
   if (fullname || email || phone || revenue) {
     if (fullname) {
       responses['full_name'] = {
         step: 1,
         question: "Full name",
         answerIndexes: [],
         answer: fullname
       };
     }
     if (email) {
       responses['email'] = {
         step: 1,
         question: "Email",
         answerIndexes: [],
         answer: email
       };
     }
     if (phone) {
       responses['phone'] = {
         step: 1,
         question: "Phone number",
         answerIndexes: [],
         answer: formatPhoneNumber(phone)
       };
     }
     if (revenue) {
       responses['annual_revenue'] = {
         step: 1,
         question: "How much is your annual revenue?",
         answerIndexes: [revenue === "200K" ? 0 : revenue === "200-500K" ? 1 : 2],
         answer: revenue
       };
     }
     return responses;
 
 }
}