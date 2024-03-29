module.exports = {
  R_PASSWORD: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,25}",
  R_USERNAME: "[a-zA-Z0-9_]{6,20}",
  R_EMAIL: "\\S{2,20}@\\S{2,20}\\.\\S{2,7}",
  R_IP: "((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))",
  R_DOMAIN: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
};
