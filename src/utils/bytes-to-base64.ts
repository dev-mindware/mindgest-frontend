const CHUNK_SIZE = 0x8000;

/**
 * Converte bytes em base64 por blocos, para não estourar a pilha com
 * `String.fromCharCode(...bytes)` em arrays grandes.
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + CHUNK_SIZE);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}
