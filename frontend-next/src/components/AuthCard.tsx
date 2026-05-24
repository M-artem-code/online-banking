"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/config/env";

export function AuthCard() {
  const [activeTab, setActiveTab] = useState<"signin" | "email">("signin");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get("auth");
    if (authStatus === "ok") {
      const name = params.get("name") || "";
      const picture = params.get("picture") || "";
      const profileEl = document.getElementById("user-profile");
      const googleBtn = document.getElementById("google-auth");
      if (profileEl) {
        profileEl.removeAttribute("hidden");
        profileEl.innerHTML = `
          ${picture ? `<img class="user-profile__avatar" src="${picture}" alt="" />` : ""}
          <span class="user-profile__name">${name}</span>
        `;
      }
      if (googleBtn) googleBtn.setAttribute("hidden", "");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (authStatus === "error") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleGoogleAuth = () => {
    window.location.href = `${getApiUrl()}/auth/google`;
  };

  return (
    <aside className="auth-card" data-component="auth-card" aria-label="Online Banking">
      <header className="auth-card__header">
        <h2 className="auth-card__title text-label">Online Banking</h2>
      </header>

      <div
        className="auth-card__tabs"
        role="tablist"
        aria-label="Sign in method"
        data-active-tab={activeTab}
      >
        <button
          type="button"
          className={`auth-card__tab${activeTab === "signin" ? " auth-card__tab--active" : ""}`}
          role="tab"
          id="auth-tab-signin"
          aria-selected={activeTab === "signin"}
          aria-controls="auth-panel-signin"
          data-auth-tab="signin"
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-card__tab${activeTab === "email" ? " auth-card__tab--active" : ""}`}
          role="tab"
          id="auth-tab-email"
          aria-selected={activeTab === "email"}
          aria-controls="auth-panel-email"
          data-auth-tab="email"
          onClick={() => setActiveTab("email")}
        >
          Enter Email
        </button>
      </div>

      <div className="auth-card__body">
        <div
          className={`auth-card__panel auth-card__panel--signin${activeTab === "signin" ? " auth-card__panel--active" : ""}`}
          id="auth-panel-signin"
          role="tabpanel"
          aria-labelledby="auth-tab-signin"
        >
          <div className="auth-card__pre-divider">
            <button
              type="button"
              id="google-auth"
              className="btn btn--google auth-card__google"
              onClick={handleGoogleAuth}
            >
              <span className="btn__google-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" focusable="false">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </span>
              <span className="btn__google-label">Google</span>
            </button>
            <a className="auth-card__forgot" href="#forgot-password">Forgot Password?</a>
          </div>
          <div className="auth-card__divider" role="separator">
            <span className="auth-card__divider-line"></span>
            <span className="auth-card__divider-text">or</span>
            <span className="auth-card__divider-line"></span>
          </div>
          <button type="button" className="btn btn--create-account">Create account</button>
        </div>
        <div
          className={`auth-card__panel auth-card__panel--email${activeTab === "email" ? " auth-card__panel--active" : ""}`}
          id="auth-panel-email"
          role="tabpanel"
          aria-labelledby="auth-tab-email"
        >
          <form className="auth-card__email-form" action="#" noValidate>
            <input
              className="auth-card__email-input"
              type="email"
              name="email"
              placeholder="Enter Email"
              autoComplete="email"
              aria-label="Enter Email"
            />
            <button type="button" className="btn btn--email-submit">Sign in with email</button>
          </form>
          <div className="auth-card__single-divider" role="separator" aria-hidden="true"></div>
          <a className="auth-card__forgot" href="#forgot-password">Forgot Password?</a>
        </div>
      </div>
    </aside>
  );
}
