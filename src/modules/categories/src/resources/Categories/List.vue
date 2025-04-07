<template>
  <va-list 
    disable-fetch
    disable-create
    disable-filters
    hide-bulk-copy
    @refresh="refresh()"
  >
    <va-category-tree url="/categories/findAllByPaging" :key="key" open-all @save="saveNode" @delete="deleteNode" />
    <v-row no-gutters class="mt-2">
      <v-col cols="12" lg="2" md="3" sm="6">
        <va-text-input
          source="name"
          v-model="name"
          variant="outlined"
          clearable
          :error-messages="nameErrors"
        ></va-text-input>   
      </v-col>
      <v-col cols="12" lg="2" md="3" sm="6" :class="smAndDown ? '' : 'ml-2'">
        <va-select-input
          :key="key"
          source="parentId"
          v-model="parentId"
          reference="categories"
          variant="outlined"
          clearable
          :error-messages="parentIdErrors"
        ></va-select-input> 
      </v-col>
      <v-col cols="12" lg="2" md="3" sm="6" :class="smAndDown ? '' : 'ml-2'">
        <v-btn 
          color="primary"
          style="margin-top:2px;"
          variant="outlined" 
          @click="addNode()">
          {{ $t("i18n.actions.add") }}
        </v-btn>
      </v-col>
    </v-row>
  </va-list>
</template>

<script>
import { provide } from 'vue';
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Utils from "olobase-admin/src/mixins/utils";
import { useDisplay } from 'vuetify';

export default {
  props: ["resource", "title"],
  mixins: [Utils],
  setup() {
    const { smAndDown } = useDisplay();
    provide('v$', useVuelidate() )
    return { v$: useVuelidate(), smAndDown }
  },
  data() {
    return {
      key: 0,
      name: null,
      parentId: null,
    };
  },
  validations() {
    return {
      name: {
        required
      },   
      parentId: {
        required
      }
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.v$.name.$dirty) return errors;
      this.v$.name.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    parentIdErrors() {
      const errors = [];
      if (!this.v$.parentId.$dirty) return errors;
      this.v$.parentId.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    }
  },
  methods: {
    refresh() {
      ++this.key;
    },
    async deleteNode(item) {
      await this.$admin.http({ method: "DELETE", url: "/categories/delete/" + item.id }).then((response) => {
        if (response && response.status === 200) {
          ++this.key;
          this.$admin.refresh();
        }
      });
    },
    async saveNode(item) {
      const data = { name: item.name, parentId: item.parentId, lft: item.lft, rgt: item.rgt, move: item.move };
      await this.$admin.http({ method: "PUT", url: "/categories/update/" + item.id, data: data }).then((response) => {
        if (response && response.status === 200) {
          ++this.key;
        }
      });
    },
    async addNode() {
      this.v$.name.$touch();
      this.v$.parentId.$touch();
      if (this.v$.name.$invalid || this.v$.parentId.$invalid) {
        return false;
      }
      const data = { id: this.generateUid(), name: this.name, parentId: this.parentId.id, lft: this.parentId.lft, rgt: this.parentId.rgt };
      await this.$admin.http({ method: "POST", url: "/categories/create", data: data }).then((response) => {
        if (response && response.status === 200) {
          ++this.key;
        }
      });
    }
  }
};
</script>