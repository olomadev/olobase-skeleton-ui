<template>  
  <div v-for="field in getFields"> 
    <component
      :key="getKey(field)"
      :is="`va-select-input`"
      :source="field.source"
      :filter="getComputedFilters(field)"
      :modelValue="form[field.source]"
      @update:modelValue="form[field.source] = $event"
      v-bind="field.attributes"
      :label="field.label"
      variant="outlined"
      clearable
      class="mt-6"
    ></component>
  </div>
</template>

<script>
export default {
  inject: ['admin'],
  data() {
    return {
      form: {
        companyId: { id: "ebf6b935-5bd8-46c1-877b-9c758073f278", name: "Demo Company 1" },  
        departmentId: null,
      },
      fields: [
        {
          source: "companyId",
          label: "Company",
          type: "select",
          attributes: {
            reference: "companies",
          },
          sortable: true,
          width: "15%",
        },
        {
          source: "departmentId",
          label: "Department",
          type: "select",
          attributes: {
            reference: "departments",
          },
          key: "companyId",
          filters: ["companyId"],
          sortable: true,
          width: "15%",
        }
      ],
    };
  },
  created() {

  },
  computed: {
    getFields() {
      return this.fields;
    },
  },
  methods: {
    getKey(field) {
      if (Object.prototype.hasOwnProperty.call(field, "key")) {
        return this.form[field.key];
      }
      return field.source;
    },
    getComputedFilters(field) {
      let filterObject = {};
      if (field.source == "departmentId") {
        filterObject = { companyId: this.form.companyId.id }
      }
      console.error(filterObject);
      return filterObject;
    },
  },
};
</script>
