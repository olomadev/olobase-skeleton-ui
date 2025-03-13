/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import App from "./App.vue";

window.process = window.process || { env: {} };

// Composables
import { createApp } from "vue";
import './assets/styles/app.css'; // Put your styles here

// Plugins
import { registerPlugins } from "@/plugins";
const app = createApp(App);

async function init() {
  await registerPlugins(app);
  app.mount("#app");
}
init()