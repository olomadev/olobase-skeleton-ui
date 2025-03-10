<template>
  <v-form @submit.prevent="onSubmit">
    <!-- @slot All content form with all inner inputs. Model will be injected for each inputs. -->
    <slot></slot>
  </v-form>
</template>

<script>
import Resource from "../../../mixins/resource"
import { set, isEmpty } from "lodash"

// import {required} from "vuelidate/lib/validators"
// 
// *** Provide Inject Sub Forms
// 
// https://stackoverflow.com/questions/54344033/vuelidate-validate-form-with-sub-components
/**
 * Form component which handle resource saving by calling `create` or `update` data provider methods.
 * It's the better place for made heavy usage of any VA inputs.
 * Use injection which allowing unique global v-model for all inputs.
 */
export default {
  mixins: [Resource],
  inject: {
    v$: {
      default: null
    },
  },
  provide() {
    return {
      formState: this.formState,
    };
  },
  props: {
    /**
     * Current form model being edited. Represent the final data that will be send through your API.
     * @model
     */
    modelValue: {
      type: Object,
      default: () => {},
    },
    /**
     * Id of resource to be edit. If null, then create a new one.
     */
    id: [String, Number],
    /**
     * Explicit item resource object where all properties must be injected into form model.
     */
    item: {
      type: Object,
      default: () => {},
    },
    /**
     * Default route resource action to redirect after saving.
     * @values list, create, show, edit
     */
    redirect: {
      type: String,
      validator: (v) => ["list", "create", "show", "edit"].includes(v),
      default: "list",
    },
    /**
     * Disable default submit behavior
     */
    disableSubmit: Boolean,
    /**
     * Disable default redirect behavior
     */
    disableRedirect: Boolean,
    /**
     * Disable default save behavior
     */
    disableSaveMessage: Boolean,
  },
  validations: {},
  data() {
    return {
      fields: { },
      originalValue: this.modelValue,
      formItem: (this.$store.getResource(this.resource).getFormItem) ? JSON.parse(this.$store.getResource(this.resource).getFormItem) : null,
      formState: {
        edit: !!this.id,
        item: this.item,
        model: {},
        saving: false,
        errors: {},
        update: ({ source, value, lazy }) => {

          if (source == "") { // prevent store empty keys
              return
          }
          /**
           * Let's check the form changes one by one
           */
          if (typeof this.formState.model[source] !== 'undefined' && this.id && this.item) {
            //
            // Is something changed in the form ?
            // 
            let item = this.formItem;
            let oldValue = null;
            if (item && typeof item[source] !== "undefined") {
              oldValue = item[source];
            }
            if ((oldValue == null || oldValue == "") 
              && Array.isArray(value) && value.length == 0) { // fixes empty array problems
              value = null;
              oldValue = null;
            }
            if (oldValue && (Array.isArray(oldValue) || typeof oldValue === 'object')) {  
              if (JSON.stringify(oldValue) != JSON.stringify(value)) {
                this.$store.getModule("api").setFormStatus(true); // true == form state changed    
              }
            } else {
              if (oldValue != value) {
                this.$store.getModule("api").setFormStatus(true); // true == form state changed  
              }
            }
          }
          // Prevent multiple emit for some inputs like v-money
          // 
          if (lazy) {
              if (typeof this.fields[source] !== 'undefined') {  // prevent loop
                  return
              } else {
                  this.fields[source] = 0
              }  
          }
          if (value && 
            this.v$ 
            && source != "id" 
            && typeof this.v$['model'] !== "undefined"
            && typeof this.v$['model'][source] !== "undefined") {  // field touch validation if its not empty
              this.v$['model'][source].$touch()
          }      
          let model = { ...this.formState.model };
          set(model, source, value);

          // do not remove here
          //
          this.formState.model = model;

          // JSON.stringify fields bug, every field add model object to current model
          // when we use the v-model attribue
          // 
          if (Object.prototype.hasOwnProperty.call(model, 'model')) {
              delete model.model
          }
          if (Object.prototype.hasOwnProperty.call(model, 'editedItem')) {
              delete model.editedItem
          }
          /**
           * Send model update, called after each single input change.
           */
          this.$emit("update:modelValue", model)
        },
        submit: async(redirect) => {
          this.save(redirect)
        },
      },
    };
  },
  watch: {
    item(val) {
      if (!val) {
        this.formState.model = this.originalValue;
      }
      this.formState.item = val;
    },
    modelValue: {
      handler(val) {
        if (val) {
          this.formState.model = val;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onSubmit() {
      if (this.disableSubmit) {
        return;
      }
      if (this.disableRedirect) {
        await this.save()
        return;
      }
      await this.save(this.redirect)
    },
    async save(redirect) {
      /**
       * Vuelidate validations
       * It allows multiple form validations
       */
      const Self = this;
      if (this.v$ && this.v$["model"]) { // if we have a validation
        let invalid = false;
        const fields = Object.keys(Self.v$["model"]);
        fields.forEach(function(val){
          if (val.charAt(0) != "$") {  // reserved variables
            Self.v$["model"][val].$touch();
            if (Self.v$["model"][val].$invalid) {
              invalid = true
            }  
          }        
        })
        if (invalid) {
          return;
        }
      }
      /**
       * Set saving to childs.
       */
      this.formState.saving = true

      var model = this.formState.model

      // Post object data normalizer
      // put id into the array
      // to make post data friendly for swagger
      // if form state item isArray & no any keys add "id" key as object
      //
      Object.entries(model).forEach(function(val){
          if (Array.isArray(val)) {
              let k = val[0]
              let v = val[1]
              if (Array.isArray(v)) {
                 if (typeof val[1][0] !== 'object') {
                    v.forEach(function(id, key) {
                        if (typeof id !== 'object') {
                            model[k][key] = { id: id }  
                        }
                    })
                 }
              }
          }
      })
      this.formState.model = model
      /**
      * Create event before saving.
      */
      this.$emit("model", model);
      try {
        let response = this.id
          ? await this.$store.getResource(this.resource).update({
              id: this.id,
              data: this.formState.model,
            })
          : await this.$store.getResource(this.resource).create({
              data: this.formState.model,
            });

        if (response.status == 200) {
          const data = response.data.data;
          /**
           * Sent after success saving.
           */
          this.$emit("saved", data);
          this.$store.getModule("api").setFormSaved(true);
          this.formState.errors = null
          //
          // post process must be in a set timeout function
          // otherwise these functions does not work well !
          // 
          if (! this.disableSaveMessage) {
            let Self = this;
            setTimeout(function(){
              Self.$store.getModule("messages").show({ type: 'success', message: Self.$t("form.saved") });
            }, 100);
          }
          switch (redirect) {
            case "list":
              let listQuery = null;
              if (localStorage.getItem("listQuery")) {
                listQuery = JSON.parse(localStorage.getItem("listQuery"));  
              }
              if (listQuery && listQuery['filter']) {
                this.$router.push({ name: `${this.resource}_list`, query: { filter: listQuery['filter'] } })  
              } else {
                this.$router.push({ name: `${this.resource}_list` })
              }
              break;
            case "create":
              // Reset form in case of same route
              this.formState.item = null;
              this.formState.model = this.originalValue;
              this.$router.push({ name: `${this.resource}_create` })
              break;
            case "show":
              this.$router.push({
                name: `${this.resource}_show`,
                params: { id: data.id },
              });
              break;
            case "edit":
              this.$router.push({
                name: `${this.resource}_edit`,
                params: { id: data.id },
              });
              break;
          }
        }
      } catch (e) {
        if (e.errors) {
          this.formState.errors = e.errors
        }
        /**
         * Create event after success saving.
         */
        this.$emit("error", e.errors);

      } finally {
        this.formState.saving = false
      }
    }

  },
};
</script>
