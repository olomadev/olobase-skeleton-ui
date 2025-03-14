<template>
  <div>
    <v-snackbar 
      v-model="snackbar.visible" 
      :class="snackbar.class"
      :location="snackbar.location"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :variant="snackbar.variant"
      :rounded="snackbar.rounded"
      :transition="false"
      :multi-line="true"
      vertical
      style="padding:0;"
    >
      <v-layout class="align-center">
        <table style="min-width:350px;border:none;">
          <tbody>
            <tr>
              <td width="15%" style="border:none;padding-left:5px;">
                <v-icon class="pr-3" size="x-large">{{ snackbar.icon }}</v-icon>
              </td>
              <td style="border:none;">
                <div v-if="snackbar.title" class="mb-1">
                  <strong>{{ $t(snackbar.title) }}</strong>
                </div>
                <div v-html="snackbar.text"></div>
              </td>
              <td width="10%" style="border:none;" align="right"> 
                <v-btn 
                  variant="text"
                  style="padding:0;"
                  min-width="35"
                  @click="snackbar.visible = false"
                >
                  <v-icon size="x-large">mdi-close</v-icon>
                </v-btn>
            </td>
            </tr>
          </tbody>
        </table>
      </v-layout>
    </v-snackbar>
    <confirm></confirm>
  </div>
</template>

<script>
import Confirm from "../internal/Confirm.vue";
/**
 * Internal VaMessages system for snackbar infos and confirm dialog.
 * Integrated with all resource modules for message API calls.
 * Will automatically show `message` error property in case or API errors.
 * Already included in main admin layout, use it only if you need total custom layout.
 */
export default {
  inject: [],
  components: {
    Confirm,
  },
  computed : {
    snackbar() {
      return this.$store.getModule('messages').getSnackbar;
    }
  }
};
</script>
