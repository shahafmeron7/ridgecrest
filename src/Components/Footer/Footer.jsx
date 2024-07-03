import React from "react";
import "./Footer.css";
import facebookIcon from "@/images/footer/Facebook.svg?url";
import InstagramIcon from "@/images/footer/Instagram.svg?url";
import LinkedinIcon from "@/images/footer/Linkedin.svg?url";
import xIcon from "@/images/footer/X.svg?url";
import mountaionLogo from "@/images/Mountainlogo.svg?url";
import ridgeNameLogo from "@/images/ridgcrestnamelogo.svg?url";
const domainURL = '#'
const handleCookiesSettingsClick = (e) => {
  if (typeof window.openSidebarListener === "function") {
    window.openSidebarListener(e);
  } else {
    console.error("openSidebarListener function is not defined on window");
  }
};
const footerLinks = [
  {
    title: "Company",
    links: [
      { text: "Terms of Use", href: `https://${domainURL}/terms-of-use/`},
      { text: "Privacy Policy", href: `https://${domainURL}/privacy-policy/`},
      { text: "How We Rate", href: `https://${domainURL}/how-we-rate/`},
      {
        text: "CCPA Privacy Notice",
        href: `https://${domainURL}/ccpa-privacy-noticy`,
  },
      {
        text: "Cookie Settings",
        onClick: handleCookiesSettingsClick,
        className: "cookie_settings",
      },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { text: "About Us", href: `https://${domainURL}/about/`},
      { text: "Partners", href: `https://${domainURL}/b/`},
      { text: "Contact Us", href: `https://${domainURL}/contact-us/`},
    ],
  },
  {
    title: "Social Media",
    isSocial: true,
    links: [
      { icon: facebookIcon, alt: "facebookIcon", href: "#" },
      { icon: InstagramIcon, alt: "instagramIcon", href: "#" },
      { icon: LinkedinIcon, alt: "LinkedinIcon", href: "#" },
      { icon: xIcon, alt: "twitter", href: "#" },
    ],
  },
];
const Footer = () => {
  return (
    <div className="layout-footer">
      <div className="footer">
        <div className="footerTopContainer">
          <div className="infoContainer">
            <div className="logoContainer">
              <img src={mountaionLogo} alt="Logo" width="60" height="40" />
              <img src={ridgeNameLogo} alt="Logo" width="162" height="38" />
            </div>
            <div className="links-wrapper">
              {footerLinks.map((section, index) => (
                <div
                  key={index}
                  className="links-container"
                >
                  <div
                    className="links-title"
                  >
                    {section.title}
                  </div>
                  {section.isSocial ? (
                    <div className="logos">
                      {section.links.map((link, linkIndex) => (
                        <a key={linkIndex} href={link.href}>
                          <img
                            src={link.icon}
                            alt={link.alt}
                            loading="lazy"
                            width="32"
                            height="32"
                            decoding="async"
                            data-nimg="1"
                            style={{ color: "transparent" }}
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    section.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        className={`text ${link.className || ""}`}
                        href={link.href}
                        onClick={link.onClick || null}
                      >
                        {link.text}
                      </a>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* <div className="hearbackContainer">We want to hear from you</div> */}
        </div>
        <div className="disclaimerContainer">
          <div className="disclaimerText">
            <p>
              This website is owned and operated by ryze beyond ltd.
              Reproduction of this website, in whole or in part, is strictly
              prohibited. This website is an informative comparison site that
              aims to offer its users find helpful information regarding the
              products and offers that will be suitable for their needs. We are
              able to maintain a free, high-quality service by receiving
              advertising fees from the brands and service providers we review
              on this website (though we may also review brands we are not
              engaged with). These advertising fees, combined with our criteria
              and methodology, such as the conversion rates, impact the
              placement and position of the brands within the comparison table.
              In the event rating or scoring are assigned by us, they are based
              on either the methodology we specifically explain herein, or,
              where no specific formula is presented - the position in the
              comparison table. We make the best efforts to keep the information
              up-to-date, however, an offer’s terms might change at any time. We
              do not compare or include all service providers, brands and offers
              available in the market.
            </p>
            <div className="right-reserved">All rights reserved © 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
