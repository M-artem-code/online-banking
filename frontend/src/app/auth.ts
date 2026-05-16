const STORAGE_KEY = 'online_banking_user'

export interface AuthUser {
  name: string
  email: string
  picture: string
}

export function getApiUrl(): string {
  return import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
}

export function redirectToGoogleAuth(): void {
  window.location.href = `${getApiUrl()}/auth/google`
}

export function parseAuthFromUrl(): AuthUser | null {
  const params = new URLSearchParams(window.location.search)
  const auth = params.get('auth')

  if (auth === 'error') {
    const message = params.get('message') ?? 'Authentication failed'
    console.error('OAuth error:', message)
    cleanAuthParams()
    return null
  }

  if (auth !== 'ok') {
    return loadStoredUser()
  }

  const user: AuthUser = {
    name: params.get('name') ?? '',
    email: params.get('email') ?? '',
    picture: params.get('picture') ?? '',
  }

  if (!user.email) {
    cleanAuthParams()
    return null
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  cleanAuthParams()
  return user
}

function loadStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function cleanAuthParams(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('auth')
  url.searchParams.delete('name')
  url.searchParams.delete('email')
  url.searchParams.delete('picture')
  url.searchParams.delete('message')
  window.history.replaceState({}, '', url.pathname + url.hash)
}

export function renderUserProfile(user: AuthUser): void {
  const profileEl = document.getElementById('user-profile')
  const authBtn = document.getElementById('google-auth')
  const authHeroBtn = document.getElementById('google-auth-hero')

  if (!profileEl) return

  profileEl.hidden = false
  profileEl.innerHTML = `
    <img class="user-profile__avatar" src="${escapeAttr(user.picture)}" alt="" width="36" height="36" />
    <span class="user-profile__name">${escapeHtml(user.name || user.email)}</span>
  `

  authBtn?.setAttribute('hidden', '')
  authHeroBtn?.setAttribute('hidden', '')
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
