/**
 * @oloma.dev (c) 2023-2025
 * 
 * - plugins/webfontloader.js
 * 
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */
export async function loadFonts() {
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */ "webfontloader"
  );
  webFontLoader.load({
    google: {
      families: ["Hanken Grotesk:400,500,700&display=swap"],
    },
  });
}
