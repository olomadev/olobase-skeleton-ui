<template>
  <div>
    <v-app-bar 
      :clipped-left="lgAndUp"
      :clipped-right="lgAndUp"
      app
      :elevation="elevation"
      :density="density"
      :color="color"
      :flat="flat"
    >
      <!--
        Triggered on VAppBar icon click, use it for VaSidebar toggling or minimizing.
        @event toggle
      -->
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-toolbar-title class="ml-0 mt-1 pl-1" style="width: 274px">
        <!-- Logo image/svg content or any txt -->
        <slot name="logo"></slot>
        <!-- <span class="hidden-sm-and-down"> {{ title || $admin.title }}</span>-->
      </v-toolbar-title>

      <v-row v-if="headerMenu.length && lgAndUp">
        <v-col
          v-for="(item, i) in headerMenu"
          :key="i"
          class="text-center mb-sm-0 mb-5"
          cols="auto"
        >
          <component
            :is="item.href ? 'a' : 'router-link'"
            :href="item.href"
            :to="item.link"
            class="px-3 white--text link"
            :target="item.href ? '_blank' : '_self'"
            v-text="item.text"
          ></component>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <div>
        <!-- start header-buttons slot -->
        
        <slot name="header-buttons"></slot>

        <!-- end header-buttons slot -->

        <v-btn
          v-if="!disableReload && isRouteList"
          icon
          small
          class="ml-1"
          :loading="getLoading"
          @click="refresh"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        
        <slot name="profile"></slot>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      :color="sidebarColor"
      v-model="drawer"
    >
      <template v-slot:prepend>
        <slot name="navbar-logo"></slot>
      </template>

      <v-list v-if="Array.isArray(sidebarMenu)">
        <template v-for="(item, index) in sidebarMenu.filter((l) => l)">
          <v-list-subheader v-if="item.heading" :key="'header_' + index">
            {{ item.heading }}
          </v-list-subheader>

          <v-divider v-else-if="item.divider" :key="'divider_' + index"></v-divider>

          <v-list-group
            v-else-if="item.children && item.children.length"
            :key="'vlist_' + index"
            :value="item.expanded"
            :prepend-icon="item.icon"
            append-icon="mdi-chevron-up"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                :density="listItemDensity"
                :color="listItemColor"
                v-bind="props"
                :title="item.text"
              ></v-list-item>
            </template>
            <v-list-item
              :density="listItemDensity"
              :color="listItemColor" 
              v-for="(child, i) in item.children"
              :key="'vlist-item_' + i"
              link
              :to="child.link"
            >
              <template v-slot:prepend>
                <v-icon size="small" :icon="child.icon"></v-icon>
              </template>            
              <v-list-item-title>
                <div v-if="child.href">
                  <a :href="child.href" target="_blank" style="text-decoration: none;">{{ child.text }}</a>
                </div>
                <div v-else>
                  {{ child.text }}
                </div>
              </v-list-item-title>
            </v-list-item>

          </v-list-group>

          <v-list-item 
            :density="listItemDensity"
            :color="listItemColor" 
            v-else-if="item.text" 
            :key="index" 
            link 
            :to="item.link"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { useDisplay } from 'vuetify';
import { storeToRefs } from 'pinia';

/**
 * Default customizable admin VAppBar.
 * Contains main app title, header menus, direct resource creation links, global refresh action, profile menu.
 * Profile user dropdown will not appear on guest mode.
 */
export default {
  inject: [],
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp } = useDisplay()
    return { lgAndUp }
  },
  props: {
    /**
     * Replace default admin app title set on OlabaseAdmin constructor.
     */
    title: String,
    /**
     * Elevation
     * 
     * https://vuetifyjs.com/en/styles/elevation/#dynamic-elevation
     */
    elevation:{
      type: [Number, String]
    },
    /**
     * Header links visible on left side.
     */
    headerMenu: {
      type: Array,
      default: () => [],
    },
    /**
     * Disable create menu.
     */
    disableCreate: Boolean,
    /**
     * Disable reload state button.
     */
    disableReload: Boolean,
    /**
     * Density option: default, compact, comfortable
     */
    density: {
      type: String,
      default: "compact",
    },
    /**
     * List Item Density option: default, compact, comfortable
     */
    listItemDensity: {
      type: String,
      default: "default",
    },
    /**
     * Color for the VAppBar.
     */
    color: {
      type: String,
      default: "primary",
    },
    /**
     * Removes app var shadow.
     */
    flat: false,
    /**
     * Main color of VNavigationDrawer.
     */
    sidebarColor: {
      type: String,
      default: "white",
    },
    /**
     * Liste item color of VNavigationDrawer.
     */
    listItemColor: {
      type: String,
      default: "primary",
    }
  },
  watch: {
    drawer(val) {
      this.$store.setDrawer(val);
    },
  },
  data() {
    return {
      drawer: true,
      sidebarMenu: null,
    }
  },
  async created() {
    /**
     * Build dynamic sidebar menu
     */
    this.sidebarMenu = await this.$store.buildNavs(this.$t, this.$admin);
  },
  computed: {
    getLoading() {
      return this.$store.getModule("api").getLoading;
    },
    isRouteList() {
      if (typeof this.$route.meta.resource == 'undefined') {
        return false
      }
      let strArray = this.$route.name.split("_"); // check the current route is list
      if (Array.isArray(strArray) && strArray.length > 0) {
        let lastItem = strArray[strArray.length - 1]
        if (lastItem.trim() == "list") {
          return true
        }
      }
      return false
    },
  },
  methods: {
    refresh() {
      if (typeof this.$route.meta.resource !== 'undefined') {
        this.$store.getResource(this.$route.meta.resource).refresh();  
      }
    }
  },
};
</script>

<style scoped>
.link {
  font-size: 0.825rem;
  font-weight: 500;
  text-decoration: none;
}
</style>
