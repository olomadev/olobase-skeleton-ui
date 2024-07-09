<template>
  <div class="mb-5">
    <editor
      v-if="created"
      api-key="no-api-key"
      :init="mergedOptions"
      :modelValue="input"
      @update:modelValue="update"
    >
    </editor>
    <div class="v-input__details" v-for="error in getErrorMessages">
      <div class="v-messages" style="color: rgb(var(--v-theme-error));" role="alert">
        <div class="v-messages__message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from "olobase-admin/src/mixins/input";
import Editor from '@tinymce/tinymce-vue'
import { loadScript } from "vue-plugin-load-script";

export default {
  mixins: [Input],
  inject: {
    v$: {
      default: null
    }
  },
  components: {
    Editor
  },
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    /**
     * List of custom error validation messages to show as hint
     */
    errorMessages: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      created: false,
      mergedOptions: null,
    }
  },
  async created() {
    const options = { 
      min_height: 150, 
      promotion: false, 
      menubar: false, 
      language_url: '/assets/tinymce/langs/tr.js',
      license_key: 'gpl', 
      plugins: ['preview'], 
      toolbar: 'undo redo | formatselect | bold italic blocks fontsize backcolor preview | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat'
    };
    loadScript("/assets/tinymce/tinymce.min.js").then(() => {
      this.created = true;
    });
    this.mergedOptions = { ...options, ...this.options }
  },
  computed: {
    getErrorMessages() {
      if (Array.isArray(this.errorMessages) && this.errorMessages.length > 0) {
        return this.errorMessages;
      }
      return [];
    },
  }

}
</script>

<style>
/*  change editor area border color */
.tox-edit-area::before{
  border:2px solid rgb(var(--v-theme-primary)) !important;
}
.tox-dialog__footer button {
  background-color: rgb(var(--v-theme-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>