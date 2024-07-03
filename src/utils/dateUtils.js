const generateDays = (month, year) => {
   const daysInMonth = new Date(year, month, 0).getDate();
   return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
 };
 
 // Generate months
 const generateMonths = () => [
   "January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
 ];
 // Generate years starting from 2006
 const generateYears = (startYear, endYear) => {
   const years = [];
   for (let year = startYear; year <= endYear; year++) {
     years.push(year.toString());
   }
   return years;
 };

 export {generateDays,generateMonths,generateYears}