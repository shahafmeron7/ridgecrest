const generateDays = (month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  // console.log('im here generate days daysInMonth',daysInMonth)
  const res =Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  // console.log('days:',res)
   return res;
 };
 
 // Generate months
 const generateMonths = () => [
   "January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
 ];
 const generateMonthsMobile = () =>[
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
 ]
 // Generate years starting from 2006
 const generateYears = (startYear, endYear) => {
   const years = [];
   for (let year = startYear; year <= endYear; year++) {
     years.push(year.toString());
   }
   return years.reverse();
 };

 export {generateDays,generateMonths,generateMonthsMobile,generateYears}