<template>
  <va-action-button
    v-if="visible"
    :hide-label="icon"
    :label="$t('va.actions.addNew')"
    icon="mdi-dock-window"
    :color="color || 'success'"
    text
    exact
    @click="openDialog"
  ></va-action-button>
</template>

<script>
import RedirectButton from "../../../mixins/redirect-button";
import eventBus from "@/helpers/eventbus";

/**
 * Button for all edit resource action. Redirect to edit page by default.
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
  methods: {
    openDialog() {
      eventBus.emit("last-dialog", true, "create")
    }
  }
};
</script>
