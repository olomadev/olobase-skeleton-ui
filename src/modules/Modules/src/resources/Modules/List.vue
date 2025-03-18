<template>
  <div> 
    <va-list 
      disable-create
      row-create
      :fields="fields"
      :filters="filters"
      :items-per-page="200"
    >
      <va-data-table-server
        row-create
        row-clone
        row-edit
        disable-edit
        disable-show
        disable-clone
        disable-create-redirect
        @saved="afterSave"
      >
      </va-data-table-server>
    </va-list>
  </div>
</template>

<script>
import { required } from "@vuelidate/validators";

export default {
  props: ["resource", "title"],
  inject: [],
  data() {
    return {
      app: null,
      selected: [],
      filters: [],
      fields: [
        {
          source: "name",
          sortable: true,
        },
        {
          source: "version",
          sortable: true,
        },
        {
          source: "isActive",
          type: "boolean",
          sortable: true,
        }
      ],
    };
  },
  created() {
    this.app = this.$admin.getAppInstance();
  },
  methods: {
    async afterSave(event) {
      if (event.response && event.response?.data?.data?.oldRecord?.isActive != event.form.isActive) {
        window.location.reload(); // reload application for module changes 
      }
    }
  }
};
</script>

