require("dotenv").config(); // Load .env variables

const express = require("express");
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: "Learn Node.js", completed: false },
  { id: 2, task: "Build CRUD API", completed: false },
];

function ValidateTodo(todo) {
  if (!todo.task || typeof todo.task !== "string") {
    return { valid: false, message: `POST requires 'task' field` };
  }
  return { valid: true };
}

// GET All – Read
app.get("/todos", (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// GET Active – Read
app.get("/todos/active", (req, res) => {
  const activeTodos = todos.filter((t) => t.completed === false);
  if (!activeTodos) {
    return res.status(200).json({ message: "No active todos found" });
  }
  return res.status(201).json(activeTodos);
});

app.get("/todos/completed", (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

// GET One – Read
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.status(200).json(todo);
});

// POST New – Create
app.post("/todos", (req, res) => {
  const validation = ValidateTodo(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: "Not found" });
  res.status(204).send(); // Silent success
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error!" });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
