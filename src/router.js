import Vue from "vue";
import Router from "vue-router";
import Login from "./pages/login/Login.vue";
import MyCase from "./pages/myCase/MyCase";
import CaseDetail from "./pages/caseDetail/CaseDetail";
import AddRmas from "./pages/addRmas/AddRmas";
import Check from "./pages/check/Check";
import PayStatus from "./pages/payStatus/PayStatus";
import Result from "./pages/comment/Result";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/myCase",
      name: "myCase",
      component: MyCase
    },
    {
      path: "/caseDetail",
      name: "caseDetail",
      component: CaseDetail
    },
    {
      path: "/addRmas",
      name: "addRmas",
      component: AddRmas
    },
    {
      path: "/payStatus",
      name: "payStatus",
      component: PayStatus
    },
    {
      path: "/check",
      name: "check",
      component: Check
    },
    {
      path: "/result",
      name: "result",
      component: Result
    }
  ]
});
