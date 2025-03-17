<template>
  <va-action-button
    v-if="visible"
    :hide-label="icon"
    :item="item"
    :label="$t('va.actions.excelExport')"
    icon="mdi-export"
    :color="color || 'success'"
    text
    @click="onClick"
  ></va-action-button>
</template>

<script>
import Resource from "../../../mixins/resource";
import Button from "../../../mixins/button";

/**
 * Button for all list resource action. Redirect to list page by default.
 * Shown on internal CRUD page at top header.
 */
export default {
  mixins: [Resource, Button],
  data() {
    return {
      visible: false
    }
  },
  async created() {
    this.visible = await this.hasAction('list')
  },
};
</script>
