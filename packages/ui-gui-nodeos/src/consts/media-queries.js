/*
  This file is created for different break points for styled-components
*/

const breakpoints = {
  LAPTOP: 992,
  DESKTOP: 1440,
}

const breakpoint_max = (max) => {
  return `@media screen and (max-width: ${max}px)`;
}

const breakpoint_min = (min) => {
  return `@media screen and (max-width: ${min}px)`;
}

export default {
  BREAKPOINTS: breakpoints,
  DESKTOP: `@media screen and (max-width: ${breakpoints.HD - 1}px)`,
  LAPTOP: `@media screen and (max-width: ${breakpoints.DESKTOP - 1}px)`,

  BREAKPOINT_MAX: breakpoint_max,
  BREAKPOINT_MIN: breakpoint_min,

  TOUCH: `@media (hover: none)`,
}
