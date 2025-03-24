/**
 * @oloma.dev (c) 2023-2025
 *
 * - main.js
 * 
 * bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import { createApp } from 'vue';
import App from './App.vue';
import '@/assets/styles/app.css'; // put your styles here
import '@/assets/styles/materialdesignicons.css'; // https://pictogrammers.com/library/mdi/
import { registerPlugins } from "@/plugins";

const app = createApp(App);

async function init() {
  await registerPlugins(app);
  app.mount("#app");
}
// start the application
init();
