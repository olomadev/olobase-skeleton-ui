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
  provide() {
    return {
      validations: {
        form: {
          moduleName: {
            required
          },
          resource: {
            required
          },
          route: {
            required
          },
          action: {
            required
          },
          method: {
            required
          }
        }
      },
      errors: {
        moduleNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].moduleName.$dirty) return errors;
          v$['form'].moduleName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        resourceErrors: (v$) => {
          const errors = [];
          if (!v$['form'].resource.$dirty) return errors;
          v$['form'].resource.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        actionErrors: (v$) => {
          const errors = [];
          if (!v$['form'].action.$dirty) return errors;
          v$['form'].action.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        routeErrors: (v$) => {
          const errors = [];
          if (!v$['form'].route.$dirty) return errors;
          v$['form'].route.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        methodErrors: (v$) => {
          const errors = [];
          if (!v$['form'].method.$dirty) return errors;
          v$['form'].method.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    };
  },
  data() {
    return {
      groupBy: [{ key: 'moduleName' }],
      selected: [],
      filters: [],
      fields: [
        {
          source: "data-table-group",
          label: this.$t("va.datatable.group"),
          sortable: false,
        },
        {
          source: "moduleName",
          sortable: true,
        },
        {
          source: "resource",
          sortable: true,
        },
        {
          source: "action",
          type: "select",
          attributes: {
            reference: "actions",
          },
          sortable: true,
        },
        {
          source: "route",
          sortable: true,
        },
        {
          source: "method",
          type: "select",
          attributes: {
            reference: "methods",
          },
          sortable: true,
        },
      ],
    };
  }
};
</script>

