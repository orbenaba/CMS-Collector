const Wappalyzer = require('wappalyzer');
const wappalyzer = new Wappalyzer()
async function scanDomain(domain_ip) {
    try {
        let domain_ip_formatted = 'https://' + domain_ip
        await wappalyzer.init()

        const results = await wappalyzer.open(domain_ip_formatted).analyze();
        return results.technologies

    } catch (error) {
        console.error(error)
    }

    await wappalyzer.destroy()
}

module.exports = scanDomain;