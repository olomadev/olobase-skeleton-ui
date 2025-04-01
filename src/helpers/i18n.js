/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/i18n.js
 * 
 * Cookie helper for production and dev environment
 */
let messages = {};
async function loadI18nMessages(name, modules) {
  for (const path in modules) {
    const lang = path.match(/\/([a-z]{2})\/index\.js$/)[1];
    if (!messages[lang]) {
      messages[lang] = {};
    }
    messages[lang][name.toLowerCase()] = (await modules[path]()).default;
  }
  const result = messages;
  messages = {}; // reset variable
  return result;
};

const i18n = { messages: {} }

export {
  i18n,
  loadI18nMessages
}