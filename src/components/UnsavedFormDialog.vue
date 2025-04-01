<template>
  <v-row justify="center">
    <v-dialog 
      v-model="dialog" 
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5"> {{ $t('i18n.confirm.confirmTitle') }} </v-card-title>
        <v-card-text>
          {{ $t('i18n.messages.formLostChanges') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="agree"> {{ $t('i18n.confirm.yes') }} </v-btn>
          <v-btn color="green darken-1" text @click="cancel"> {{ $t('i18n.confirm.no') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  computed: {
    dialog: {
      get() {
        return this.$store.getModule("messages").editDialog;
      },
      set(bool) {
        this.cancel();
        return bool;
      },
    },
  },
  methods: {
    agree() {
      this.$store.getModule("messages").agreeUnsavedEditDialog();
    },
    cancel() {
      this.$store.getModule("messages").cancelUnsavedEditDialog();
    },
  },
};
</script>
