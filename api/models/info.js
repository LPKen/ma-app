const mongoose = require('mongoose');

const infoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        authors: {
            type: Array,
            required: false,
        },
        text: { 
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
)

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;