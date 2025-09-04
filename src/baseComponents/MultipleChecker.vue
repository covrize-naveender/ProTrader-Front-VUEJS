<template>
  <div class="checker-container">
    <a href="/" @click.prevent="$emit('selectAll')">Select all</a>
    <a href="/" @click.prevent="$emit('clearAll')">Clear All</a>
  </div>
</template>

<script>
export default {
  name: 'MultipleChecker'
}
</script>

<style scoped>
.checker-container {
  display: flex;
  justify-content: flex-end;
}
.checker-container a {
  text-decoration: none;
  color: #e72510;
  display: inline-block;
  padding: 0 0.8rem;
  cursor: pointer;
}
</style>