import { getApiUrl } from "../../config/env.ts";

export interface AuthUser {
  name: string;
  email: string;
  picture: string;
}

export function redirectToGoogleAuth(): void {
  window.location.href = `${getApiUrl()}/auth/google`;
}

export function initAuth(): void {
  const user = parseAuthFromUrl();
  if (user) {
    renderUserProfile(user);
  }

  document
    .querySelectorAll<HTMLElement>("#google-auth, [data-google-auth]")
    .forEach((btn) => {
      btn.addEventListener("click", () => redirectToGoogleAuth());
    });
}

/** Читает результат OAuth из URL один раз (без sessionStorage). */
export function parseAuthFromUrl(): AuthUser | null {
  const params = new URLSearchParams(window.location.search);
  const auth = params.get("auth");

  if (auth === "error") {
    const message = params.get("message") ?? "Authentication failed";
    console.error("OAuth error:", message);
    cleanAuthParams();
    return null;
  }

  if (auth !== "ok") {
    return null;
  }

  const user: AuthUser = {
    name: params.get("name") ?? "",
    email: params.get("email") ?? "",
    picture: params.get("picture") ?? "",
  };

  cleanAuthParams();

  if (!user.email) {
    return null;
  }

  return user;
}

function cleanAuthParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("auth");
  url.searchParams.delete("name");
  url.searchParams.delete("email");
  url.searchParams.delete("picture");
  url.searchParams.delete("message");
  window.history.replaceState({}, "", url.pathname + url.hash);
}

export function renderUserProfile(user: AuthUser): void {
  const profileEl = document.getElementById("user-profile");
  const googleButtons = document.querySelectorAll<HTMLElement>(
    "#google-auth, [data-google-auth]",
  );

  if (!profileEl) return;

  profileEl.hidden = false;
  profileEl.innerHTML = `
    <img class="user-profile__avatar" src="${escapeAttr(user.picture)}" alt="" width="36" height="36" />
    <span class="user-profile__name">${escapeHtml(user.name || user.email)}</span>
  `;

  googleButtons.forEach((btn) => {
    btn.setAttribute("hidden", "");
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
