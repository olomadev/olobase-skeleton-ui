<template>
  <va-form 
    :id="id" 
    :item="item" 
    disable-redirect 
    v-model="model"
  >
    <v-row>
      <v-col>
        <va-text-input
          source="companyName"
          :error-messages="companyNameErrors"
          variant="outlined"
        ></va-text-input>
        <va-text-input
          source="companyShortName"
          :error-messages="companyShortNameErrors"
          variant="outlined"
        ></va-text-input>
        <va-text-input
          source="taxOffice"
          :error-messages="taxOfficeErrors"
          variant="outlined"
        ></va-text-input>
        <va-text-input
          source="taxNumber"
          :error-messages="taxNumberErrors"
          variant="outlined"
        ></va-text-input>
        <va-text-input
          source="address"
          :error-messages="addressErrors"
          variant="outlined"
        ></va-text-input>
        <va-save-button></va-save-button>
      </v-col>
    </v-row>
  </va-form>
</template>

<script>
import Utils from "olobase-admin/src/mixins/utils";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import { provide } from 'vue';

export default {
  props: ["id", "item"],
  mixins: [Utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      model: {
        id: null,
        companyName: null,
        companyShortName: null,
        taxOffice: null,
        taxNumber: null,
        address: null,
      },
    };
  },
  validations: {
    model: {
      companyName: {
        required,
        maxLength: maxLength(160),
      },
      companyShortName: {
        required,
        maxLength: maxLength(60),
      },
      taxOffice: {
        maxLength: maxLength(100),
      },
      taxNumber: {
        numeric,
        maxLength: maxLength(60),
      },
      address: {
        maxLength: maxLength(255),
      },
    },
  },
  computed: {
    companyNameErrors() {
      const errors = [];
      const field = "companyName";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "160" }));
      return errors;
    },
    companyShortNameErrors() {
      const errors = [];
      const field = "companyShortName";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    taxOfficeErrors() {
      const errors = [];
      const field = "taxOffice";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "100" }));
      return errors;
    },
    taxNumberErrors() {
      const errors = [];
      const field = "taxNumber";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].numeric.$invalid &&
        errors.push(this.$t("v.number.numeric"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    addressErrors() {
      const errors = [];
      const field = "address";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "255" }));
      return errors;
    },
  },
  created() {    
    this.model.id = this.generateUid();
  }
};
</script>
