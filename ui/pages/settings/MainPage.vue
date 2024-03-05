<template>
  <div
    class="app"
  >
    <upload-schedule-card />
    <credentials-card />
  </div>
</template>

<script setup>
import CredentialsCard from '~/components/CredentialsCard.vue';
import UploadScheduleCard from '~/components/UploadScheduleCard.vue';
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
}
</style>