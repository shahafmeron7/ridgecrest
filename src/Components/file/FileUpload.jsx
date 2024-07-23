import React, { useState, useRef } from "react";
import InputError from "@/components/UI/Form/inputs/InputError";
import styles from './FileUpload.module.css'
import UploadIcon from '@/images/UploadIcon.svg?url'
import pdfIcon from '@/images/pdficon.svg?url'
import xIcon from '@/images/xicon.svg?url'
import useIsWideScreen from "@/hooks/useIsWideScreen";

const FileUpload = ({ index, file, onFileChange,onFileError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const isWideScreen = useIsWideScreen();

  const fileInputRef = useRef(null);
  const MAX_MB = 0.5;
  const MAX_FILE_SIZE = MAX_MB * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    // "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const formatFileName = (name) => {
    const maxLength = 10;
    const lastDotIndex = name.lastIndexOf('.');
    const extension = name.substring(lastDotIndex + 1);
    const baseName = name.substring(0, lastDotIndex);
  
    if (baseName.length > maxLength) {
      return `${baseName.substring(0, maxLength)}...${extension}`;
    }
  
    return name;
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    const draggedFile = e.dataTransfer.items[0];
    if (
      draggedFile &&
      draggedFile.kind === "file" &&
      ALLOWED_FILE_TYPES.includes(draggedFile.type)
    ) {
      setIsFileValid(true);
    } else {
      setIsFileValid(false);
    }
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsFileValid(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
    fileInputRef.current.value = ""; // Reset the input value
  };

  const handleFile = (newFile) => {
    if (!newFile) return;

    if (ALLOWED_FILE_TYPES.includes(newFile.type)) {
      if (newFile.size <= MAX_FILE_SIZE) {
        onFileChange(index, newFile);
        // onFileError(null); // Clear error messages when new valid files are added
      } else {
        onFileError(`File exceeds the maximum limit of ${MAX_MB*1000}KB.`);
      }
    } else {
      onFileError('Only PDF, PNG, JPG, DOC, and DOCX files are allowed.');
    }
  };

  const handleRemoveFile = () => {
    onFileChange(index, null);
    onFileError(null); // Clear error messages when files are removed
  };

  const handleClick = () => {
    fileInputRef.current.click();
    if (!file) {
    }
  };

  return (
    <>
      <div
        className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        title={file ? file.name: 'Drag and drop your file here'}
      >
        {file ? (
          <div className={styles.fileDetails}>
          <img src={pdfIcon} alt="pdf icon" width="45" height="60" />
          <span>{formatFileName(file.name)}</span>
          </div>
        ) : (
          <div className={styles.instructions}>
            <img src={UploadIcon} alt="upload icon" width="28" height="28" />
            <div className={styles.placeholder}>
            {isWideScreen && (
              <>

              <span>Drag and drop your file here</span>
              <span>or</span>

              </>
            )
            }
              <span className={styles.uploadLink} style={{fontWeight:"500"}}>Upload Files</span>
            </div>
          </div>
        )}
        <input
          type="file"
          accept=".pdf, .png, .jpg, .jpeg, .doc, .docx"
          onChange={handleFileChange}
          style={{ display: "none" }}
          ref={fileInputRef}
          name="files"
        />
      {file && (
        <button
          onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
          className={styles.removeButton}
        >
          <img src={xIcon} alt="delete button" width="18" height="18"/>
        </button>
      )}
      </div>
    </>
  );
};

export default FileUpload;
