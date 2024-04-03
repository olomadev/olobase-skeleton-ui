<template>
  <div>
    <v-card variant="flat">
      <v-card-text>
        <v-row no-gutters>
          <v-col lg="6" md="6" sm="4">
            <va-auto-complete-input
              source="employees"
              resource="employees"
              reference="employees"
              variant="outlined"
              multiple
            >
            </va-auto-complete-input>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col lg="6" md="6" sm="4">
             <div class="va-show">
              <v-table
                fixed-header
                density="compact"
              >
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ $t('resources.employees.fields.name') }}
                    </th>
                    <th class="text-left">
                      {{ $t('resources.employees.fields.surname') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in demoEmployees"
                    :key="item.name"
                  >
                    <td>{{ item.name }}</td>
                    <td>{{ item.surname }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-col>
        </v-row>
        
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
    <va-auto-complete-input
      source="employees"
      resource="employees"
      reference="employees"
      variant="outlined"
      multiple
    >
    </va-auto-complete-input>
  </div>
</template>`;
  },
  data() {
    return {
      tab: null,
      template: null,
      demoEmployees: [
        { name: "James", surname: "Brown" },
        { name: "Suzanne", surname: "M. Derr" },
        { name: "Kenneth", surname: "Williamson" },
        { name: "Alice", surname: "Brown" },
        { name: "Karen", surname: "K. Barrett" },
        { name: "Maria", surname: "Brown" },
      ]
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

