import React from "react";
import "./Footer.css";
import facebookIcon from "@/images/footer/Facebook.svg?url";
import InstagramIcon from "@/images/footer/Instagram.svg?url";
import LinkedinIcon from "@/images/footer/Linkedin.svg?url";
import xIcon from "@/images/footer/X.svg?url";
import mountaionLogo from "@/images/ridgelogo.svg?url";
import ridgeNameLogo from "@/images/ridgecrestnamelogo.svg?url";
import rightArrowIcon from "@/images/footer/rightArrow.svg?url";

const domainURL = "ridgecrestfg.com";
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
      { text: "About Us", href: `https://${domainURL}/about-us/` },
      //     { text: "Terms of Use", href: `https://${domainURL}/terms-of-use/`},
      //     { text: "Privacy Policy", href: `https://${domainURL}/privacy-policy/`},
      //     { text: "How We Rate", href: `https://${domainURL}/how-we-rate/`},
      //     {
      //       text: "CCPA Privacy Notice",
      //       href: `https://${domainURL}/ccpa-privacy-noticy`,
      // },
      //     {
      //       text: "Cookie Settings",
      //       onClick: handleCookiesSettingsClick,
      //       className: "cookie_settings",
      //     },
    ],
  },
  {
    title: "Quick Links",
    links: [
      // { text: "Partners", href: `https://${domainURL}/b/`},
      // { text: "Contact Us", href: `https://${domainURL}/contact-us/`},
      { text: "Blog", href: `https://${domainURL}/blog/` },
    ],
  },
  {
    title: "Social Media",
    isSocial: true,
    links: [
      {
        icon: facebookIcon,
        alt: "facebookIcon",
        href: "https://www.facebook.com/people/Ridge-Crest-FG/61561639512371/",
      },
      // { icon: InstagramIcon, alt: "instagramIcon", href: "#" },
      {
        icon: LinkedinIcon,
        alt: "LinkedinIcon",
        href: "https://www.linkedin.com/company/ridge-crest-fg/about/",
      },
      // { icon: xIcon, alt: "twitter", href: "#" },
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
              <img src={mountaionLogo} className="r-logo" alt="Logo" width="89" height="69" />
              <img src={ridgeNameLogo} className="r-name-logo" alt="Logo" width="293" height="69" />
            </div>
            <div className="divider"></div>
            <div className="links-wrapper">
              {footerLinks.map((section, index) => (
                <div
                  key={`${section.title}-${index}`}
                  className="links-container"
                >
                  <div className="links-title">{section.title}</div>
                  {section.isSocial ? (
                    <div className="logos">
                      {section.links.map((link, linkIndex) => (
                        <a
                         key={`${section.title}-${linkIndex}-${link.alt}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener nofollow"
                        >
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
                      <>
                        <a
                                                  key={`${section.title}-${linkIndex}-${link.text}`}

                          className={`text ${link.className || ""}`}
                          href={link.href}
                          onClick={link.onClick || null}
                       
                        >
                          {link.text}
                          <img
                            src={rightArrowIcon}
                            width="16"
                            height="16"
                            alt="arrow"
                            className="hoverArrow"
                          />
                        </a>
                      </>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="disclaimerContainer">
          <div className="disclaimerText">
            {/* <p>
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
            </p> */}
            <div className="right-reserved">All rights reserved © 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
