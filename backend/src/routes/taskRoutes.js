const express = require('express');

const {
  getTasksForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    const tasks = await getTasksForUser(req.userId, {
      status: status || '',
      search: search || '',
    });

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch tasks' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await createTaskForUser(req.userId, {
      title,
      description,
      status,
      dueDate,
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create task' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const task = await updateTaskForUser(req.userId, id, {
      title,
      description,
      status,
      dueDate,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update task' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteTaskForUser(req.userId, id);

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete task' });
  }
});

module.exports = router;
