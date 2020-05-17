import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import * as VueGoogleMaps from "vue2-google-maps";

require("dotenv").config();

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: "places"
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
