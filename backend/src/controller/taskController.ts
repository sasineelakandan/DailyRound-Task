import Task from "../model/taskModel"
export const addTask = async (req, res) => {
  try {
    if (req.userId) {
      const { taskName, description, date, status, category, userId, fileUrl } = req.body;
      
      if (!taskName || !date || !status || !category || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const lastTask = await Task.findOne({ userId }).sort({ position: -1 });
      const newPosition = lastTask ? lastTask.position + 1 : 1;
      
      const createdAt = new Date().toLocaleString(); 
      const historyEntry = `You Created this task on ${createdAt}`;
      
      const newTask = new Task({
        userId,
        title: taskName,
        description,
        dueDate: date,
        status,
        category,
        position: newPosition,
        attachments: [fileUrl],
        history: [historyEntry], 
      });

      const savedTask = await newTask.save();
      return res.status(201).json({ message: 'Task added successfully', task: savedTask });
    } else {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const fetchTask = async (req, res) => {
  try {
    if (req.userId) {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const userTasks = await Task.find({ userId });
      return res.status(200).json(userTasks);
    } else {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const changeStatus = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    const { status, userId } = req.query;

    if (!status || !userId) {
      return res.status(400).json({ message: 'Bad Request: Missing required fields' });
    }

    const updatedUser = await Task.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Status updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const singleUserTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
    const { taskId } = req.query;
    const task = await Task.findOne({ _id: taskId, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const editTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
    const createdAt = new Date().toLocaleString(); 
    const historyEntry = `You edited on ${createdAt}`;
    const { taskId, userId, taskName, description, date, status, category ,editImage} = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId },
      {
        $push: {
          history: historyEntry, 
        },
        title: taskName,
        description,
        dueDate: date,
        status,
        category,
        attachments: [editImage]
      },
      { new: true }
    );
    

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or you are not authorized to edit this task' });
    }

    return res.status(200).json(updatedTask);

  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




export const deleteBatchTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }
  
    const { taskArray } = req.body;

    if (!taskArray || taskArray.length === 0) {
      return res.status(400).json({ message: 'No task IDs provided' });
    }


    const result = await Task.deleteMany({ _id: { $in: taskArray } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No tasks found to delete' });
    }

    return res.status(200).json({ message: `${result.deletedCount} task(s) deleted successfully` });
  } catch (error) {
    console.error('Error deleting tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};




export const batchStatusChange = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing or invalid' });
    }

    const { taskArray, taskStatus } = req.body;
    if (!taskArray || !taskStatus) {
      return res.status(400).json({ message: 'Bad Request: taskArray and taskStatus are required' });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskArray } },
      { $set: { status: taskStatus } }
    );

    if (result.nModified > 0) {
      return res.status(200).json({ message: 'Tasks status updated successfully' });
    } else {
      return res.status(404).json({ message: 'No tasks found or status unchanged' });
    }

  } catch (error) {
    console.error('Error updating tasks:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

