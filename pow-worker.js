// The browser half of the people-check: finds a number that makes a hash start with enough zero bits.
const enc = new TextEncoder()
const zeros = (b) => { let n = 0; for (const x of b) { if (x === 0) { n += 8; continue } n += Math.clz32(x) - 24; break } return n }
onmessage = async (e) => {
  const { salt, bits } = e.data, BATCH = 256
  for (let start = 0; ; start += BATCH) {
    const hashes = await Promise.all(Array.from({ length: BATCH }, (_, i) => crypto.subtle.digest("SHA-256", enc.encode(salt + ":" + (start + i)))))
    for (let i = 0; i < BATCH; i++) if (zeros(new Uint8Array(hashes[i])) >= bits) { postMessage(start + i); return }
  }
}
