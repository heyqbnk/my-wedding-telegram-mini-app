import { createApp } from 'vue';

import App from './App.vue';
import { initSdk } from './utils/initSdk';

// Initialize Telegram SDK.
await initSdk();

createApp(App).mount('#app');
