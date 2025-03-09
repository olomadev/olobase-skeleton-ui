<template>
  <va-edit-layout :title="title">
    <authorization-roles-form :id="id" :item="item"></authorization-roles-form>
  </va-edit-layout>
</template>

<script>
export default {
  props: ["id", "title", "item"],
};
</script>
