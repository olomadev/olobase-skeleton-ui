<template>
  <v-row justify="center">
    <v-dialog 
      v-model="dialog" 
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5"> {{ $t('va.confirm.confirm_title') }} </v-card-title>
        <v-card-text>
          {{ $t('va.messages.form_lost_changes') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="agree"> {{ $t('va.confirm.yes') }} </v-btn>
          <v-btn color="green darken-1" text @click="cancel"> {{ $t('va.confirm.no') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      dialogValue: "dialog",
    }),
    dialog: {
      get() {
        return this.dialogValue;
      },
      set(bool) {
        this.cancel();
        return bool;
      },
    },
  },
  methods: {
    agree() {
      this.$store.commit("TOGGLE_AGREE");
    },
    cancel() {
      this.$store.commit("TOGGLE_CANCEL");
    },
  },
};
</script>
