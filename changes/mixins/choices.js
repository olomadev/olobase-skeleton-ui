/**
 * Common props for all choices based fields or inputs.
 */
export default {
  created() {
    let enums = null;
    let results = [];
    //
    // Added support for module names
    //
    if (this.resource.includes("_")) {
      const parts = this.resource.includes("_") ? this.resource.split("_") : [null, this.resource];
      const module = parts[0];
      const resourceName = parts[1];
      const enumKey = module 
        ? `${module}.enums.${this.source}` 
        : `${resourceName}.enums.${this.source}`;
      results = this.$admin.i18n.global.tm(enumKey);
    }
    if (!results) {
      return;
    }
    if (Array.isArray(results) && results.length > 0) {
      let Self = this
      results.forEach(function(val, index){
        Self.choices[index] = val
      });
    }
  },
  props: {
    /**
     * Attribute for showing text.
     */
    itemText: {
      type: [String, Array, Function],
      default: "name",
    },
    /**
     * Attribute where taking the value from.
     */
    itemValue: {
      type: [String, Array, Function],
      default: "id",
    },
    /**
     * List of choices for select.
     * Takes localized enums from your VueI18n resources locales by default.
     */
    choices: {
      type: Array,
      default() {
        return []
      },
    },
  },
};
