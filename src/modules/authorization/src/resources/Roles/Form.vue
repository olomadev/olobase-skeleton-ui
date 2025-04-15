<template>
  <va-form 
    :id="id" 
    :item="item" 
    v-model="model"
  >
    <v-row no-gutters>
      <v-col sm="3">
        <va-text-input
          source="roleKey"
          :error-messages="roleKeyErrors"
          variant="outlined"
        ></va-text-input>

        <va-text-input
          source="roleName"
          :error-messages="roleNameErrors"
          variant="outlined"
        ></va-text-input>

        <va-text-input
          source="roleLevel"
          :error-messages="roleLevelErrors"
          variant="outlined"
        ></va-text-input>
      </v-col>
    </v-row>

    <v-tabs
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">{{ $t("authorization.roles.tabs.permissions.label") }}</v-tab>
      <v-tab value="2" v-if="action == 'edit'">{{ $t("authorization.roles.tabs.users.label") }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-row class="mt-2">
          <v-col cols="12" sm="12" md="12" lg="6">
            <va-check-list-input
              variant="outlined"
              source="rolePermissions"
              group-by="module"
              init-url="/authorization/permissions/findAll"
              :headers="headers"
              :fields="fields"
              primary-key="permId"
              items-per-page="25"
              :group-header="$t('authorization.roles.fields.module')"
            >
            </va-check-list-input>
          </v-col>
        </v-row>
      </v-window-item>

      <v-window-item eager value="2" v-if="action == 'edit'">
        <v-row class="mt-2">
          <v-col cols="12" sm="12" md="12" lg="6">
            <v-data-table :density="getDensity" v-if="tab == 2" :items="model.roleUsers" :headers="usersHeaders">
              <template v-slot:top>
                <v-row>
                  <v-col class="d-flex justify-end">
                    <v-btn color="primary" @click="showAddUserDialog = true" icon>
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn icon variant="text" @click="removeUser(item.id)">
                  <v-icon size="xsmall">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <va-save-button></va-save-button>
  </va-form>

  <v-dialog v-model="showAddUserDialog" max-width="600px">
    <v-card>
      <v-card-title>{{ $t('authorization.roles.tabs.users.dialog.title') }}</v-card-title>
      <v-card-text>
        <v-data-table-server
          :density="getDensity"
          v-model:items-per-page="itemsPerPage"
          :headers="usersHeaders"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="q"
          item-value="name"
          @update:options="loadUsers"
        >
          <template v-slot:item.action="{ item }">
            <v-btn icon variant="text" color="primary" @click="addUser(item)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>        
          <template v-slot:top>
            <v-text-field 
              density="compact"
              variant="outlined" 
              append-inner-icon="mdi-magnify"
              v-model="q" 
              class="mt-2" 
              color="primary"
              :label="$t('i18n.actions.q')"
              hide-details
              clearable
            >
            </v-text-field>
          </template>
        </v-data-table-server>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="showAddUserDialog = false">Kapat</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import config from '@/@config'
import { provide } from 'vue'

export default {
  props: ["id", "item"],
  mixins: [utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      q: null,
      tab: null,
      action: "edit",
      serverItems: [],
      totalItems: 0,
      loadingUsers: false,
      loadingRoleUsers: false,
      search: null,
      showAddUserDialog: false,
      itemsPerPage: 10,
      model: {
        id: null,
        roleKey: null,
        roleName: null,
        roleLevel: null,
        rolePermissions: null,
        roleUsers: [],
      },
      fields: [
        { source: "module" },
        { source: "name" },
        { source: "action" },
        { source: "route" },
        { source: "method"},
      ],
      usersHeaders: [
        { value: 'firstname' },
        { value: 'lastname' },
        { value: 'email' },
        { value: 'action', sortable: false }
      ],
    };
  },
  validations() {
    return {
      model: {
        roleKey: {
          required,
          maxLength: maxLength(60),
        },
        roleName: {
          required,
          maxLength: maxLength(100),
        },
        roleLevel: {
          required,
          numeric,
          maxLength: maxLength(2),
        },
      },
    }
  },
  computed: {
    getDensity() {
      return config.density;
    },
    headers() {
      return [
        {
          key: "module",
          sortable: false,
        },
        {
          key: "name",
          sortable: false,
        },
        {
          key: "action",
          sortable: false,
        },
        {
          key: "route",
          sortable: false,
        },
        {
          key: "method",
          sortable: false,
        },
      ];
    },   
    roleKeyErrors() {
      const errors = [];
      const field = "roleKey";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    roleNameErrors() {
      const errors = [];
      const field = "roleName";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "100" }));
      return errors;
    },
    roleLevelErrors() {
      const errors = [];
      const field = "roleLevel";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].numeric.$invalid &&
        errors.push(this.$t("v.number.numeric"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "2" }));
      return errors;
    },
  },
  created() {
    this.model.id = this.generateId(this);
    this.action = this.$route.name.split('_').pop();
    if (this.item) {
      this.model.roleUsers = this.item.roleUsers;
    }
  },
  watch: {
    tab(val) {
      (async () => {
        if (val == 2) {
          await this.loadRoleUsers({ page: 1, itemsPerPage: this.itemsPerPage, search: { q: this.q } });
        }
      })();
    },
    q(val) {
      this.q = val;
    }
  },
  methods: {
    async loadUsers ({ page, itemsPerPage, sortBy }) {
      this.loadingUsers = "primary";
      this.fetchAllUsers({ page, itemsPerPage, sortBy, search: { q: this.q } }).then(({ items, total }) => {
        this.serverItems = items
        this.totalItems = total
        this.loadingUsers = false
      })
    },
    async loadRoleUsers ({ page, itemsPerPage, sortBy }) {
      this.loadingRoleUsers = "primary";
      this.fetchRoleUsers({ page, itemsPerPage, sortBy, search: { q: this.q } }).then(({ items, total }) => {
        this.model.roleUsers = items
        this.loadingRoleUsers = false
      })
    },
    async fetchRoleUsers ({ page, itemsPerPage, sortBy, search }) {
      let response = null;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      if (! search.q) {
        response = await this.$admin.http.get('/authorization/userRoles/findAllByPaging/' + this.model.id);
      } else {
        response = await this.$admin.http.get('/authorization/userRoles/findAllByPaging/' + this.model.id + '?q=' + search.q);
      }
      const items = response?.data?.data;
      if (sortBy && sortBy.length) {
        const sortKey = sortBy[0].key
        const sortOrder = sortBy[0].order
        items.sort((a, b) => {
          const aValue = a[sortKey]
          const bValue = b[sortKey]
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
        })
      }
      const paginated = items.slice(start, end === -1 ? undefined : end);
      return { items: paginated, total: items.length }
    },
    async fetchAllUsers ({ page, itemsPerPage, sortBy, search }) {
      let response = null;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      if (! search.q) {
        response = await this.$admin.http.get('/users/findAllByPaging');
      } else {
        response = await this.$admin.http.get('/users/findAllByPaging?q=' + search.q);
      }
      const items = response?.data?.data;
      if (sortBy && sortBy.length) {
        const sortKey = sortBy[0].key
        const sortOrder = sortBy[0].order
        items.sort((a, b) => {
          const aValue = a[sortKey]
          const bValue = b[sortKey]
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
        })
      }
      const paginated = items.slice(start, end === -1 ? undefined : end);
      return { items: paginated, total: items.length }
    },
    async addUser(user) {
      const alreadyExists = this.model.roleUsers.some(roleUser => roleUser.id === user.id);
      if (alreadyExists) {
        this.$admin.message('info', this.$t("authorization.roles.messages.userAlreadyAssigned"));
        return;
      }
      const data = { userId: user.id, roleId: this.model.id };
      await this.$admin.http({ method: "PUT", url: '/authorization/userRoles/assign', data: data });
      this.loadRoleUsers({ page: 1, itemsPerPage: this.itemsPerPage, search: { q: this.q } });
    },    
    async removeUser(userId) {
      const data = { userId: userId, roleId: this.model.id };
      await this.$admin.http({ method: "PUT", url: '/authorization/userRoles/unassign', data: data });
      this.loadRoleUsers({ page: 1, itemsPerPage: this.itemsPerPage, search: { q: this.q } })
    }
  }

}
</script>
