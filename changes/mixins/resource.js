 
// How to get Current Route in Vue router 4 
// https://stackoverflow.com/questions/53126710/how-to-get-current-name-of-route-in-vue

import { useRoute } from 'vue-router'

/**
 * For any resource related components.
 */
export default {
  inject: [],
  props: {
    /**
     * Name of the resource to use.
     * Required for good label localization and context action activators.
     * Default behavior is to fetch it from router context.
     */
    resource: {
      type: String,
      default() {
        return useRoute().meta.resource
      },
    },
  },
  computed: {
    translatable() {
      return useRoute().meta.translatable
    },
    currentModule() {
      return useRoute().meta.module
    },
    currentResource() {
      return this.$admin.getResource(this.resource)
    },
  },
  methods: {
    async hasAction(action) {

      let result = await this.currentResource.canAction(action)
      
      /**
       * Check if access with user permissions for this specific action
       */
      return result
    },
    hasRoute(route) {
      /**
       * Check if CRUD route is defined for this resource
       */
      return (
        !this.currentResource.routes ||
        this.currentResource.routes.includes(route)
      );
    },
  },
};
