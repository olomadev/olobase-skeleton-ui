<template>
  <va-list 
    :filters="filters"
    :fields="fields"
    hide-bulk-copy
    :disable-global-search="false"
  >
    <va-data-table-server
      :disable-actions="false"
      :disable-show="false"
      show-select
    >
      <template v-slot:[`field.userRoles`]="{ item }">
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            size="small"
            v-for="(role, index) in item.userRoles"
            :key="index"
            label
            color="primary"
          >
            <v-icon icon="mdi-label" start></v-icon>
            {{ role.name }}
          </v-chip>
        </div>
      </template>
    </va-data-table-server>
  </va-list>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [
        { 
          source: "userRoles",
          type: "select",
          attributes: { 
            reference: "authorization_roles",
            multiple: true,
          }
        },
        { source: "createdAtStart", type: "date" },
        { source: "createdAtEnd", type: "date" },
        { source: "active", type: "boolean" },
      ],
      fields: [
        {
          source: "firstname",
          sortable: true,
        },
        {
          source: "lastname",
          sortable: true,
        },
        {
          source: "email",
          sortable: true,
        },
        {
          source: "userRoles",
          sortable: true,
        },
        {
          source: "createdAt",
          type: "date",
          sortable: true,
        },
        {
          source: "active",
          sortable: true,
        },
      ],
    };
  }
};
</script>
