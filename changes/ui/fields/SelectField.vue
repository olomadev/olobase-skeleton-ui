<template>
  <div>
    <span v-if="chip & multiple">
      <v-chip 
        v-for="item in getVal(value)" 
        :color="getColor(value)" 
        :small="small" 
        :to="to"
        >
        <slot :value="selected">
          <span>{{ item.name }}</span>
        </slot>
      </v-chip>
    </span>
    <span v-else>
      <slot :value="selected">
        <span>{{ selected ? selected[itemText] : getVal(value) }}</span>
      </slot>
    </span>
  </div>
</template>

<script>
import Field from "../../../mixins/field";
import Choices from "../../../mixins/choices";
import Chip from "../../../mixins/chip";
import { isObject } from '@/helpers/lodash';

/**
 * Show value as text selected from a predefined key-value choices.
 * If no choices, by default, takes localized enums with source as value from your VueI18n resources locales.
 */
export default {
  mixins: [Field, Choices, Chip],
  props: {
    /**
     * Show text inside material chip.
     */
    chip: {
      type: Boolean,
      default() {
        return true;
      },
    },
    multiple: Boolean,
  },
  computed: {
    selected() {
      return this.choices.find((c) => c[this.itemValue] === this.value);
    },
  },
  methods: {
    getVal(val) {
      if (isObject(val) && typeof val.name !== 'undefined') {
        return (this.multiple && Array.isArray(val)) ? val.map(item => item.name).join(', ') : val.name
      }
      return val
    },
  }
};
</script>
