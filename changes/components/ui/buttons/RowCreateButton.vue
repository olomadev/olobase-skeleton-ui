<template>
  <va-action-button
    v-if="visible"
    :hide-label="icon"
    :item="item"
    :label="$t('va.actions.addRow')"
    icon="mdi-plus"
    :color="color"
    text
    :to="getRoute('create')"
    @click="onClick"
  ></va-action-button>
</template>

<script>
import Resource from "../../../mixins/resource"
import RedirectButton from "../../../mixins/redirect-button"
/**
 * Button for all create resource action. Redirect to create page by default.
 */
export default {
  mixins: [Resource, RedirectButton],
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
