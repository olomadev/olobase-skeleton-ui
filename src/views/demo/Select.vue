<template>
  <div>
    <v-card variant="flat">
      <v-card-text>
      <v-row no-gutters>
        <v-col lg="3" md="4" sm="6">
          <va-select-input
            :label="$t('demo.grades')"
            clearable
            multiple
            reference="employee-grades"
            v-model="model.grades"
          >
          </va-select-input>
        </v-col>
      </v-row>
        {{ model.grades }}
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
    this.template = `\<template\>
  <div>
    <v-card variant="flat">
      <v-card-text>
        <va-select-input
          :label="$t('demo.grades')"
          reference="grades"
          v-model="model.grades"
        >
        </va-select-input>
      </v-card-text>
    </v-card>
  </div>
\</template\>`;
  
  this.script = `\<script\>
export default {
  data() {
    return {
      model: {
        rating: 1,
      }
    };
  }
};
\</script\>`;
  },
  data() {
    return {
      tab: null,
      model: {
        grades: [{ id: "4f11cb32-9428-42a2-9509-be2c01c9f86e", name: "Grade 1" }],
      },
      template: null,
      script: null,
    };
  },
  watch: {
    tab(value) {
      if (value > 0) {
        Prism.highlightAll(); // highlight code
      }   
    }
  }
};
</script>


