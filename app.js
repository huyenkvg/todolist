const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('todos.db');

// Create todos table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  completed INTEGER
)`);

// Middleware
app.use(express.json());

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  const query = 'INSERT INTO todos (title, completed) VALUES (?, ?)';
  const values = [title, completed ? 1 : 0];
  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else {
      res.json({ id: this.lastID, title, completed });
    }
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const query = 'UPDATE todos SET title = ?, completed = ? WHERE id = ?';
  const values = [title, completed ? 1 : 0, id];
  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json({ id, title, completed });
    }
  });
});
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    const values = [id];
    db.run(query, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Todo not found' });
      } else {
        res.json({ message: 'Todo deleted' });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Huyen's todo api`);
  });