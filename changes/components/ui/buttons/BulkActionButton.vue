<template>
  <va-action-button
    :hide-label="hideLabel"
    :label="label"
    :icon="icon"
    :text="text"
    :color="color || 'primary'"
    @click="onBulkUpdate"
  ></va-action-button>
</template>

<script>
import ActionButton from "../../../mixins/action-button";
import useResource from "../../../store/resource";
/**
 * Generic customizable button for update bulk actions in VaList component.
 * Shown after items selections. Use `updateMany` data provider method under the hood.
 */
export default {
  mixins: [ActionButton],
  inject: {
    listState: { default: undefined },
  },
  props: {
    /**
     * Selected resources items.
     */
    value: Array,
    /**
     * Data object to send on `updateMany` data provider method.
     * Contains the resource properties to update.
     */
    action: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onBulkUpdate() {
      let value = this.value || this.listState.selected;

      const Self = this;
      const resource = useResource();
      resource.setResource(this.listState.resource);

      await resource.updateMany({
        ids: value.map(({ id }) => id),
        data: Self.action,
      }).then(function() {
        /**
         * Cleanup selected elements
         */
        Self.$emit("input", []);
        Self.listState.selected = [];
        Self.$emit("refresh", true);
        /**
         * Refresh
         */
        setTimeout(function(){
          resource.refresh(); 
        }, 200);
      });
    
    },
  },
};
</script>
