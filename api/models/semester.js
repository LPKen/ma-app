const mongoose = require('mongoose');

const semesterSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Semester",
        },
        subjects: {
            type: Array,
            required: false,
        },
        average: { 
            type: Number,
            required: false,
        },
        pluspoints: { 
            type: Number,
            required: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
)

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;