<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end"
  >
    <template v-slot:activator="{ props }">
      <va-action-button
        v-if="item && visible"
        :hide-label="true"
        :item="item"
        :label="$t('va.actions.show')"
        icon="mdi-eye"
        :color="color"
        variant="text"
        exact
        :externalProps="props"
        @click="menu = !menu"
      ></va-action-button>
    </template>
  
    <v-card min-width="300" max-width="1200">
      <v-list>
        <v-list-item id="testing-code">
          <component
            :is="getShowComponentName"
            :item="item"
          ></component>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="menu = false"
        >
          {{ $t("va.actions.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>


<script>
import Resource from "../../../mixins/resource"
import RedirectButton from "../../../mixins/redirect-button";

/**
 * Button for all create resource action. Redirect to create page by default.
 */
export default {
  mixins: [Resource, RedirectButton],
  data() {
    return {
      visible: false,
      menu: false,
    }
  },
  computed: {
    getShowComponentName(){
      return this.resource + 'RowShow';
    }
  },
  async created() {
    this.visible = await this.canShow('show')
  },
  methods: {

  }
};
</script>
