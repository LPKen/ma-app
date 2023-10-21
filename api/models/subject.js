const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Fach",
        },
        pluspoints: { 
            type: Number,
            required: false,
        },
        average: { 
            type: Number,
            required: false,
        },
        weight: { 
            type: Number,
            required: true,
        },
        semester_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        shared: {
            type: Boolean,
            default: true,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;