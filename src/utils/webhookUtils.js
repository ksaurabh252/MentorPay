import CryptoJS from "crypto-js";

export const createSignature = (secret, payload) => {
  const hmac = CryptoJS.HmacSHA256(JSON.stringify(payload), secret);
  return `sha256=${hmac.toString(CryptoJS.enc.Hex)}`;
};

export const verifySignature = (secret, payload, signature) => {
  const expectedSig = createSignature(secret, payload);
  return CryptoJS.timingSafeEqual(
    CryptoJS.enc.Hex.parse(expectedSig),
    CryptoJS.enc.Hex.parse(signature)
  );
};
