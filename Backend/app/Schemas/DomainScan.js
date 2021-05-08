// The Doamin of the requested asset and the list of systems that assembles the asset
const mongoose = require('mongoose');
const { SystemSchema, SystemModel } = require('./System');

const DomainScanSchema = new mongoose.Schema({
    // Asset is the queried domain
    asset: {
        type: String
    },
    // All the results of the queried asset
    systems: {
        type: [SystemSchema],
        default: []
    }
})

DomainScanSchema.methods.addSystems = async function (systems) {
    try {
        for (let i = 0; i < systems.length; i++) {
            let curSys = await new SystemModel({ name: systems[i].name, categories: systems[i].categories, version: systems[i].version ? systems[i].version : "0.0" });
            await this.systems.push(curSys);
        }
    } catch (err) {
        console.error(err);
    }
}


const DomainScanModel = mongoose.model('DomainScan', DomainScanSchema);

module.exports = { DomainScanModel, DomainScanSchema };