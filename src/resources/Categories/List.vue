<template>
  <va-list 
    disable-fetch
    disable-create
    disable-filters
    hide-bulk-copy
    @refresh="refresh()"
  >
    <va-category-tree
      :key="key"
      open-all
      @save="saveNode"
      @delete="deleteNode"
    >
    </va-category-tree>
    <v-row class="mt-2">
      <v-col>
        <va-text-input
          source="name"
          v-model="name"
          variant="outlined"
          clearable
          :error-messages="nameErrors"
        ></va-text-input>   
      </v-col>
      <v-col>
        <va-select-input
          source="parentId"
          v-model="parentId"
          reference="categories"
          variant="outlined"
          clearable
          :error-messages="parentIdErrors"
        ></va-select-input> 
      </v-col>
      <v-col>
        <v-btn 
          color="primary"
          style="margin-top:2px;"
          variant="outlined" 
          @click="addNode()">
          {{ $t("va.actions.add") }}
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

export default {
  props: ["resource", "title"],
  mixins: [Utils],
  setup() {
    provide('v$', useVuelidate() )
    return { v$: useVuelidate() }
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
      this.key = this.key + 1;
    },
    deleteNode(item) {
      const Self = this;
      this.$admin.http({ method: "DELETE", url: "/categories/delete/" + item.id }).then(async function(response) {
        if (response && response.status == 200) {
          Self.key = Self.key + 1;
          Self.$admin.refresh();
        }
      });
    },
    saveNode(item) {
      const Self = this;
      let data = {
        name: item.title,
        parentId: item.parentId,
        lft: item.lft,
        rgt: item.rgt,
        move: item.move
      };
      this.$admin.http({ method: "PUT", url: "/categories/update/" + item.id, data: data }).then(async function(response) {
        if (response && response.status == 200) {
          Self.key = Self.key + 1;
          Self.$admin.refresh();
        }
      });
    },
    addNode() {
      const Self = this;
      this.v$.name.$touch();
      this.v$.parentId.$touch();
      if (this.v$.name.$invalid || this.v$.parentId.$invalid) {
        return false;
      }
      let data = {
        id: this.generateUid(),
        name: this.name,
        parentId: this.parentId.id,
        lft: this.parentId.lft,
        rgt: this.parentId.rgt,
      };
      this.$admin.http({ method: "POST", url: "/categories/create", data: data }).then(async function(response) {
        if (response && response.status == 200) {
          Self.key = Self.key + 1;
          Self.$admin.refresh();
        }
      });
    }
  }
};
</script>

