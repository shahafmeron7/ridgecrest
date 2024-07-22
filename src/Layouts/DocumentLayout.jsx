import React from 'react'
import styles from './DocumentLayout.module.css'
const DocumentLayout = React.forwardRef(({ children }, ref) => {
  return (
    <div className={styles.documentLayout} ref={ref}>
    <div className={styles.documentWrapper}>
    <div className={styles.documentContent}>

      {children}
    </div>

    </div>
    </div>
  )
})

export default DocumentLayout