"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controller/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const taskRoutes = (0, express_1.Router)();
taskRoutes.post('/add-task', authMiddleware_1.verifyToken, taskController_1.addTask);
taskRoutes.post('/delete-task', authMiddleware_1.verifyToken, taskController_1.deleteTask);
taskRoutes.get('/fetch-task', authMiddleware_1.verifyToken, taskController_1.fetchTask);
taskRoutes.get('/change-status', authMiddleware_1.verifyToken, taskController_1.changeStatus);
taskRoutes.get('/singleUser-task', authMiddleware_1.verifyToken, taskController_1.singleUserTask);
taskRoutes.patch('/edit-task', authMiddleware_1.verifyToken, taskController_1.editTask);
taskRoutes.delete('/deleteBatch-task', authMiddleware_1.verifyToken, taskController_1.deleteBatchTask);
taskRoutes.put('/batchStatusChange-task', authMiddleware_1.verifyToken, taskController_1.batchStatusChange);
exports.default = taskRoutes;
//# sourceMappingURL=taskRoutes.js.map