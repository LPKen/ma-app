const mongoose = require('mongoose');

//pfp, groups, admins, settings

const UserSpecsSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        groups: {
            type: Array,
            required: false,
        },
        admin: {
            type: Array,
            required: false,
        },
        requests: {
            type: Array,
            required: false,
        },
        pfp: {
            type: String,
            required: true,
        }
        
    },
    {
        timestamps: true
    }
)

const UserSpecs = mongoose.model('Info', UserSpecsSchema);

module.exports = UserSpecs;