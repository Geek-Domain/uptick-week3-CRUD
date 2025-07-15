const express = require('express');
const { Task } = require('./models');

const app = express();
const PORT = 3000;

app.use(express.json());

// GET /tasks - List all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.create({ title, completed: false });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
