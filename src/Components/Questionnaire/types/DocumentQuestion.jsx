import React from 'react'
import styles from './DocumentQuestion.module.css'
import FileUpload from '@/components/file/FileUpload'
import FileUploadContainer from '../../file/FileUploadContainer'
import pdfIcon from '@/images/pdficon.svg?url'
import iphoneIcon from '@/images/iphoneblueicon.svg?url'
import emailIcon from '@/images/emailblueicon.svg?url'
import shieldIcon from '@/images/shieldIcon.svg?url'
import lockIcon from '@/images/lockpurple.svg?url'
import {getLastThreeMonths} from "@/utils/dateUtils.js"


const DocumentQuestion = () => {
   const months = getLastThreeMonths();
   const replacementMonth = new Date(new Date().setMonth(new Date().getMonth() - 3));
   const replacementMonthName = `${
     ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][replacementMonth.getMonth()]
   } ${replacementMonth.getFullYear()}`;

  return (
    <div className={styles.documentContainer}>

      <div className={styles.leftContainer}>
            <h4>Provide Bank Statements for Financial Review</h4>
            <p>In order to finish reviewing your application, we will need to examine your most up-to-date business checking account activity for the past 90 days.</p>
            <span>*If you don't have this most recent month's statement, please provide the previous month's full statement.</span>

            <div className={styles.infoContainer}>
               <ul>
                  <li>
                  <img src={lockIcon} alt="phone icon" width="18" height="18" />
                  All personal and financial data are encrypted.</li>

                  <li>
                  <img src={shieldIcon} alt="email icon" width="18" height="18" />
                  By providing bank statements, you are not giving RCFG access to deposit or withdraw funds from your account. This information is strictly for application review purposes only.</li>
               </ul>
               
            </div>
            <div>
               <p>We use this information for purposes including evaluating applications for funds, or to conduct internal reviews, to evaluate your credit limit, or determine if you might benefit from a payment plan, to determine your eligibility for other products, services, or features, in order to improve, modify or develop our service method and products, and/or use for quality assurance purposes.</p>
              
            </div>
            <p>
               See RCFG's <a href="https://ridgecrestfg.com/privacy-policy/">Privacy Policy</a> for more information.
               </p>
            <p>To delete and/or disconnect your account information or any other information collected by RCFG, LLC please send an email to <a  href="mailto:admin@ridgecrestfg.com">admin@ridgecrestfg.com</a>.</p>
      </div>
      <div className={styles.rightContainer}>
      <div>
      <div className={styles.rightTopHeader}>
         <div className={styles.rightTop}>
               <h4>For instructions on how to download your bank statements, please visit your bank's website or search in google "How to download (bank name) bank statements"</h4>
                  <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                     <p>Loan Specialists are available Monday - Friday 9 a.m. - 8 p.m. EDT</p>
                     <ul style={{display:"flex",gap:"16px"}}>
                        <a href="mailto:contact@ridgecrestfg.com" style={{display:"flex",gap:"4px",alignItems:"center"}}>  
                        <img src={emailIcon} alt="email icon" width="24" height="24" />

                        Email us</a>
                        <a href="mailto:contact@ridgecrestfg.com" style={{display:"flex",gap:"4px",alignItems:"center"}}>  
                        <img src={iphoneIcon} alt="phone icon" width="24" height="24" />
                        Schedule a Call</a>
                     </ul>
                  </div>
         </div>
         <p>All banking information provided is for internal use only and will not be shared with anyone outside of the Ridge Crest Financial Group, LLC and its funding partners.</p>
         <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>

         <h4>Upload Your PDF Bank Statements:</h4>
         <ul className={styles.exampleList}>
        {months.map((month, index) => (
          <li key={index}>
            <img src={pdfIcon} alt="pdf icon" width="15" height="20" />
            {month}
          </li>
        ))}
      </ul>
      <span>*For example, if your {months[2]} business bank statement is unavailable, please provide {replacementMonthName}'s statement instead.</span>
         </div>
      <FileUploadContainer/>
      </div>
     
      </div>
      </div>
    </div>
  )
}

export default DocumentQuestion