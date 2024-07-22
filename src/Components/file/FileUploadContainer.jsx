import React, { useState } from 'react';
import FileUpload from '@/components/file/FileUpload';
import InputError from '@/components/UI/Form/inputs/InputError';
import lockGreyIcon from '@/images/form icons/lockGrey.svg?url'
import acceptedCheck from '@/images/acceptedcheckmark.svg?url'
import {useQuestionnaire} from '@/context/QuestionnaireContext.jsx';
import CheckboxInput from '@/components/UI/Form/inputs/CheckboxInput';
import styles from './FileUploadContainer.module.css'
import btnStyles from '@/components/UI/Form/NextButton.module.css'
import { submitFiles } from '@/utils/data/files';

const FileUploadContainer = () => {
  const [files, setFiles] = useState([null, null, null]);
  const [error, setError] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false); // Add upload completed state
  const [loading, setLoading] = useState(false);

  const {currentQuestion,formProgressStep,errResponses,responses,checkFormFileFields,proceedToNextStep} = useQuestionnaire()
  const handleFileChange = (index, newFile) => {
    const updatedFiles = [...files];

    if (newFile && files.some((file) => file && file.name === newFile.name)) {
      
      setError('Duplicate files are not allowed.');
      return;
    }

    updatedFiles[index] = newFile;
    setFiles(updatedFiles);
    setError(null); 
    setUploadCompleted(false); 

  };
  const handleFileError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkFormFileFields()) {
      const allFiles = files.filter((file) => file !== null);

      if (allFiles.length < 1 || allFiles.length > 3) {
        setError(`You must upload between 1 and 3 files.`);
        return;
      }
      
      const formData = new FormData();
      allFiles.forEach((file) => formData.append('files', file));
      const userEmail = responses['email'] ? responses['email'].answer : 'file@gmail.com'

      formData.append('email', userEmail); // Add user email to formData
      
      setError(null)
      setLoading(true); // Set loading to true before API call

      // Simulate a delay with setTimeout
      setTimeout(async () => {
        const responseStatus = await submitFiles(formData);
        setLoading(false); // Set loading to false after API call

        if (responseStatus >= 200 && responseStatus < 300) {
          setFiles([null, null, null]);
          setUploadCompleted(true); // Set upload completed to true
          proceedToNextStep();
        } else {
          setError('Error uploading files.');
        }
      }, 2000); // 3-second delay for testing
    } else {
      setError('Please fill out all required fields.');
    }
  };
  
  
  //first question as this is the only question checkbox in this document step.
  const sub =
    currentQuestion.formSteps[formProgressStep - 1].subquestions[0];
  return (
    <div className={styles.filesContainer} >

    <div className={styles.filesWrapper}>
      <div className={styles.acceptedFormatHeader}>
        <p>
        <img src={acceptedCheck} alt="checkmark icon" width="18" height="18" />

        Accepted file type (500KB max): png, jpg, pdf, docx</p>
        <p>
        <img src={lockGreyIcon} alt="lock icon" width="18" height="18" />
        Secure</p>
      </div>
    <div className={styles.filesList}>
      {files.map((file, index) => (
        <FileUpload
          key={index}
          index={index}
          file={file}
          onFileChange={handleFileChange}
          onFileError={handleFileError}

        />
      ))}
    </div>
      <InputError error={error} message={error} marginTop="0"/>
    </div>
    {/* <NextButton/> */}
      <button 
         className={`${btnStyles.nextBtn} ${
             files.filter((file) => file !== null).length > 0 || uploadCompleted ? btnStyles.enabled : ""
         } ${btnStyles.formResultBtn}`}
       onClick={handleSubmit} disabled={files.filter((file) => file !== null).length < 1}>
  {loading ? (
                <>

                Uploading <div className={styles.spinner}></div>
      
          </>
        ) : uploadCompleted ? (
          'Uploaded Successfully'
        ) : (
          'Upload'
        )}

      </button>
      
      <CheckboxInput
            subQuestion={sub}
            isChecked={responses?.[sub.code]?.answerIndexes[0]}
            isError={errResponses[sub.code] || false}
            errorMessage={sub.error}
            marginTop="0"
          />
      {/* <DocumentCheckboxInput/> */}
    </div>
  );
};

export default FileUploadContainer;
