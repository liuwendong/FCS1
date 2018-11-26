import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "styles/reset.css";
import "styles/border.css";
import fastClick from "fastclick";
import VueHtml5Plus from "vue-html5plus";
import Calendar from "vue2-datepick";
import vuePicturePreview from "vue-photo-preview";
import 'vue-photo-preview/dist/skin.css';
import AwesomePicker from "vue-awesome-picker";
import axios from 'axios';


axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

Vue.prototype.$axios = axios;

Vue.use(AwesomePicker);
Vue.use(VueHtml5Plus);
Vue.use(Calendar);
Vue.use(vuePicturePreview);

Vue.config.productionTip = false;
fastClick.attach(document.body);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
