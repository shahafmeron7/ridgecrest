import React from 'react'
import styles from '../InputWithValidation.module.css'
const InputError = ({error,message}) => {
  return (
   <div
   className={`${styles.errContainer} ${
     error ? `${styles.visible}` : `${styles.notVisible}`
   }`}
 >
   <img
     src="https://assets.sonary.com/wp-content/uploads/2024/01/24143354/Icon-Name-2.svg"
     alt="error icon"
   />
   <span className={styles.errText}>{message}</span>
 </div>
  )
}

export default InputError