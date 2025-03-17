<template>
  <va-action-button
    v-if="visible"
    :hide-label="icon"
    :label="$t('va.actions.copy')"
    icon="mdi-content-copy"
    icon-size="x-small"
    :color="color || 'green'"
    text
    @click="onCopy"
  ></va-action-button>
</template>

<script>
import Button from "../../../mixins/button";
import useResource from "../../../store/resource";
/**
 * Button for all delete resource action. Comes with confirm dialog.
 * Auto hide if no delete action available unless show prop is active.
 */
export default {
  mixins: [Button],
  inject: [],
  props: {
    /**
     * Redirect to resource list after successful deletion.
     * Default redirect active if current page is resource being deleted.
     */
    redirect: Boolean,
  },
  data() {
    return {
      visible: false
    }
  },
  async created() {
    this.visible = await this.hasAction('create')
  },
  methods: {
    async onCopy() {
      
      if (!this.item) {
        /**
         * Custom copy action if no item.
         * Used for bulk copy button which has his custom logic.
         */
        this.$emit("copy");
        return;
      }

      if (
        await this.admin.confirm(
          this.$t("va.confirm.copy_title", {
            resource: this.currentResource.singularName.toLowerCase(),
            id: this.item.id,
          }),
          this.$t("va.confirm.copy_message", {
            resource: this.currentResource.singularName.toLowerCase(),
            id: this.item.id,
          })
        )
      ) {
        //
        // we need use await in here otherwise refresh will 
        // not work as we expected
        // 
        const Self = this;
        const resource = useResource();
        resource.setResource(this.resource);

        await resource.copy({
          id: this.item.id,
        }).then(function(){
          if (Self.redirect) {
            Self.$router.push({ name: `${Self.resource}_list` })
            return
          }
          /**
           * Refresh
           */
          setTimeout(function(){
            resource.refresh(); 
          }, 200);
        });

        /**
         * Triggered on successful deletion of resource item.
         */
        this.$emit("copied")
      }

    },
  },
};
</script>