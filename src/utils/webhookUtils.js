import CryptoJS from "crypto-js";

const MOCK_SECRET = "test_secret_123";

// Helper function for constant-time comparison
function constantTimeCompare(a, b) {
  const aBuf = typeof a === "string" ? CryptoJS.enc.Hex.parse(a) : a;
  const bBuf = typeof b === "string" ? CryptoJS.enc.Hex.parse(b) : b;

  if (aBuf.sigBytes !== bBuf.sigBytes) {
    return false;
  }

  let result = 0;
  const words = aBuf.words;
  const otherWords = bBuf.words;

  // Compare each word (4 bytes at a time)
  for (let i = 0; i < words.length; i++) {
    result |= words[i] ^ otherWords[i];
  }

  return result === 0;
}

export const createSignature = (secret, payload) => {
  const hmac = CryptoJS.HmacSHA256(
    JSON.stringify(payload),
    secret || MOCK_SECRET
  );
  return `sha256=${hmac.toString(CryptoJS.enc.Hex)}`;
};

export const verifySignature = (signature, payload, secret = MOCK_SECRET) => {
  if (!signature || typeof signature !== "string") {
    return false;
  }

  const expectedSig = createSignature(secret, payload);

  const receivedHash = signature.startsWith("sha256=")
    ? signature.substring(7)
    : signature;
  const expectedHash = expectedSig.substring(7);

  return constantTimeCompare(receivedHash, expectedHash);
};

export const mockVerifySignature = (
  signature,
  payload,
  secret = MOCK_SECRET
) => {
  return verifySignature(signature, payload, secret);
};
