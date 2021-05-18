// The IP of the requested asset and the list of systems that assembles the asset
const mongoose = require('mongoose');
const { SystemSchema, SystemModel } = require('./system.schemas');
const IPScanSchema = new mongoose.Schema({
    // Asset is the queried ip
    asset: {
        type: String
    },
    // All the results of the queried asset
    systems: {
        type: [SystemSchema],
        default: []
    }
})

const IPScanModel = mongoose.model('IPScan', IPScanSchema);
module.exports = { IPScanSchema, IPScanModel };