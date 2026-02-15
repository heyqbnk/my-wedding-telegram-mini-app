export async function decryptAES256(
  encryptedData: BufferSource,
  key: BufferSource,
  iv: BufferSource
) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )

  return new TextDecoder().decode(
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, encryptedData),
  );
}
