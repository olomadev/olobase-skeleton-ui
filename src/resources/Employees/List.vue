<template>
  <div>
    <va-list
      :filters="filters"
      :fields="fields"
      :items-per-page="10"
      enable-save-dialog
    >
      <va-data-table-server
        row-create
        row-edit
        row-show
        row-save-dialog
        row-save-dialog-width="1024"
        row-save-dialog-height="800"
        disable-clone
        disable-show
      >
      </va-data-table-server>
    </va-list>
  </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import isEmpty from "lodash/isEmpty"

export default {
  props: ["resource", "title"],
  provide() {
    return {
      validations: {
        form: {
          companyId: {
            required
          },
          employeeNumber: {
            required
          },
          name: {
            required
          },
          surname: {
            required
          },
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
        employeeNumberErrors: (v$) => {
          const errors = [];
          if (!v$['form'].employeeNumber.$dirty) return errors;
          v$['form'].employeeNumber.required.$invalid &&
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
        surnameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].surname.$dirty) return errors;
          v$['form'].surname.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        }
      }
    };
  },
  data() {
    return {
      loading: false,
      yearId: new Date().getFullYear(),
      filters: [
        {
          source: "companyId",
          type: "select",
          attributes: {
            optionText: "name",
            multiple: true,
            reference: "companies",
          }
        },
        {
          source: "jobTitleId",
          type: "select",
          attributes: {
            optionText: "name",
            multiple: true,
            reference: "jobtitles",
          }
        },
      ],
      fields: [
        {
          source: "companyId",
          type: "select",
          attributes: {
            reference: "companies",
          },
          sortable: true,
          width: "15%"
        },
        {
          source: "departmentId",
          type: "select",
          attributes: {
            reference: "departments",
          },
          key: "companyId",
          filters: ["companyId"],
          sortable: true,
          width: "15%"
        },
        {
          source: "employeeNumber",
          sortable: true,
          width: "10%"
        },
        {
          source: "name",
          sortable: true,
          width: "10%"
        },
        {
          source: "surname",
          sortable: true,
          width: "10%"
        },
        {
          source: "jobTitleId",
          type: "select",
          attributes: {
            reference: "jobtitles",
          },
          sortable: true,
          width: "20%"
        },
        {
          source: "employmentStartDate",
          type: "date",
          sortable: true,
          width: "15%"
        },
      ],
    };
  }
};
</script>
