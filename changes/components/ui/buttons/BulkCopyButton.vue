<template>
  <va-copy-button
    :resource="listState.resource"
    @copy="onBulkCopy"
  ></va-copy-button>
</template>

<script>
import useResource from "../../../store/resource";
/**
 * Button for delete bulk actions for VaList. Shown after items selections.
 * Keep all VaDeleteButton feature and use `deleteMany` data provider method under the hood.
 */
export default {
  inject: {
    admin: { default: undefined },
    listState: { default: undefined },
  },
  props: {
    /**
     * Selected resources items.
     */
    value: Array,
  },
  computed: {
    currentResource() {
      return this.$admin.getResource(this.listState.resource);
    },
  },
  methods: {
    async onBulkCopy() {
      let value = this.value;
      let confirm = await this.$admin.confirm(
          this.$t("va.confirm.copy_many_title", {
            resource: this.currentResource.getName(value.length).toLowerCase(),
            count: value.length,
          }),
          this.$t("va.confirm.copy_many_message", {
            resource: this.currentResource.getName(value.length).toLowerCase(),
            count: value.length,
          })
        );
    
      if (confirm) {
        const Self = this;
        const resource = useResource();
        resource.setResource(this.listState.resource);

        await resource.copyMany({
          ids: value, // value.map(({ id }) => id)
        }).then(function(){
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

      }
    },
  },
};
</script>
