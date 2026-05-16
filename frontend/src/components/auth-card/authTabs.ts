/** Sign In / Enter Email — мгновенное переключение панелей (Figma). */

const TAB_PANEL: Record<string, string> = {
  signin: 'auth-panel-signin',
  email: 'auth-panel-email',
}

export function initAuthTabs(): void {
  const card = document.querySelector('.auth-card')
  if (!card) return

  const tabs = card.querySelectorAll<HTMLButtonElement>('[data-auth-tab]')
  const tablist = card.querySelector('.auth-card__tabs')
  const panels = Object.values(TAB_PANEL)
    .map((id) => document.getElementById(id))
    .filter((p): p is HTMLElement => p !== null)

  panels.forEach((panel) => {
    const isSignin = panel.id === TAB_PANEL.signin
    panel.classList.toggle('auth-card__panel--active', isSignin)
    panel.setAttribute('aria-hidden', String(!isSignin))
  })

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.authTab
      if (!tabId || tab.classList.contains('auth-card__tab--active')) return

      tabs.forEach((t) => {
        const active = t === tab
        t.classList.toggle('auth-card__tab--active', active)
        t.setAttribute('aria-selected', String(active))
      })

      tablist?.setAttribute('data-active-tab', tabId)

      const nextPanelId = TAB_PANEL[tabId]
      const nextPanel = document.getElementById(nextPanelId)
      const prevPanel = panels.find((p) => p.classList.contains('auth-card__panel--active'))

      if (!nextPanel || nextPanel === prevPanel) return

      if (prevPanel) {
        prevPanel.classList.remove('auth-card__panel--active')
        prevPanel.setAttribute('aria-hidden', 'true')
      }

      nextPanel.classList.add('auth-card__panel--active')
      nextPanel.setAttribute('aria-hidden', 'false')
    })
  })

  const initialTab = card.querySelector<HTMLButtonElement>('.auth-card__tab--active')
  if (initialTab?.dataset.authTab) {
    tablist?.setAttribute('data-active-tab', initialTab.dataset.authTab)
  }
}
