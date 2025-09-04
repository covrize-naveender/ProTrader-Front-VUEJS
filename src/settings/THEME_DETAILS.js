export const THEME_DETAILS = {
  classic: {
    font: '#000000',
    primary: '#F5F5F5',
    secondary: '#F20E17',
  },
  grey: {
    font: '#5a5a5b',
    primary: '#dedfdf',
    secondary: '#2196f3',
  },
  dark: {
    font: '#A5A9B2',
    primary: '#1e1e1e',
    secondary: '#64E639',
  },
}
export const DEFAULT_THEME_SETTINGS = {
  settings: {
    font: '#000001',
    primary: '#F5F5F5',
    secondary: '#F20E17',
  },
  id: 'classic',
  themeDarkMode: false,
}
export const isThemePrimary = (themeSettings) => {
  let decision =
    themeSettings.id &&
    themeSettings.id.length > 0 &&
    THEME_DETAILS.hasOwnProperty(themeSettings.id)
  if (decision) {
  } else {
    decision = false
  }

  return decision
}
