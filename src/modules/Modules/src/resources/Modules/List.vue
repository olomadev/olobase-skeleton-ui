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
  provide() {
    return {
      validations: {
        form: {
          name: {
            required
          },
          version: {
            required
          }
        }
      },
      errors: {
        nameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].name.$dirty) return errors;
          v$['form'].name.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        versionErrors: (v$) => {
          const errors = [];
          if (!v$['form'].version.$dirty) return errors;
          v$['form'].version.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    };
  },
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

