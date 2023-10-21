const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }],
        admin: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        requests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        pfp: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;