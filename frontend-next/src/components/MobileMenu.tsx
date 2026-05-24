"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMobileMenu } from "@/hooks/useMobileMenu";

export function MobileMenu() {
  const { isOpen, close } = useMobileMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, close]);

  const handleLinkClick = useCallback(() => {
    close();
  }, [close]);

  if (!isOpen) {
    return (
      <div
        className="mobile-menu"
        id="mobile-menu"
        aria-label="Mobile navigation"
        hidden
        aria-hidden="true"
        ref={menuRef}
      >
        <button
          type="button"
          className="mobile-menu__backdrop"
          id="mobile-menu-backdrop"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={close}
        />
        <nav className="mobile-menu__panel" aria-label="Mobile navigation" ref={panelRef}>
          <ul className="mobile-menu__list">
            <li><a href="#hero" className="mobile-menu__link header__link" onClick={handleLinkClick}>Home</a></li>
            <li><a href="#about" className="mobile-menu__link header__link" onClick={handleLinkClick}>About Us</a></li>
            <li><a href="#projects" className="mobile-menu__link header__link" onClick={handleLinkClick}>Projects</a></li>
            <li><a href="#contact" className="mobile-menu__link header__link" onClick={handleLinkClick}>Contact Us</a></li>
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div
      className="mobile-menu mobile-menu--open"
      id="mobile-menu"
      aria-label="Mobile navigation"
      aria-hidden="false"
      ref={menuRef}
    >
      <button
        type="button"
        className="mobile-menu__backdrop"
        id="mobile-menu-backdrop"
        tabIndex={-1}
        aria-label="Close menu"
        onClick={close}
      />
      <nav className="mobile-menu__panel" aria-label="Mobile navigation" ref={panelRef}>
        <ul className="mobile-menu__list">
          <li><a href="#hero" className="mobile-menu__link header__link" onClick={handleLinkClick}>Home</a></li>
          <li><a href="#about" className="mobile-menu__link header__link" onClick={handleLinkClick}>About Us</a></li>
          <li><a href="#projects" className="mobile-menu__link header__link" onClick={handleLinkClick}>Projects</a></li>
          <li><a href="#contact" className="mobile-menu__link header__link" onClick={handleLinkClick}>Contact Us</a></li>
        </ul>
      </nav>
    </div>
  );
}
