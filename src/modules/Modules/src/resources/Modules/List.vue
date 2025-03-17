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
      selected: [],
      filters: [],
      fields: [
        {
          source: "moduleName",
          sortable: true,
        },
        {
          source: "moduleVersion",
          sortable: true,
        },
        {
          source: "isActive",
          type: "boolean",
          sortable: true,
        }
      ],
    };
  }
};
</script>

