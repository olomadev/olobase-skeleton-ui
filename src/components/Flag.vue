<template>
  <div
    class="icon"
    :class="[`icon--${name}`, `icon--${size}`, { 'has-align-fix': fixAlign }]"
  >
    <InlineFlagSvg :name="`${name}`"></InlineFlagSvg>
  </div>
</template>

<script>
import InlineFlagSvg from './InlineFlagSvg.vue';

export default {
  // created: function() {}
  components: {
    InlineFlagSvg,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'normal',
    },
    modifier: {
      type: Object,
      default: null,
    },
    fixAlign: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>