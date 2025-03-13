<template>
  <span>{{ getText }}</span>
</template>

<script>
import Field from "../../../mixins/field";
import { isObject, truncate } from '@/helpers/lodash';

/**
 * Show value as simple text, render a simple span. HTML tags will be stripped.
 */
export default {
  mixins: [Field],
  inject: ['i18n'],
  props: {
    /**
     * Truncate text
     */
    truncate: Number,
    /**
     * Override default label behavior.
     * Default is to get the localized VueI18n label from both resource and property source.
     */
    label: String,
  },
  computed: {
    getLabel() {
      if (this.label) {
        return this.label;
      }
      let source = this.resource + "." + this.source;
      if (this.parentSource) {
        source = `${this.parentSource}.${this.source}`;
      }
      return this.i18n.global.t(source);
    },
    getText() {
      /**
       * ObjectId support
       */
      let value = this.value;
      if (isObject(value)) {
        value = this.value['name']
      }
      return this.truncate
        ? truncate(value, {
            length: this.truncate,
          })
        : value;
    },
  },
};
</script>
