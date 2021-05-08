/**
 * @validation {Validating the URL/IP format}
 */
const { R_IP, R_DOMAIN } = require("../../../../client/src/Magic/Regex.magic");
module.exports = () => {
    return (req, res, next) => {
        const domains_ips = req.body.domainOrIps;
        if (Array.isArray(domains_ips)) {
            return res.status(400).send({ error: "URLs/IPs must be given !" });
        }
        for (let domain_ip of domains_ips) {
            if (domain_ip[0] >= '0' && domain_ip[0] <= '9') {
                // Must be an IP
                if (`${domain_ip}`.match(new RegExp(R_IP)) === false) {
                    return res.status(400).send({ error: "Invalid IP ADDRESS" });
                }
            }
            else {
                // Must be a domain
                if (`${domain_ip}`.match(R_DOMAIN) === false) {
                    return res.status(400).send({ error: 'Invalid URL' });
                }
            }
        }
        next();
    }
}