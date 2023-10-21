const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Prüfung",
        },
        grade: {
            type: Number,
            required: [true, "Note"],
        },
        weight: { 
            type: Number,
            required: [true, "Gewichtung"],
            default: 1,
        },
        days: { 
            type: Number,
            required: [false, "Anzahl Lerntage"],
        },
        hours: { 
            type: Number,
            required: [false, "Lerndauer in Stunden"],
        },
        methods: { 
            type: Array,
            required: [false, "Lernmethoden"],
        },
        tips: { 
            type: String,
            required: [false, "Tipps"],
        },
        subject_id: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;