<template>
  <va-edit-layout :title="title">
    <accounts-users-form :id="id" :item="item"></accounts-users-form>
  </va-edit-layout>
</template>

<script>
export default {
  props: ["id", "title", "item"],
};
</script>
