// Global theme variables for CSS-in-JS solution

// Color variables
export const COLORS = {
  textGrey: '#9fa7ae',
  lightRed: '#fa9090',
  mainRed: '#e16162',
  darkRed: '#ac4040',
  lightYellow: '#fdd290',
  mainYellow: '#f9bc60',
  darkYellow: '#f09500',
  brightYellow: '#fdee21',
  lightPurple: '#c3cdfc',
  mainPurple: '#8fa0f5',
  darkPurple: '#5c6bb5',
  mainGreen: 'green',
  darkGreen: '#006400',
  lightGrey: '#f7f7f7',
  headlineGrey: '#001e1d',
  color11: '#2c2c2c',
  color12: '#5a5a5a',
  bgGrey: '#f1f1f1',
  borderGrey: '#cccccc',
  white: '#ffffff',
};

// Spacing variables
export const SPACING = {
  space1: '1px',
  space4: '0.25rem',
  space8: '0.5rem',
  space12: '0.75rem',
  space16: '1rem',
  space20: '1.25rem',
  space24: '1.5rem',
  space28: '1.75rem',
  space32: '2rem',
  space36: '2.25rem',
  space40: '2.5rem',
  space44: '2.75rem',
};

// Font size variables
export const FONT_SIZES = {
  fontSize1: '2.5rem',
  fontSize2: '1.75rem',
  fontSize3: '1.25rem',
  fontSize4: '1rem',
  fontSize5: '0.875rem',
  fontSize6: '0.75rem',
};

// Font weight variables
export const FONT_WEIGHTS = {
  lighter: 200,
  light: 300,
  regular: 400,
  medium: 600,
  bold: 800,
};

// Other size variables
export const SIZES = {
  sessionBarHeight: '3rem',
};

// Shadow variables
export const SHADOWS = {
  paperShadow: 'rgba(0, 0, 0, 0.24) 2px 2px 8px',
  cardShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
};

// Export consolidated object with all variables
export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  fontSizes: FONT_SIZES,
  fontWeights: FONT_WEIGHTS,
  sizes: SIZES,
  shadows: SHADOWS,
};

export default THEME;
