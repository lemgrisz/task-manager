const Task = require("../models/Task");
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const userId = req.query.userId;

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return res.status(400).json({ message: "Invalid due date format" });
    }

    const newTask = new Task({
      title,
      description,
      status,
      dueDate: parsedDueDate,
      user: userId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};
exports.getAllTasks = async (req, res) => {
  console.log("GET ALL TASKS CALLED");
  console.log("Authenticated user", req.user);
  console.log("User ID from query", req.query.userId);

  if (req.query.userId !== req.user.id.toString()) {
    return res.status(403).json({ message: "Unauthorized access to tasks" });
  }

  try {
    const tasks = await Task.find({ user: req.query.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error.message);
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving task", error: error.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ taskId: task._id, message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
    console.error(error);
  }
};

