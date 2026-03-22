const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['MCQ', 'THEORY'],
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
        index: true
    },
    // options are only relevant for MCQ questions
    options: {
        type: [String],
        default: undefined // absence when not MCQ
    },
    // for MCQ questions only
    correctAnswer: {
        type: String
    },
    marks: {
        type: Number,
        default: 1
    }
});

// custom validation: make sure MCQ questions have options and a correctAnswer
questionSchema.pre('validate', function(next) {
    if (this.type === 'MCQ') {
        if (!this.options || this.options.length < 2) {
            this.invalidate('options', 'MCQ questions must have at least two options');
        }
        if (!this.correctAnswer) {
            this.invalidate('correctAnswer', 'MCQ questions must define a correctAnswer');
        }
    }
    next();
});

module.exports = mongoose.model('Question', questionSchema);
