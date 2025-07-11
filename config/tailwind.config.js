const light = require('../build/tailwind/light');
const dark = require('../build/tailwind/dark');

module.exports = {
  theme: {
    extend: {
      colors: {
        light,
        dark
      }
    }
  }
};
