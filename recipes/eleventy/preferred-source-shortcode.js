/**
 * Google Preferred Sources button — Eleventy shortcode (auto mode).
 *
 * .eleventy.js:
 *   const preferredSource = require('./preferred-source-shortcode.js');
 *   module.exports = function (eleventyConfig) {
 *     eleventyConfig.addShortcode('preferredSource', preferredSource);
 *   };
 *
 * Template: {% preferredSource "dark", "en" %}
 *
 * Add the SDK script once in your base layout's <head>:
 *   <script async src="https://news.google.com/swg/js/v1/publisher.js"></script>
 */
module.exports = function preferredSource(theme = 'light', lang = '') {
  const langAttr = lang ? ` data-lang="${lang}"` : '';
  return `<div google-add-preferred-source-btn data-theme="${theme}"${langAttr}></div>`;
};
