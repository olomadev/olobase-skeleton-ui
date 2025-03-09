<template>
  <va-create-layout :title="title">
    <authorization-roles-form :item="item"></authorization-roles-form>
  </va-create-layout>
</template>

<script>
export default {
  props: ["title", "item"],
};
</script>

