/**
 * Similar Tech offers a free API which is very suit to our project requirements.
 * Its API only takes a URL/DOMAIN as a parameter
 */
// Node Modules
const axios = require("axios");
const config = require("config");

const API_KEY = config.get("API_KEYS.SIMILAR_TECH");


// The domain already been validated in the middleware :)
async function scanDomain(domain) {
    try {
        const requestFormatted = `https://api.similartech.com/v1/site/${domain}/technologies?userkey=${API_KEY}&format=json`;

        const response = await axios.get(requestFormatted);

        if (response.data.found === false) {
            // DOMAIN NOT FOUND
            return [];
        }
        return response.data.technologies;
    } catch (err) {
        // Maybe we took advantage of the quota - "{"Message":"Rate limit exceeded"}"
        return [];
    }
}


module.exports = scanDomain;