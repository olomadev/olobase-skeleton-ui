<template>
  <va-create-layout :title="title">
    <accounts-users-form :item="item"></accounts-users-form>
  </va-create-layout>
</template>

<script>
export default {
  props: ["title", "item"],
}
</script>
