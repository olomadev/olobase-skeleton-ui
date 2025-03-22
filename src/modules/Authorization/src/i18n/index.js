const messages = {};
const loadMessages = async () => {
  const modules = import.meta.glob('./*/index.js');
  for (const path in modules) {
    const lang = path.match(/\/([a-z]{2})\/index\.js$/)[1];
    messages[lang] = (await modules[path]()).default;
  }
};
await loadMessages();
export default { messages };