import React from 'react'
import styles from './InputWithValidation.module.css'
const InputError = ({error,message,marginTop}) => {
  const imgStyle = marginTop ? { marginTop: `${marginTop}px` } : {};

  return (
   <div
   className={`${styles.errContainer} ${
     error ? `${styles.visible}` : `${styles.notVisible}`
   }`}
 >
   <img
     src="https://assets.sonary.com/wp-content/uploads/2024/01/24143354/Icon-Name-2.svg"
     alt="error icon"
     style={imgStyle}
   />
   <span className={styles.errText}>{message}</span>
 </div>
  )
}

export default InputError