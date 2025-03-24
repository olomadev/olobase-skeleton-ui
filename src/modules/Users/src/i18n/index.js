import module from '../index.js'
const messages = {};
const loadMessages = async () => {
  const modules = import.meta.glob('./*/index.js');
  for (const path in modules) {
    const lang = path.match(/\/([a-z]{2})\/index\.js$/)[1];
    if (!messages[lang]) {
      messages[lang] = {};
    }
    messages[lang][module.name.toLowerCase()] = (await modules[path]()).default;
  }
};
await loadMessages();
export default { messages };