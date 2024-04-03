<template>
  <v-row>
    <v-col cols="6">
      <v-card 
        class="mt-2 mb-5" 
        variant="flat" 
        style="background-color: #fff"
      >
        <v-card-text>
          <div class="h1 mb-4">
            {{ $t("resources.swagger.rest_api") }}
          </div>
          <v-btn
            block
            color="primary"
            href="https://demo.oloma.dev/swagger/web/" target="_blank"
            prepend-icon="mdi-open-in-new"
            variant="flat"
          >
            {{ $t("resources.swagger.open_docs") }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


