import Source from "./source"
import InputWrapper from "./input-wrapper"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"

/**
 * Main input mixin for all inputs used for resource property edition or creation.
 * Auto update the model of the parent form.
 * Use it to create your own input component.
 */
export default {
  mixins: [Source, InputWrapper],
  inject: {
    formState: { default: undefined },
  },
  props: {
    /**
     * Text to be edited.
     * @model
     */
    modelValue: {
      default: null,
    },
    /**
     * By default, the source will be the final name that will be sent to the API for create/update.
     * This prop allows you to override this default behavior.
     */
    model: String,
    /**
     * Whether to understand is lazy model (Ersin)
     */
    lazy: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to disable form state
     */
    disableFormState: Boolean,
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      acceptValue: true,
      input: null,
      internalErrorMessages: [],
    };
  },
  watch: {
    modelValue: {
      handler(val) {
        this.input = val;
      },
      immediate: true,
    },
    formState: {
      handler(val) {
        if (val && this.acceptValue) {
          /**
           * Initialize value & errors
           */
          this.update(
            this.getItem(get(val.item || val.model, this.uniqueSourceId))
          );
        }
      },
      immediate: true,
    },
    "formState.item"(val) {
      /**
       * Only if item change, mainly for form in aside case (users).
       */
      if (this.acceptValue) {
        this.update(
          this.getItem(get(val || this.formState.model, this.uniqueSourceId))
        );
      }
    },
    "formState.errors"(val) {
      if (val) {
        this.internalErrorMessages = val[this.uniqueFormId] || [];
      }
    },
  },
  computed: {
    uniqueSourceId() {
      return [this.parentSource, this.index, this.source]
        .filter((s) => s !== undefined)
        .join(".");
    },
    uniqueFormId() {
      return [this.parentSource, this.index, this.model || this.source]
        .filter((s) => s !== undefined)
        .join(".");
    },
    commonProps() {
      let label = '' // update for undefined checkbox labels
      if (typeof this.source == 'undefined') {
        label = ''
      } else if (typeof this.source != 'undefined' && typeof this.resource != 'undefined') {
        // label = this.$t(this.resource + "." + this.source)
        label = this.$admin.getSourceLabel(this.resource, this.source);
      }
      if (this.label) {
        label = this.label
      }
      return {
        color: "primary",
        label: label,
        modelValue: (Object.prototype.toString.call(this.input) === "[object String]" && isEmpty(this.input)) ? null : this.input,
        prependIcon: this.prependIcon,
        prependInnerIcon: this.prependInnerIcon,
        appendIcon: this.appendIcon,
        appendInnerIcon: this.appendInnerIcon,
        hint: this.hint,
        errorMessages: [...this.errorMessages, ...this.internalErrorMessages],
        hideDetails: this.hideDetails,
        density: this.density,
        placeholder: this.placeholder,
        clearable: this.clearable,
      };
    },
  },
  methods: {
    getItem(value) {
      return value === undefined ? this.modelValue : value;
    },
    change(event) {
      /**
       * Triggered on any user input interaction.
       */
      this.$emit("change", event.target.value);
    },
    update(value, returnFalse) {
      /**
      * Ersin: return-object support for Multiple Select inputs or Autocompleters
      *
      * If you uncomment below do codes you will get this warning 
      * when you change your master dropdown with select input which has the :key="exampleId"
      * 
      * [Vue warn]: Avoid using non-primitive value as key, use string/number value instead.
      */
       // if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, 'id')) {
       //      value = value.id
       // }
       /**
        * Ersin: multiple input duplicate test
        */
        // if (this.multiple) {    
        //     if (Array.isArray(value) && value.length > 1) {
        //         console.error(value)
        //     }
        // }
      /**
       * Update model in the injected form if available.
       */
      if (this.formState && !this.disableFormState) {
        this.formState.update({
          source: this.uniqueFormId,
          lazy: this.lazy,
          value,
        })
      }
      /**
       * Some inputs like currency, may no need to require update the value
       */
      if (returnFalse) {
        return
      }
      /**
       * Set value into input.
       */
      this.input = value;
      /**
       * Triggered if value updated.
       */
      this.$emit('update:modelValue', value); // this.$emit('update:modelValue', value)
    },
  },
};
