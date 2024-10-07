const express = require('express');
const mongoDBClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/personalBudget';
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/personalBudget', {
});

// Define Mongoose Schema and Model
const budgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  budget: { type: Number, required: true },
  color: {type: String, required: true,
    match: /^#[0-9A-Fa-f]{6}$/, // Ensure valid hex color
  },
});

const Budget = mongoose.model('Budget', budgetSchema, 'myBudget');

// Endpoint to get budget data from MongoDB
app.get('/budget', async (req, res) => {
    try {
        const budgetData = await Budget.find();
        res.json(budgetData);
    } catch (err) {
        console.error('Error fetching budget data:', err);
        res.status(500).send('Server Error');
    }
});

// Endpoint to add new budget data
app.post('/budget', async (req, res) => {
    const { title, budget, color } = req.body;

    if (!title || !budget || !color) {
        console.error('Missing fields:', req.body);  // Log the missing fields
        return res.status(400).send('All fields are required');
    }

    try {
        const newBudget = new Budget({ title, budget, color });
        await newBudget.save();
        console.log('New budget saved:', newBudget);  // Log successful save
        res.status(201).json(newBudget);
    } catch (err) {
        console.error('Error saving new budget data:', err);  // Log any errors
        res.status(500).send('Server Error');
    }
});

  // Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
  