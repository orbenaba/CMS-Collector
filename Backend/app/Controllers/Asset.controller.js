const SimilarTechScanDomain = require('../Microservices/SimilarTech');
const WhatCMSScanDomain = require('../Microservices/WhatCMS');
const WappalyzerScanDomain = require('../Microservices/Wappalyzer');
const RemoveDups = require('../Help-Functions/RemoveDups');
const { BatchOfQueriesModel } = require('../Schemas/BatchOfQueries');
const { R_IP, R_DOMAIN } = require("../../../client/src/Magic/Regex.magic");


async function scan(req, res) {
    try {
        let domains_ips = req.body.domainOrIps;
        console.log("-+] res.locals =\n", res.locals);
        let username = res.locals.user.username;
        // user.username
        let batchOfScans = new BatchOfQueriesModel({ username });
        const promises = domains_ips.map(domain_ip => {
            if (domain_ip.match(R_IP)) {
                // do ip scan ....
            }
            else {
                // do domain scan ...
                return scanDomain(batchOfScans, domain_ip);
            }
        });

        await Promise.all(promises)
        console.log("[+] batchOfScans = \n", batchOfScans)
        console.log("------------------------")
        return res.status(200).send({ results: batchOfScans })
    } catch (err) {
        console.log("error = ", err)
        return res.status(400).send({ error: err })
    }
}

async function scanDomain(batchOfScans, domain) {
    try {
        // Run all the micro-services parallelly with promise all
        const requests2MicroServices = [SimilarTechScanDomain(domain), WhatCMSScanDomain(domain), WappalyzerScanDomain(domain)];
        // Here, allInfoAboutDomain is an array of arrays when each array is suit for each micro service
        const allInfoAboutDomain = await Promise.all(requests2MicroServices);
        const infoWithoutDups = RemoveDups(allInfoAboutDomain);

        // Here, keep the results in the DataBase
        await batchOfScans.addDomainScan(domain, infoWithoutDups);

        return batchOfScans.domainScans;
    } catch (err) {
        return [];
    }
}


async function getAllUserScans(req, res) {
    try {
        const username = req.user.username;
        const userScans = await BatchOfQueriesModel.find({ username });
        return res.status(200).send({ userScans })
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}

async function getScanAsset(req, res) {

}

async function deleteScanAsset(req, res) {

}






module.exports = { scan, getScanAsset, deleteScanAsset, getAllUserScans };