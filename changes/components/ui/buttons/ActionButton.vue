<template>
  <span>
    <v-btn 
      v-if="variant"
      :variant="variant"
      :icon="hideLabel || !lgAndUp"
      :href="href"
      :target="target"
      :to="to"
      @click="onClick"
      :color="color"
      v-bind="externalProps"
      exact
      :type="type"
      :loading="loading"
    >
      <v-icon :size="iconSize">{{ icon }}</v-icon>
      <span v-if="!hideLabel && lgAndUp" class="ml-2">
        {{ label }}
      </span>
    </v-btn>
    <v-btn v-else
      :icon="hideLabel || !lgAndUp"
      :href="href"
      :target="target"
      :to="to"
      @click="onClick"
      :color="color"
      v-bind="externalProps"
      exact
      :type="type"
      :loading="loading"
    >
      <v-icon :size="iconSize">{{ icon }}</v-icon>
      <span v-if="!hideLabel && lgAndUp" class="ml-2">
        {{ label }}
      </span>
    </v-btn>
  </span>
</template>

<script>
import { useDisplay } from 'vuetify'
import ActionButton from "../../../mixins/action-button"

/**
 * Component tu use for any custom action button. Can be used on data table rows or top header of create, show and edit pages.
 */
export default {
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp } = useDisplay()
    return { lgAndUp }
  },
  mixins: [ActionButton],
  props: {
    /**
     * Explicit item resource object where all properties must be injected into form model.
     */
    item: {
      type: Object,
      default: () => {},
    },
    /**
     * Extra props
     */
    externalProps: {
      type: Object,
      default: () => {},
    },
    /**
     * Set the button's variant.
     */
    variant: {
      type: String,
      default: "text",
    },
    /**
     * Set icon size
     */
    iconSize: {
      type: String,
      default: "default",
    },
    /**
     * Set the button's type attribute.
     */
    type: {
      type: String,
      default: "button",
    },
    /**
     * Vue route to redirect on click.
     */
    to: [String, Object],
    /**
     * Turn button to anchor and use href.
     */
    href: [String, Object],
    /**
     * Anchor target if href used.
     */
    target: String,
    /**
     * Active a spinner if enabled.
     */
    loading: Boolean,
  },
};
</script>
