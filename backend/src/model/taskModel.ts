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
    enum: ['work', 'personal', 'others'], 
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

export default Task