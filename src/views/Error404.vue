<template>
  <div class="d-flex align-center justify-center fill-height">
    <v-row>
      <v-col cols="12">
      <v-card flat>
        <v-container fluid>
          <div class="h1 text-center">
            404
          </div>
          <div class="h3 text-center">
            {{ $t("error.404") }}
          </div>
        </v-container>
      </v-card>
    </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["error"],
};
</script>
