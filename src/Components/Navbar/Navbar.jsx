import React from "react";
import  styles  from './Navbar.module.css';
import logo from "@/images/sonary_logo.svg?url";
import mountaionLogo from "@/images/Mountainlogo.svg?url";
import ridgeNameLogo from "@/images/ridgcrestnamelogo.svg?url";


const Navbar = () => {
  return (
    <div className={styles.navbarWrapper}>

    <nav className={styles.navbar}>
     
      <div className={styles.logosWrapper}>
      <img src={mountaionLogo} alt="Logo" width="60" height="40" />
      <img src={ridgeNameLogo} alt="Logo" width="162" height="38"/>
 
         </div>
    </nav>
    </div>
  );
};

export default Navbar;
