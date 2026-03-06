<script setup lang="ts">
import { boolean, looseObject, optional, parse, parseJson, pipe, string, transform } from 'valibot';
import { onMounted, ref } from 'vue';

import guests from './guests.json' with { type: 'json' };
import { decryptAES256 } from './utils/decryptAES256';
import { hexToBuffer } from './utils/hexToBuffer';

const userId = '690143';

const isLoading = ref(true);
const guest = ref<{
  name: string;
  location: string;
  date: Date;
  plusOne?: boolean;
  groupChatInviteLink: string;
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
            date: pipe(string(), transform(v => new Date(v))),
            plusOne: optional(boolean()),
            groupChatInviteLink: string(),
          }),
        ),
        await decryptAES256(hexToBuffer(data + authTag), hashBuffer, hexToBuffer(iv)),
      );
      break;
    } catch {
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
    {{ guest.location }} / {{ guest.date }}
  </template>
</template>

<style scoped></style>
