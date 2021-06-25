const Wappalyzer = require("wappalyzer");
const wappalyzer = new Wappalyzer();
wappalyzer.init();
async function scanDomain(domain_ip) {
  try {
    let domain_ip_formatted = "https://" + domain_ip;

    const results = await wappalyzer.open(domain_ip_formatted).analyze();
    console.log("Wappalyzer.results.technologies =", results.technologies)

    console.log("Here is a detailed:")
    results.technologies.forEach(tech => {
      console.log("name =", tech.name);
      console.log("categories =", tech.categories)
      console.log("---------------------------------")
    })
    return results.technologies;
  } catch (error) {
    console.error(error);
  }
  // await wappalyzer.destroy();
}

module.exports = scanDomain;
