// One request of the user contains multiple assets than we save all this batch as one struct
const mongoose = require('mongoose');
const { DomainScanModel, DomainScanSchema } = require('./domainScan.schemas');
const { IPScanModel, IPScanSchema } = require('./IPScan.schemas');


// ToDo: add log date & time
const BatchOfQueriesSchema = new mongoose.Schema({
    // The ID of the scan result in order to distinguish between scans is added automatically
    domainScans: {
        type: [DomainScanSchema],
        default: []
    },
    ipsScans: {
        type: [IPScanSchema],
        default: []
    },
    // The username of the scanner
    username: {
        type: String
    }
})

BatchOfQueriesSchema.methods.addDomainScan = async function (domainAsset, domainInfo) {
    try {
        // At first, the scanDomains
        const newDomainScan = new DomainScanModel({ asset: domainAsset });
        await newDomainScan.addSystems(domainInfo);

        this.domainScans.push(newDomainScan);
        await this.save();

        console.log("----------------\n[+] Saved \n---------------");
    } catch (err) {
        console.error(err);
    }
}

/**
 * @param {the domain to be searched} domain2Find 
 */
BatchOfQueriesSchema.statics.isExisted = async function (domain2Find) {
    try {
        const doms = await BatchOfQueriesModel.find({}).select("domainScans");
        for (let dom of doms) {
            let i = dom.domainScans.findIndex(obj => obj.asset === domain2Find);
            if (i >= 0) {
                return dom.domainScans[i];
            }
        }
        return false;
    } catch (err) {
        console.error(err);
    }
}

const BatchOfQueriesModel = mongoose.model('BatchOfQueries', BatchOfQueriesSchema);
module.exports = { BatchOfQueriesModel, BatchOfQueriesSchema };