"use client";

import { useEffect } from "react";
import { useMobileMenu } from "../model/store";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact Us" },
];

export function MobileMenu() {
  const { isOpen, close } = useMobileMenu();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, close]);

  const className = `mobile-menu${isOpen ? " mobile-menu--open" : ""}`;

  return (
    <div
      className={className}
      id="mobile-menu"
      aria-label="Mobile navigation"
      hidden={!isOpen}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="mobile-menu__backdrop"
        id="mobile-menu-backdrop"
        tabIndex={-1}
        aria-label="Close menu"
        onClick={close}
      />
      <nav className="mobile-menu__panel" aria-label="Mobile navigation">
        <ul className="mobile-menu__list">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="mobile-menu__link header__link" onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
