
# 3x Changes

- Added modules structure.
- Deprecated olobase admin title option.
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


- Deprecated getting input refrerence from i18n enums.
- Added no data available translation to CheckListInput component for search operations.