<template>
  <va-action-button
    :hide-label="icon"
    :label="label || defaultLabel"
    :item="item"
    icon="mdi-content-save"
    :color="color"
    :type="redirect ? 'button' : 'submit'"
    :loading="formState && formState.saving"
    :variant="null"
    @click="onClick"
  ></va-action-button>
</template>

<script>
import Button from "../../../mixins/button";

/**
 * Default saving button that can be used for VaForm component.
 * Dumb component, just a submit button, VaForm do the real work.
 */
export default {
  mixins: [Button],
  inject: {
    formState: { default: undefined },
  },
  props: {
    /**
     * Remove background button.
     */
    text: Boolean,
    /**
     * Override default label.
     */
    label: String,
    /**
     * Default route resource action to redirect after saving.
     * Disable the default submit behavior if set.
     * For specific redirect on submit, prefer `redirect` prop on `VaForm`
     * @values list, create, show, edit
     */
    redirect: {
      type: String,
      validator: (v) => ["list", "create", "show", "edit"].includes(v),
    },
  },
  computed: {
    defaultLabel() {
      if (this.redirect) {
        return this.$t(
          `va.actions.save_and_${
            this.redirect === "create" ? "add" : this.redirect
          }`
        );
      }
      return this.$t("va.actions.save");
    },
  },
  methods: {
    async onClick() {
      if (!this.redirect) {
        /**
         * `VaForm` will take care of saving
         */
        return;
      }
      // Explicit submit call
      await this.formState.submit(this.redirect);
    },
  },
};
</script>
