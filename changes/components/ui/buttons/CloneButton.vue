<template>
  <va-action-button
    v-if="item && visible"
    :hide-label="icon"
    :item="item"
    :label="$t('va.actions.clone')"
    icon="mdi-content-duplicate"
    icon-size="x-small"    
    :color="color"
    text
    exact
    :to="getRoute('create', { query: { source: item.id } })"
    @click="onClick"
  ></va-action-button>
</template>

<script>
import RedirectButton from "../../../mixins/redirect-button";

/**
 * Button for all clone resource action.
 * Redirect to create page by default with target ID of original resource to clone.
 */
export default {
  mixins: [RedirectButton],
  data() {
    return {
      visible: false
    }
  },
  async created() {
    this.visible = await this.canShow('create')
  },
};
</script>
