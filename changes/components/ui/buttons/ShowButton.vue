<template>
    <va-action-button
      v-if="item && visible"
      :hide-label="icon"
      :item="item"
      :label="$t('va.actions.show')"
      icon="mdi-eye"
      :color="color"
      variant="text"
      exact
      :to="getRoute('show', { params: { id: item.id } })"
      @click="onClick"
    ></va-action-button>
</template>

<script>
import RedirectButton from "../../../mixins/redirect-button";

/**
 * Button for all show resource action. Redirect to show page by default.
 */
export default {
  mixins: [RedirectButton],
  data() {
    return {
      visible: false
    }
  },
  async created() {
    this.visible = await this.canShow('show')
  },
};
</script>
