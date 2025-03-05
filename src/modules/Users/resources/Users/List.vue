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
    >
    </va-data-table-server>
  </va-list>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [
        { source: "firstname", col: 2 },
        { source: "lastname" },
        { source: "email" },
        { source: "createdAt", type: "date" },
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
          source: "active",
          sortable: true,
        },
      ],
    };
  }
};
</script>
