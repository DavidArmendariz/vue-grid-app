import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSearch, faFileExport);

const app = createApp(App);
app.component('custom-icon', FontAwesomeIcon);
app.use(store);
app.use(router);
app.mount('#app');
