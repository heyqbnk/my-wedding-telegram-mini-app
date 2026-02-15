export function hexToBuffer(hex: string) {
  const bytes = hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16));
  return new Uint8Array(bytes);
}
