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
        :group-by="groupBy"
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
      groupBy: [{ key: 'name' }],
      selected: [],
      filters: [],
      fields: [
        {
          source: "data-table-group",
          label: this.$t("va.datatable.group"),
          sortable: false,
        },
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
          sortable: true,
        }
      ],
    };
  }
};
</script>

