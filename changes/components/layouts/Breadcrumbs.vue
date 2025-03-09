<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>

<script>
/**
 * Default admin component for breadcrumbs, will generate automatically hierarchical links from current route.
 * Support hierarchical CRUD structure.
 */
export default {
  computed: {
    items() {
      const items = [];
      const crumbs = [];
      const matchedRoutes = this.$route.matched;

      matchedRoutes.forEach((route, i) => {
        let length = 0;
        let myArray = [];
        if (typeof route.meta.title !== 'undefined') {
            myArray = route.meta.title.split(" ")
            if (route.meta.title.indexOf("#") > 0) {
                myArray.pop()  // remome #id source 
            }
        } 
        if (route['name']) {
            myArray = route.name.split("_")
            if (route.name.indexOf("#") > 0) {
                myArray.pop()  // remome #id source 
            }
        }
        let actionArray = "";
        let item = null;
        if (myArray.length > 0) {

          if (myArray.length < 2) {  // homepage
            item = myArray.join(" ").toLowerCase();
          }
          if (myArray.length == 2) {  // module / action
            item = myArray.join("_").toLowerCase();
          }
          if (myArray.length > 2) { // module / resourceNames / action
            item = myArray[0].toLowerCase() + "_"; // module name => e.g.:  authentication_
            myArray.shift(); // remove module
            item += myArray.join("_");  // "failed" +  "logins"  = authentication_failedLogins
          }
          crumbs.push(item)
          crumbs.forEach(function(val, index) {
            if (val && val.indexOf("_")) {
              actionArray = val.split("_");
            }
          })
        }
        let text = "";
        let crumbItems = "";
        if (Array.isArray(actionArray) && actionArray.length > 0) {  // do not repeat index list

          if (i == 0) {
            text = this.$t("routes." + actionArray[actionArray.length - 1]);
            items.push(
              {
                title: text,
                exact: true,
                to: route.path === "" ? "/" : route.path,
              }
            );
          }
          if (i == 1) {
            crumbItems = actionArray[0].split(" ");
            text = this.$t(crumbItems[0] + ".menu.label");
            items.push(
              {
                title: text,
                exact: true,
                to: route.path === "" ? "/" : route.path,
              }
            );
          }
          if (i == 2) { 
            if (actionArray.length == 3) {
              crumbItems = actionArray[0].split(" ");
              text = this.$t(crumbItems[0] + "." + actionArray[1] + ".menu.label");
              items.push(
                {
                  title: text,
                  exact: true,
                  to: route.path === "" ? "/" : route.path,
                }
              );
            }
            text = this.$t("routes." + actionArray[actionArray.length - 1]);
            items.push(
              {
                title: text,
                exact: true,
                to: route.path === "" ? "/" : route.path,
              }
            );
          }
        }
        //
        // reset breadcrumb if we have errors
        // 
        if (typeof route?.meta?.title === "string" && (route.meta.title.indexOf("Not found") == 0)) {
          items = [];
        }
      });


      return items;
    
    },
  },
};
</script>
