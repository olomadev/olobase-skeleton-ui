<template>
  <va-action-button
    :hide-label="icon"
    :label="$t('va.actions.batch')"
    icon="mdi-console"
    :color="color"
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
};
</script>
