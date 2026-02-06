import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;


if (store._actions["studentauth/fetchStudentProfile"]) {
  store
    .dispatch("studentauth/fetchStudentProfile")
    .catch((err) => console.error("Failed to fetch profile:", err))
    .finally(() => {
      new Vue({
        store,
        vuetify,
        render: (h) => h(App),
      }).$mount("#app");
    });
} else {
  console.error("Action studentauth/fetchStudentProfile does not exist!");
  new Vue({
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
}
