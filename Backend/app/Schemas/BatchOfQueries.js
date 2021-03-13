/**
 * A single log which is a query that contains all the results,
 * Each log contains array of domains and IPs.
 */


const mongoose = require('mongoose');
const { DomainScanModel, DomainScanSchema } = require('./DomainScan');
const { IPScanModel, IPScanSchema } = require('./IPScan');
const { SystemModel, SystemSchema } = require('./System');


// ToDo: add log date & time
const BatchOfQueriesSchema = new mongoose.Schema({
    scanId: {
        // The ID of the scan result in order to distinguish between scans
        type: String,
        default: 1234567
    },
    domainScans: {
        type: [DomainScanSchema],
        default: []
    },
    ipsScans: {
        type: [IPScanSchema],
        default: []
    }
})

BatchOfQueriesSchema.methods.addDomainScan = async function (domainAsset, domainInfo) {
    try {
        // At first, the scanDomains
        const newDomainScan = await new DomainScanModel({ asset: domainAsset });
        await newDomainScan.addSystems(domainInfo);

        this.domainScans.push(newDomainScan);
        await this.save();

        console.log("----------------\n[+] Saved \n---------------");
    } catch (err) {
        console.error(err);
    }
}



const BatchOfQueriesModel = mongoose.model('BatchOfQueries', BatchOfQueriesSchema);


module.exports = { BatchOfQueriesModel, BatchOfQueriesSchema };