import Vue from 'vue';
import store from './store';
import App from './views/app.vue';

const app = new Vue({
    el: '#app',
    store,
    components: { App }
});