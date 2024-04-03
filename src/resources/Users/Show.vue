<template>
  <va-show-layout 
    :title="title"
    :show-list="false"
    :show-edit="false"
    :show-clone="false"
    :show-delete="false"
  >
    <va-show :item="item">
      <v-row>
        <v-col lg="4" md="6" sm="12">
          <div class="va-show">
            <v-table density="compact">
              <tbody>
                <tr>
                  <td><b>{{ $t('resources.users.fields.firstname') }}</b></td>
                  <td>
                    <va-field source="firstname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.lastname') }}</b></td>
                  <td>
                    <va-field source="lastname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.email') }}</b></td>
                  <td>
                    <va-field source="email"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.active') }}</b></td>
                  <td>
                    <va-field source="active" type="boolean"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.createdAt') }}</b></td>
                  <td>
                    <va-field source="createdAt" type="date"></va-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-col>
      </v-row>
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

</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["title", "item"],
  inheritAttrs: false, // https://stackoverflow.com/questions/72246939/extraneous-non-props-attributes-title-were-passed-to-component-but-could-not-b
  mixins: [Clipboard],
  created() {
    this.template = `<template>
  <va-show-layout :title="title">
    <va-show :item="item">
      <v-row>
        <v-col cols="4">
          <div class="va-show">
            <v-table density="compact">
              <tbody>
                <tr>
                  <td><b>{{ $t('resources.users.fields.firstname') }}</b></td>
                  <td>
                    <va-field source="firstname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.lastname') }}</b></td>
                  <td>
                    <va-field source="lastname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.email') }}</b></td>
                  <td>
                    <va-field source="email"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.active') }}</b></td>
                  <td>
                    <va-field source="active" type="boolean"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('resources.users.fields.createdAt') }}</b></td>
                  <td>
                    <va-field source="createdAt" type="date"></va-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-col>
      </v-row>
    </va-show>
  </va-show-layout>
</template>`;

this.script = `\<script\>
export default {
  props: ["title", "item"],
}
\</script\>`;
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
    }
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
