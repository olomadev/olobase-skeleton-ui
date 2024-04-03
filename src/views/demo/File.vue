<template>
  <div>
    <v-card variant="flat">
      <v-card-text>
      <v-row no-gutters>
        <v-col lg="3" md="4" sm="6">
          <va-file-input
            :label="$t('demo.file')"
            v-model="model.file"
          ></va-file-input>
        </v-col>
      </v-row>

      {{ model.file }}

      </v-card-text>
    </v-card>

    <v-tabs
      class="mt-3"
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">Template</v-tab>
      <v-tab value="2">Script</v-tab>
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

      <v-window-item eager value="2">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-js">{{ script }}</code></pre>
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
    <v-card variant="flat">
      <v-card-text>
        <va-file-input
          :label="$t('demo.file')"
          v-model="model.file"
        ></va-file-input>
      </v-card-text>
    </v-card>
  </div>
</template>`;

  this.script = `\<script\>
export default {
  data() {
    return {
      model: {
        file: null
      },
    };
  }
};
\</script\>`;
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
      model: {
        file: null
      },
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

