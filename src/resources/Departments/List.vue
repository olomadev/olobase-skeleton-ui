<template>
  <div>
    <va-list 
      disable-create
      row-create
      hide-bulk-copy
      :filters="filters"
      :fields="fields"
      :items-per-page="50"
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
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["resource"],
  mixins: [Clipboard],
  created() {
    this.template = ``;
    this.handler = ``;
    this.model = ``;
  },
  provide() {
    return {
      validations: {
        form: {
          companyId: {
            required
          },
          departmentName: {
            required
          }
        }
      },
      errors: {
        companyIdErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyId.$dirty) return errors;
          v$['form'].companyId.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        departmentNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].departmentName.$dirty) return errors;
          v$['form'].departmentName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        }
      }
    };
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
      handler: null,
      model: null,
      filters: [
        {
          source: "companyId",
          type: "select",
          attributes: {
            multiple: true,
            reference: "companies",
          }
        },
      ],
      fields: [
        {
          source: "companyId",
          type: "select",
          attributes: {
          	multiple: false,
          	reference: "companies", 
          },
          sortable: true,
        },
        {
          source: "departmentName",
          sortable: true,
        },
      ],
    };
  },
  watch: {
    tab(value) {
      if (value > 0) {
        Prism.highlightAll(); // highlight code
      }
    }
  }
};
</script>