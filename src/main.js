/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import '@/assets/styles/app.css'; // Put your styles here
import '@/assets/styles/materialdesignicons.css';

// Plugins
import { registerPlugins } from "@/plugins";
const app = createApp(App);

async function init() {
  await registerPlugins(app);
  app.mount("#app");
}
init()