import CryptoJS from "crypto-js";

const MOCK_SECRET = "test_secret_123";

// Helper function for constant-time comparison
function constantTimeCompare(a, b) {
  try {
    const aBuf = typeof a === "string" ? CryptoJS.enc.Hex.parse(a) : a;
    const bBuf = typeof b === "string" ? CryptoJS.enc.Hex.parse(b) : b;

    // Fail-fast if lengths differ
    if (aBuf.sigBytes !== bBuf.sigBytes) return false;

    let result = 0;
    const minWords = Math.min(aBuf.words.length, bBuf.words.length);

    // Compare all words (4-byte chunks)
    for (let i = 0; i < minWords; i++) {
      result |= aBuf.words[i] ^ bBuf.words[i];
    }

    // Compare remaining bytes if any
    if (aBuf.sigBytes % 4 !== 0) {
      const remainingBytes = aBuf.sigBytes % 4;
      const aRemaining = aBuf
        .toString(CryptoJS.enc.Hex)
        .slice(-remainingBytes * 2);
      const bRemaining = bBuf
        .toString(CryptoJS.enc.Hex)
        .slice(-remainingBytes * 2);
      result |= parseInt(aRemaining, 16) ^ parseInt(bRemaining, 16);
    }

    return result === 0;
  } catch (e) {
    return false; // Fail securely on parsing errors
  }
}

export const createSignature = (secret, payload) => {
  const hmac = CryptoJS.HmacSHA256(
    JSON.stringify(payload),
    secret || MOCK_SECRET
  );
  return `sha256=${hmac.toString(CryptoJS.enc.Hex)}`;
};

export const verifySignature = (signature, payload, secret = MOCK_SECRET) => {
  if (typeof signature !== "string" || !signature) return false;

  try {
    const expectedSig = createSignature(secret, payload);
    const receivedHash = signature.startsWith("sha256=")
      ? signature.substring(7)
      : signature;
    const expectedHash = expectedSig.substring(7);

    return constantTimeCompare(receivedHash, expectedHash);
  } catch (e) {
    return false;
  }
};

export const mockVerifySignature = (
  signature,
  payload,
  secret = MOCK_SECRET
) => {
  return verifySignature(signature, payload, secret);
};
