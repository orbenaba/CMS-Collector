const axios = require("axios");
const API_KEY = "35028046-5347-4d80-ae42-116155ea20e2"


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function scanDomain(domain) {
    try {
        const requestFormatted = `https://api.builtwith.com/free1/api.json?KEY=${API_KEY}&LOOKUP=${domain}`;

        const responseData = (await axios.get(requestFormatted)).data;
        // We need to rest for one second between two requests because we use free API
        await sleep(1000);
        if (responseData.Results === null) {
            return [];
        }
        const arrGroups = responseData.groups;
        const arrSanitized = [];
        arrGroups.forEach(objTech => {
            // If there is not category, we will ignore it because it has no "Meet"
            if (objTech.categories.length) {
                arrSanitized.push({
                    name: objTech.name,
                    categories: objTech.categories.map(objCategory => {
                        return objCategory.name;
                    })
                });
            }
        })
        return arrSanitized;
    } catch (err) {
        console.log(err)
        return [];
    }
}


module.exports = scanDomain