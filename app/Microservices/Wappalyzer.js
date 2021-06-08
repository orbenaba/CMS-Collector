const Wappalyzer = require("wappalyzer");
const wappalyzer = new Wappalyzer();
await wappalyzer.init();
async function scanDomain(domain_ip) {
  try {
    let domain_ip_formatted = "https://" + domain_ip;

    const results = await wappalyzer.open(domain_ip_formatted).analyze();
    return results.technologies;
  } catch (error) {
    console.error(error);
  }
  // await wappalyzer.destroy();
}

module.exports = scanDomain;
