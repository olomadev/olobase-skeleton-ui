<template>
  <div>
    <va-breadcrumbs />

    <v-tabs
      class="mt-3"
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">Template</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-html">{{ template }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  mixins: [Clipboard],
  created() {
    this.template = `<template>
  <div>
    <va-breadcrumbs />
  </div>
</template>`;
  },
  data() {
    return {
      tab: null,
      template: null,
    };
  },
  watch: {
    tab(value) {
      if (value == 1) {
        Prism.highlightAll(); // highlight code
      }   
    }
  }
};
</script>


