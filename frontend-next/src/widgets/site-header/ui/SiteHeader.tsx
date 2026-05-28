"use client";

import { useMobileMenu } from "@/features/mobile-menu";

export function SiteHeader() {
  const { isOpen, toggle } = useMobileMenu();

  return (
    <header
      className={`site-header header${isOpen ? " header--menu-open" : ""}`}
      data-component="header"
    >
      <div className="header__inner container">
        <a href="#hero" className="header__logo" aria-label="KAIROS home">
          <span className="header__logo-text">KAIROS</span>
        </a>

        <nav className="site-nav header__nav" aria-label="Main navigation">
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <a href="#hero" className="site-nav__link header__link">HOME</a>
            </li>
            <li className="site-nav__separator" aria-hidden="true"></li>
            <li className="site-nav__item">
              <a href="#about" className="site-nav__link header__link">ABOUT US</a>
            </li>
            <li className="site-nav__separator" aria-hidden="true"></li>
            <li className="site-nav__item">
              <a href="#projects" className="site-nav__link header__link">PROJECTS</a>
            </li>
            <li className="site-nav__separator" aria-hidden="true"></li>
            <li className="site-nav__item">
              <a href="#contact" className="site-nav__link header__link">CONTACT US</a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <div id="user-profile" className="user-profile" hidden></div>
          <button
            type="button"
            className="header__burger"
            id="menu-toggle"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={toggle}
          >
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
