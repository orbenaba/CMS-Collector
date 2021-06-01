module.exports = {
    R_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,25})/,
    R_USERNAME: /^([a-zA-Z0-9_]{6,20})$/,
    R_EMAIL: /\S{2,20}@\S{2,20}\.\S{2,7}/
}