<template>
  <div>
    <va-show-layout
      :showList="false"
      :showClone="false"
      :showEdit="false"
      :showDelete="false"
    >
      <va-show :item="item">
        <v-tabs v-model="tabs">
          <v-tab value="1">Tab 1</v-tab>
          <v-tab value="2">Tab 2</v-tab>
          <v-tab value="3">Tab 3</v-tab>
        </v-tabs>
        <v-window v-model="tabs">
          <v-window-item value="1">
            <v-card>
              <v-card-text>
                Tab content 1
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="2">
            <v-card>
              <v-card-text>
                Tab content 2
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="3">
            <v-card>
              <v-card-text>
                Tab content 3
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </va-show>
    </va-show-layout>

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
  props: ["id", "item"],
  mixins: [Clipboard],
  created() {
    this.template = `<template>
  <div>
    <va-show-layout
      :showList="false"
      :showClone="false"
      :showEdit="false"
      :showDelete="false"
    >
      <va-show :item="item">
        <v-tabs v-model="tabs">
          <v-tab value="1">Tab 1</v-tab>
          <v-tab value="2">Tab 2</v-tab>
          <v-tab value="3">Tab 3</v-tab>
        </v-tabs>
        <v-window v-model="tabs">
          <v-window-item value="1">
            <v-card>
              <v-card-text>
                Tab content 1
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="2">
            <v-card>
              <v-card-text>
                Tab content 2
              </v-card-text>
            </v-card>
          </v-window-item>
          <v-window-item value="3">
            <v-card>
              <v-card-text>
                Tab content 3
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </va-show>
    </va-show-layout>
  </div>
</template>`;

this.script = `\<script\>
export default {
  props: ["id", "item"],
}
\</script\>`;
  },
  data() {
    return {
      tab: null,
      tabs: null,
      template: null,
      script: null,
    };
  },
  watch: {
    tab(value) {
      if (value == 1) {
        Prism.highlightAll(); // highlight code
      }   
      if (value == 2) {
        Prism.highlightAll(); // highlight code
      }   
    }
  }
};
</script>


