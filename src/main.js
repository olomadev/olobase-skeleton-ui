/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
const app = createApp(App);

// This plugin for code highlighting which 
// is extensively used in demo application
// 
import Prism from "prismjs";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-markup-templating.js"
import "prismjs/themes/prism-dark.css"; // you can change 
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-bash';

app.use(Prism);
registerPlugins(app);

app.mount("#app");