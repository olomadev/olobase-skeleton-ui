<template>
  <div>    
    <va-list 
      disable-create
      :fields="fields"
      :items-per-page="10"
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

    <v-tabs
      class="mt-3"
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">Template</v-tab>
      <v-tab value="2">Script</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-html">{{ template }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="2">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-javascript">{{ script }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["resource"],
  mixins: [Clipboard],
  inheritAttrs: false,
  created() {
    this.template = `<template>
  <va-list 
    disable-create
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
</template>`;
    this.script = `\<script\>
import { required } from "@vuelidate/validators";

export default {
  props: ["resource"],
  provide() {
    return {
      validations: {
        form: {
          yearId: {
            required
          },
          companyId: {
            required
          },
          jobTitleName: {
            required
          }
        }
      },
      errors: {
        yearIdErrors: (v$) => {
          const errors = [];
          if (!v$['form'].yearId.$dirty) return errors;
          v$['form'].yearId.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        companyIdErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyId.$dirty) return errors;
          v$['form'].companyId.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        jobTitleNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].jobTitleName.$dirty) return errors;
          v$['form'].jobTitleName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        }
      }
    };
  },
  data() {
    return {
      fields: [
        {
          source: "yearId",
          reference: "years",
          type: "select",
          sortable: true,
        },
        {
          source: "companyId",
          reference: "companies",
          type: "select",
          sortable: true,
        },
        {
          source: "jobTitleName",
          sortable: true,
        },
      ],
    };
  }
};
\</script\>`;
  },
  provide() {
    return {
      validations: {
        form: {
          yearId: {
            required
          },
          companyId: {
            required
          },
          jobTitleName: {
            required
          }
        }
      },
      errors: {
        yearIdErrors: (v$) => {
          const errors = [];
          if (!v$['form'].yearId.$dirty) return errors;
          v$['form'].yearId.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        companyIdErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyId.$dirty) return errors;
          v$['form'].companyId.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        jobTitleNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].jobTitleName.$dirty) return errors;
          v$['form'].jobTitleName.required.$invalid &&
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
      fields: [
        {
          source: "yearId",
          reference: "years",
          type: "select",
          sortable: true,
        },
        {
          source: "companyId",
          reference: "companies",
          type: "select",
          sortable: true,
        },
        {
          source: "jobTitleName",
          sortable: true,
        },
      ],
    };
  },
  watch: {
    tab(value) {
      if (value == 1) {
        Prism.highlightAll(); // highlight code
      }
      if (value == 2) {
        Prism.highlightAll(); // highlight code
      }      
    }
  }
};
</script>

