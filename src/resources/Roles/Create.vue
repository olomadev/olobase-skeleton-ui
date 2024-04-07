<template>
  <va-create-layout :title="title">
    <roles-form :item="item"></roles-form>
  </va-create-layout>
</template>

<script>
export default {
  props: ["title", "item"],
};
</script>

