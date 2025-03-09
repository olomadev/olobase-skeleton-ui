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
          source: "roles",
          sortable: true,
        },
      ],
    };
  }
};
</script>
