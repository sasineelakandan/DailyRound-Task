"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    category: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'others',
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'completed'],
        default: 'todo',
    },
    position: {
        type: Number,
        required: true,
    },
    attachments: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    history: {
        type: [String],
        default: [],
    },
});
const Task = mongoose.model('Task', taskSchema);
exports.default = Task;
//# sourceMappingURL=taskModel.js.map