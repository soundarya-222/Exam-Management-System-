const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'LONG'],
        required: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ],
    totalMarks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// whenever an exam is saved we can recompute totalMarks from its questions
examSchema.pre('save', async function(next) {
    if (this.questions && this.questions.length) {
        const Question = require('./questionModel');
        const qs = await Question.find({ _id: { $in: this.questions } });
        this.totalMarks = qs.reduce((sum, q) => sum + (q.marks || 0), 0);
    }
    next();
});

module.exports = mongoose.model('Exam', examSchema);
