
# 3x Changes

- Added modules structure.
- Deprecated olobase admin title option.
- Deprecated layouts/Breadcrumbs.vue.
- Deprecated SheetInput.vue removed 
- Deprecated ExcelExportButton.vue removed 
- SheetInput removed from components/index.js
- Removed Breadcrumbs from layouts/index.js file.
- Added groupByArray prop to CheckListInput component.


groupByArray: {
  type: Array,
  default:() => [
    {
      key: 'module',
      order: 'asc',
    }
  ]
}

- Mixins: choices.js changes: Getting input refrerence from i18n enums changed as:  "{module}_{action}"   e.g. "authorization_methods", "common_locales".
- Added no data available translation to CheckListInput component for search operations.
- rEMOVEcomponents()