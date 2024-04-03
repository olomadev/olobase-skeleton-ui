<template>
  <v-form @submit.prevent="save">
    <v-row justify="center">
      <v-card-text>
        <v-row no-gutters>
          <v-col sm="3" class="mr-3">
            <va-text-input
              source="name"
              v-model="model.name"
              variant="outlined"
              :error-messages="nameErrors"
            ></va-text-input>
          </v-col>
          <v-col sm="3" class="mr-3">
            <va-text-input
              source="surname"
              v-model="model.surname"
              variant="outlined"
              :error-messages="surnameErrors"
            ></va-text-input>
          </v-col>
          <v-col sm="3" class="mr-3">
            <va-text-input
              source="employeeNumber"
              v-model="model.employeeNumber"
              variant="outlined"
            ></va-text-input>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col sm="3" class="mr-3">
            <va-date-input
              source="employmentStartDate"
              v-model="model.employmentStartDate"
              variant="outlined"
            ></va-date-input>
          </v-col>

          <v-col sm="3" class="mr-3">
            <va-date-input
              source="employmentEndDate"
              v-model="model.employmentEndDate"
              variant="outlined"
            ></va-date-input>
          </v-col>

          <v-col sm="3" class="mr-3">
            <va-select-input
              source="companyId"
              v-model="model.companyId"
              reference="companies"
              variant="outlined"
              :error-messages="companyIdErrors"
            ></va-select-input>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col sm="3" class="mr-3">
            <va-select-input
              source="departmentId"
              :key="model.companyId"
              :filter="{ companyId: model.companyId }"
              v-model="model.departmentId"
              reference="departments"
              variant="outlined"
            ></va-select-input>
          </v-col>
          <v-col sm="3" class="mr-3">
            <va-select-input
              source="jobTitleId"
              v-model="model.jobTitleId"
              reference="jobtitles"
              variant="outlined"
            ></va-select-input>
          </v-col>
          <v-col sm="3" class="mr-3">
            <va-select-input
              source="gradeId"
              v-model="model.gradeId"
              reference="employee-grades"
              variant="outlined"
            ></va-select-input>
          </v-col>
          <v-col sm="3" class="mr-3">
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col lg="8" md="12" sm="12">
            <va-array-table-input
              source="employeeChildren"
              :title="$t('resources.employees.fields.employeeChildren')"
              v-model="model.employeeChildren"
              primary-key="childId"
              :headers="headers"
              :fields="fields"
              :generate-uid="true"
            >
              <template v-slot:[`edit`]="{ field }">
                <template v-if="field.source == 'childName'">
                  <va-text-input
                    :key="field.source"
                    v-model="form.childName"
                    variant="outlined"
                    :error-messages="childNameErrors"
                    clearable
                  >
                  </va-text-input>
                </template>
                <template v-if="field.source == 'childBirthdate'">
                  <va-date-input
                    :key="field.source"
                    v-model="form.childBirthdate"
                    variant="outlined"
                    :error-messages="childBirthdateErrors"
                  >
                  </va-date-input>
                </template>
              </template>
            </va-array-table-input>
          </v-col>
        </v-row>
<!--       
      !!! You shouldn't save files and large items using by row save dialog it may
      cause performance problems.

        <v-row no-gutters>
          <v-col sm="3" class="mr-3">
            <va-file-input
              source="files"
              v-model="model.files"
              table-name="employeeFiles"
            ></va-file-input>
          </v-col>
        </v-row>
-->
        <v-btn
          color="primary"
          :loading="loading"
          type="submit"
        >
          {{ $t("va.actions.save") }}
        </v-btn>
      </v-card-text>  
    </v-row>
  </v-form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import utils from "olobase-admin/src/mixins/utils";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { provide } from 'vue';

export default {
  props: ["item"],
  mixins: [utils],
  inject: ['admin'],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  validations(){
    return {
      model: {
        name: {
          required
        },
        surname: {
          required
        },
        companyId: {
          id: {
            required
          }
        },
      },
      form: {
        childName: {
          required,
        },
        childBirthdate: {
          required,
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      model: {
        id: null,
        name: null,
        surname: null,
        companyId: null,
        departmentId: null,
        jobTitleId: null,
        employeeNumber: null,
        gradeId: null,
        employmentStartDate: null,
        employmentEndDate: null,
        employeeChildren: null,
        // files: null,
      },
      headers: [
        { key: "childName" },
        { key: "childBirthdate" },
        { key: "actions" },
      ],
      fields: [
        {
          source: "childName",
          type: "text",
        },
        {
          source: "childBirthdate",
          type: "date",
        },
      ]
    };
  },
  created() {
    if (this.item && Object.prototype.hasOwnProperty.call(this.item, 'id')) {
      this.model = this.item;
    } else {
      this.model.id = this.generateUid();
    }
  },
  computed: {
    form: {
      get() {
        return this.$store.getters['employees/getRow'];
      },
      set(val) {
        this.$store.commit('employees/setRow', val);
      } 
    },
    nameErrors() {
      const errors = [];
      const field = "name";
      if (!this.v$['model'][field].$dirty) return errors;
      this.v$['model'][field].required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    surnameErrors() {
      const errors = [];
      const field = "surname";
      if (!this.v$['model'][field].$dirty) return errors;
      this.v$['model'][field].required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    companyIdErrors() {
      const errors = [];
      const field = "companyId";
      if (!this.v$['model'][field].id.$dirty) return errors;
      this.v$['model'][field].id.required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    childNameErrors() {
      const errors = [];
      const field = "childName";
      if (!this.v$["form"][field].$dirty) return errors;
      this.v$["form"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    childBirthdateErrors() {
      const errors = [];
      const field = "childBirthdate";
      if (!this.v$["form"][field].$dirty) return errors;
      this.v$["form"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
  },
  methods: {
    async save() {
      // validate multiple forms separately
      let invalid = this.validateForm(this, "model");
      if (invalid) {
        return false;
      }
      this.loading = true;
      if (this.item) { // edit
        await this.admin.http({ method: "PUT", url: "/employees/update/" + this.model.id, data: this.model });
      } else {
        await this.admin.http({ method: "POST", url: "/employees/create", data: this.model });
      }
      this.$store.dispatch("api/refresh", 'employees');
      this.loading = false;
    }
  },
}
</script>
