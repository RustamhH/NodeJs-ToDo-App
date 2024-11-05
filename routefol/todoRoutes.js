const express = require('express');
const Todo = require('../models/todoModel');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const formidable = require("formidable");

// GET
router.get('/', authenticateToken, async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
});

// POST
router.post('/create', authenticateToken, async (req, res) => {
  
  const {title,description}=req.body;
  const todo = new Todo({
    title:title,
    description:description,
    author: req.user._id,
  });
  await todo.save();
  res.status(201).json(todo);
});


// POST
router.post("/addImages", async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (files.profileImage[0] && files.profileImage[0].filepath)
        files.profileImage.map((img) => {
          const image = fs.readFileSync(img.filepath);

          const imgName = img.originalFilename;
          const imgPath = `./images/${imgName}`;

          fs.writeFileSync(imgPath, image);
        });
      else throw new Error("file does not exist in the temp folder");
    });
  } catch (err) {
    console.error(err);
  }
});



// UPDATE
router.put('/update/:id', authenticateToken, async (req, res, next) => {
  try {
    if (!req.todo) return res.status(404).json({ message: 'Todo not found' });

    const updateSuccessful = await Todo.findByIdAndUpdate(req.params.id, req.body);

    updateSuccessful ? res.status(201).json(updateSuccessful) : res.status(400).json({message: "Error while updating todo"})
  }
  catch {
    res.status(400).json({ message: 'Invalid todo ID' });
  }
});

// DELETE
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const todoDeleted = await Todo.findByIdAndDelete(req.params.id);
    
    todoDeleted ? res.status(204).json({ message: 'Todo deleted' }) : res.status(400).json({ message: 'Error while deleting todo' })
  } catch {
    res.status(400).json({ message: 'Invalid todo ID' });
  }
});

module.exports = router;