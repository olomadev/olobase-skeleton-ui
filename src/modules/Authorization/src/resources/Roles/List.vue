<template>
  <va-list 
  :fields="fields"
  :filters="filters"
  >
    <va-data-table-server 
      disable-show
      :disable-actions="false"
    >
    </va-data-table-server>
  </va-list>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [],
      fields: [
        {
          source: "roleName",
          sortable: true,
        },
        {
          source: "roleKey",
          sortable: true,
        },
        {
          source: "roleLevel",
          sortable: true,
        },
      ],
    };
  }
};
</script>
