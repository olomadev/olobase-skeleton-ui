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
          module: {
            required
          },
          name: {
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
        moduleErrors: (v$) => {
          const errors = [];
          if (!v$['form'].module.$dirty) return errors;
          v$['form'].module.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        nameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].name.$dirty) return errors;
          v$['form'].name.required.$invalid &&
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
      groupBy: [{ key: 'module' }],
      selected: [],
      filters: [],
      fields: [
        {
          source: "data-table-group",
          label: this.$t("i18n.datatable.group"),
          sortable: false,
        },
        {
          source: "module",
          sortable: true,
        },
        {
          source: "name",
          sortable: true,
        },
        {
          source: "action",
          type: "select",
          sortable: true,
        },
        {
          source: "route",
          sortable: true,
        },
        {
          source: "method",
          type: "select",
          sortable: true,
        },
      ],
    };
  }
};
</script>

