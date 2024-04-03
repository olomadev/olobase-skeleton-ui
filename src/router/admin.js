import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/Dashboard";
import Account from "@/views/Account";
import Password from "@/views/Password";
import Error404 from "@/views/Error404";
import Swagger from "@/views/Swagger";
import Breadcrumb from "@/views/demo/BreadCrumb";
import Tab from "@/views/demo/Tab";
import Autocomplete from "@/views/demo/AutoComplete";
import boolean from "@/views/demo/Boolean";
import Currency from "@/views/demo/Currency";
import date from "@/views/demo/Date";
import File from "@/views/demo/File";
import number from "@/views/demo/Number";
import Radio from "@/views/demo/RadioGroup";
import Rating from "@/views/demo/Rating";
import RichText from "@/views/demo/RichText";
import Select from "@/views/demo/Select";
import Text from "@/views/demo/Text";
import Test from "@/views/Test";
import i18n from "../i18n";

export default {
  path: "",
  component: AdminLayout,
  meta: {
    title: i18n.global.t("routes.home"),
  },
  children: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        title: i18n.global.t("routes.dashboard"),
      },
    },
    {
      path: "/breadcrumb",
      name: "breadcrumb",
      component: Breadcrumb,
      meta: {
        title: i18n.global.t("menu.breadcrumb"),
      },
    },
    {
      path: "/swagger",
      name: "swagger",
      component: Swagger,
      meta: {
        title: i18n.global.t("menu.api"),
      },
    },
    {
      path: "/tab",
      name: "tab",
      component: Tab,
      meta: {
        title: i18n.global.t("menu.tab"),
      },
    },
    {
      path: "/autocomplete",
      name: "autocomplete",
      component: Autocomplete,
      meta: {
        title: i18n.global.t("menu.autocomplete"),
      },
    },
    {
      path: "/boolean",
      name: "boolean",
      component: boolean,
      meta: {
        title: i18n.global.t("menu.boolean"),
      },
    },
    {
      path: "/currency",
      name: "currency",
      component: Currency,
      meta: {
        title: i18n.global.t("menu.currency"),
      },
    },
    {
      path: "/date",
      name: "date",
      component: date,
      meta: {
        title: i18n.global.t("menu.date"),
      },
    },
    {
      path: "/file",
      name: "file",
      component: File,
      meta: {
        title: i18n.global.t("menu.file"),
      },
    },
    {
      path: "/number",
      name: "number",
      component: number,
      meta: {
        title: i18n.global.t("menu.number"),
      },
    },
    {
      path: "/radio",
      name: "radio",
      component: Radio,
      meta: {
        title: i18n.global.t("menu.radio"),
      },
    },
    {
      path: "/rating",
      name: "rating",
      component: Rating,
      meta: {
        title: i18n.global.t("menu.rating"),
      },
    },
    {
      path: "/richtext",
      name: "richtext",
      component: RichText,
      meta: {
        title: i18n.global.t("menu.richtext"),
      },
    },
    {
      path: "/select",
      name: "select",
      component: Select,
      meta: {
        title: i18n.global.t("menu.select"),
      },
    },
    {
      path: "/text",
      name: "text",
      component: Text,
      meta: {
        title: i18n.global.t("menu.text"),
      },
    },
    {
      path: "/account",
      name: "account",
      component: Account,
      meta: {
        title: i18n.global.t("routes.account"),
      },
    },
    {
      path: "/password",
      name: "password",
      component: Password,
      meta: {
        title: i18n.global.t("routes.password"),
      },
    },
    {
      path: "*",
      component: Error404,
      meta: {
        title: i18n.global.t("routes.notFound"),
      },
    },
    {
      path: "/test",
      name: "test",
      component: Test,
      meta: {
        title: i18n.global.t("routes.dashboard"),
      },
    },
  ],
};
