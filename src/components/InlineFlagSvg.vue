<template>
  <i v-html="svg" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      flags: import.meta.glob(`../assets/flags/*.svg`, {
        // as: 'raw',
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    };
  },

  computed: {
    svg() {
      let svgFile = this.flags[`../assets/flags/${this.name}.svg`]
      return svgFile;
    },
  },
};
</script>