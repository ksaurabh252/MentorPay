import CryptoJS from "crypto-js";

// Mock secret key (store in localStorage for persistence)
const MOCK_SECRET = "test_secret_123";

export const createSignature = (secret, payload) => {
  const hmac = CryptoJS.HmacSHA256(
    JSON.stringify(payload),
    secret || MOCK_SECRET
  );
  return `sha256=${hmac.toString(CryptoJS.enc.Hex)}`;
};

export const verifySignature = (signature, payload, secret = MOCK_SECRET) => {
  const expectedSig = createSignature(secret, payload);
  return CryptoJS.timingSafeEqual(
    CryptoJS.enc.Hex.parse(expectedSig),
    CryptoJS.enc.Hex.parse(signature)
  );
};
