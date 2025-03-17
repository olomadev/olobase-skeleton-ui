<template>
  <div class="mb-3">
    <v-card 
      flat
      class="mx-auto mb-4 text-xs-center"
      max-width="100"
      rounded="0"
    >
      <v-avatar
        :color="backgroundColor"
        size="100"
        rounded="5"
      >
        <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
          <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
        </template>
        <v-img cover v-if="input" :src="input"></v-img>
        <v-img cover v-else :src="defaultSrc"></v-img>
      </v-avatar>

      <div class="justify-center mt-2">
        <v-btn block
          v-if="!input"
          size="x-small"
          color="secondary"
          class="mt-1 mb-4" 
          @click="$refs.file.click()">
          <input hidden
            type="file"
            ref="file"
            @change="uploadImage($event)"
            accept="image/*"
          />
          {{ setLabel }}
        </v-btn>
        <v-btn 
          v-else
          block
          size="x-small"
          class="mt-1 mb-4"
          color="secondary"
          @click="deleteAvatar"
        >
          {{ delLabel }}
        </v-btn>
      </div>
    </v-card>

    <v-text-field
      v-bind="commonProps"
      type="text"
      v-show="false"
      color="primary"
      @change="change"
      @update:modelValue="update"
    ></v-text-field>

    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        width="auto"
        height="auto"
      >
        <v-card>
          <v-card-text>
          <div>
            <Cropper
              ref="cropper"
              class=""
              :src="uploadedImage"
              :stencil-component="$options.components.Stencil"
            />
          </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row no-gutters>
              <v-col class="text-left">
                <v-btn
                  color="primary"
                  @click="reset"
                >
                  {{ $t("va.actions.close") }}
                </v-btn>
              </v-col>
              <v-col class="text-right">
                <v-btn
                    color="primary"
                    @click="cropImage"
                  >
                  {{ $t("va.actions.crop") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </div>
</template>

<script>
import Input from "../../../mixins/input"
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Stencil from "../utils/Stencil.vue";
import AvatarDefaultSvg from '@/assets/svg/avatar_default.svg';

export default {
  mixins: [Input],
  components: {
    Cropper,
    Stencil,
  },
  // emits: ['update:modelValue'],
  props: {
    /**
     * Set background color
     */
    backgroundColor: {
      type: String,
      default: "#ededed",
    },
    /**
     * Set default image
     */
    defaultSrc: {
      type: String,
      default: AvatarDefaultSvg,
    },
    /**
     * Value to be edited
     */
    modelValue: {
      type: String,
      default() {
        return ""
      },
    },
    /**
     * Avatar set button label
     */
    setLabel: {
      type: String,
      default: "Set Avatar",
    },
    /**
     * Avatar del button label
     */
    delLabel: {
      type: String,
      default: "Delete",
    }
  },
  data() {
    return {
      uploadedImage: null,
      dialog: false,
    }
  },
  methods: {
    cropImage() {
      const result = this.$refs.cropper.getResult();
      this.input = result.canvas.toDataURL("image/jpeg");
      this.update(this.input);
      this.dialog = false;
    },
    uploadImage(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          
          this.uploadedImage = e.target.result;
          this.dialog = true

        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },
    deleteAvatar() {
      this.input = null
      this.update(null);
      this.dialog = false;
      this.uploadedImage = null;
    },
    reset() {
      this.dialog = false;
      this.$refs.file.value = '';
      this.uploadedImage = null;
    }
  }
};
</script>

