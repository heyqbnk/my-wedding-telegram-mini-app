<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { looseObject, parse, parseJson, pipe, string,  } from 'valibot';

import { decryptAES256 } from './utils/decryptAES256';
import { hexToBuffer } from './utils/hexToBuffer';

import guests from './guests.json' with { type: 'json' };

const userId = '690143';

const isLoading = ref(true);
const guest = ref<{
  name: string;
  location: string;
  time: string;
}>();

onMounted(async () => {
  const data = new TextEncoder().encode(userId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  for (let i = 0; i < guests.length; i++) {
    try {
      const [iv, authTag, data] = guests[i]!.split(':') as [string, string, string];
      guest.value = parse(
        pipe(
          string(),
          parseJson(),
          looseObject({
            name: string(),
            location: string(),
            time: string(),
          })
        ),
        await decryptAES256(
          hexToBuffer(data + authTag),
          hashBuffer,
          hexToBuffer(iv),
        )
      );
      break;
    } catch (e) {
    }
  }
  isLoading.value = false;
});
</script>

<template>
  <template v-if="guest">
    <h1>
      {{ guest.name }}
    </h1>
    {{ guest.location }} / {{ guest.time }}
  </template>
</template>

<style scoped></style>
