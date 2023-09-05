const mongoose = require('mongoose')
const TasksSchema = mongoose.Schema({
    date: {
        type: Date
    },
    traineeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    task: {
        type: String
    },
    trainerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
    },
    isDone: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Tasks', TasksSchema)