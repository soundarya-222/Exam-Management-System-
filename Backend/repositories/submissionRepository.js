const Submission = require('../models/submissionModel');

module.exports.create = function(data) {
    return Submission.create(data);
};

module.exports.findByStudent = function(studentId) {
    return Submission.find({ studentId });
};

module.exports.findByExam = function(examId) {
    return Submission.find({ examId });
};

module.exports.findOneByStudentAndExam = function(studentId, examId) {
    return Submission.findOne({ studentId, examId });
};

module.exports.findById = function(id) {
    return Submission.findById(id);
};

module.exports.findPublishedByStudent = function(studentId) {
    return Submission.find({ studentId, published: true });
};

module.exports.update = function(id, changes) {
    return Submission.findByIdAndUpdate(id, changes, { new: true });
};
