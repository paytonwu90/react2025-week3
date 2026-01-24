function setCookieToken(token, expired) {
  document.cookie = `hexToken=${token};expires=${new Date(expired).toUTCString()}`;
}

function getCookieToken() {
  return document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
}

export {
  setCookieToken,
  getCookieToken,
};