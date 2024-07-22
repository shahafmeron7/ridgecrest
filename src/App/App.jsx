import React from "react";

// Absolute imports for cleaner and more maintainable code
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import Questionnaire from "@/components/Questionnaire/Questionnaire.jsx";
import Navbar from "@/components/Navbar/Navbar.jsx";
import ThankYouLayout from "@/layouts/ThankYouLayout.jsx";
// import ContentLayout from "@/layouts/ContentLayout.jsx";
// import Loading from "@/components/UI/LazyLoading/Loading";
// import ScrollToTopButton from "@/components/UI/ScrollToTopButton";

import "./App.css";
// const Footer = React.lazy(() => import("@/components/Footer/Footer.jsx"));
// const BestMatch = React.lazy(() => import("@/components/UI/Promotional/BestMatch.jsx"));
// const FAQ = React.lazy(() => import("@/components/UI/Content/FAQ.jsx"));
// const PartnerWith = React.lazy(
//   () => import("@/components/UI/Promotional/PartnerWith.jsx")
// );



function App() {
  const { questionnaireCompleted} = useQuestionnaire();
  if (questionnaireCompleted) {
    return (
      <div className="AppWrapper">
        <Navbar />
        <ThankYouLayout />
      </div>
    );
  }
  
  return (
    <div className="AppWrapper">
      <Navbar />
      <Questionnaire />
      
    </div>
  );
}

export default App;
