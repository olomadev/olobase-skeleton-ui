<template>
  <va-edit-layout :title="title">
    <roles-form :id="id" :item="item"></roles-form>
  </va-edit-layout>
</template>

<script>
export default {
  props: ["id", "title", "item"],
};
</script>
