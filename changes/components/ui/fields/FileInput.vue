<template>
  <div>
    <v-file-input
      :density="density"
      prepend-icon=""
      prepend-inner-icon="mdi-attachment"
      v-bind="getCommonProps"
      :variant="variant"
      :chips="chips"
      multiple
      clearable
      show-size
      :small-chips="smallChips"
      :accept="accept"
      :modelValue="fileFormatted"
      @update:modelValue="updateFile"
    >
      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip
            size="x-small"
            @click.stop="clickMeIndex($event, index)"
          >
            {{ fileName }}
          </v-chip>
<!--             <span
            v-else-if="index === 2"
            class="text-overline text-grey-darken-3 mx-2"
          >
            +{{ files.length - 2 }} File(s)
          </span> -->
        </template>
      </template>
    </v-file-input>
  </div>
</template>

<script>
import Input from "../../../mixins/input";
import Utils from "../../../mixins/utils"
import Multiple from "../../../mixins/multiple";

/**
 * Allow row file uploads. Can be multiple.
 * Current files will be shown as simple link or thumbnail image and can be deleted.
 * Use VaFileField or VaImageField under the hood.
 * No Ajax support.
 */
export default {
  mixins: [Input, Multiple, Utils],
  props: {
    /**
     * Attribute where taking the id value for identify files to delete.
     */
    itemValue: {
      type: String,
      default: "id",
    },
    /**
     * Add HTML5 `accept` attribute for simple client-side validation.
     */
    accept: String,
    /**
     * base64 upload option
     */
    base64: {
      type: Boolean,
      default: true,
    },
    /**
     * Set tablename
     */
    tableName: String,
    /**
     * Use different styles: 
     * 
     * | 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled'
     */
    variant: {
      type: String,
      default: "outlined",
    },
    /**
     * Download is enabled
     */
    download: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      clear: false,
      image: null,
      files: [],
      acceptValue: false,
    };
  },
  computed: {
    getCommonProps(){
      // fix the overrides
      delete this.commonProps.appendIcon;
      delete this.commonProps.prependIcon;
      delete this.commonProps.appendInnerIcon;
      delete this.commonProps.prependInnerIcon;
      // default multiple
      return { ...this.commonProps, multiple: true }
    },
    fileFormatted() {
      return this.input;
    }
  },
  created() {
    // "default null value" bug at first load fixed
    //
    let item = this.getItem();
    if (this.source && item && typeof item[this.source] !== "undefined") {
      this.input = item[this.source];
      this.update(this.input);
    }
  },
  methods: {
    updateFile(val) {
      if (typeof val == "undefined" || (Array.isArray(val) && val.length == 0)) {
        this.files = []
        this.update(val)
        this.clear = true
        return
      }
      this.clear = false
      if (this.base64) {
        this.createBase64Files(val)
      } else {
        this.update(val)
      }
      // this.change(val)
    },
    createBase64Files(value) {
      for (var i=0;i<=value.length;i++) {
        this.createFile(i, value[i]) 
      }
    },
    createFile(index, fileObject) {
      const reader = new FileReader;
      reader.onload = (event) => {
        this.files[index] = { id: null, size: null, name: null, data: null, type: null }
        if (typeof fileObject["id"] == "undefined") {
          this.files[index]["id"] = this.generateUid()
        }
        this.files[index]["size"] = fileObject.size
        this.files[index]["name"] = fileObject.name
        this.files[index]["type"] = fileObject.type
        this.files[index]["data"] = event.target.result

        this.image = event.target.result;
        this.update(this.files)
      }
      // check file is exists
      // https://stackoverflow.com/questions/32508191/uncaught-typeerror-failed-to-execute-readasdataurl-on-filereader-parameter
      if (typeof event.target.files[index] != 'undefined') {
        reader.readAsDataURL(fileObject)
      }
    },
    // remove(index) {
    //   this.files.splice(index, 1)
    //   this.update(this.files)
    // },
    getItem() {
      if (this.formState && Object.prototype.hasOwnProperty.call(this.formState, "item")) {
        return this.formState.item
      }
      return null
    },
    clickMeIndex(e, index){
      e.stopPropagation();
      if (this.download) {
        this.downloadFileWithIndex(index)  
      }
    },
    downloadFileWithIndex(index) {
      let url = this.$admin.apiUrl + this.$admin.downloadUrl + String(this.value[index].id) + '?tableName=' + this.tableName
      this.testFile(url, this.value[index].id)
    },
    async testFile(url, fileId) {
      let response = null
      try {
        response = await this.$admin.http.get(url)
        if (response.status == 200 && typeof fileId != "undefined") {
          location.href = url
        }
      } catch (e) {
        console.log(e)
        this.$store.commit("messages/show", { type: 'warning', message: this.$t("error.fileNotFound") });  
      }
    },
  }
};
</script>