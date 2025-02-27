/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
// import './assets/css/style.css'; // Tailwind and other styles, put here

// Plugins
import { registerPlugins } from "@/plugins";
const app = createApp(App);

async function init() {
  await registerPlugins(app);
  app.mount("#app");
}
init()