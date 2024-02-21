<template>
  <span>{{ parsedDate }}</span>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed } from 'vue';

const { sharedContext } = useToolkit();

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const parsedDate = computed(() => {
  const formatter = new Intl.DateTimeFormat(sharedContext?.timezoneInfo?.region.replace('_', '-'), {
    timeZone: sharedContext?.timezoneInfo?.timezone,
    hourCycle: sharedContext?.timezoneInfo?.time_24h ? 'h23' : 'h12',
    timeStyle: 'short',
    dateStyle: 'short',
  });

  return formatter.format(new Date(props.date));
});
</script>
