const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;
const REVIEWS_FILE = path.join(__dirname, 'reviews.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load existing reviews
let reviews = [];
if (fs.existsSync(REVIEWS_FILE)) {
  reviews = fs.readJsonSync(REVIEWS_FILE);
}

// Get all reviews
app.get('/api/reviews', (req, res) => {
  res.json(reviews);
});

// Add a new review
app.post('/api/reviews', (req, res) => {
  const { name, rating, text } = req.body;
  const newReview = {
    id: Date.now(),
    name,
    rating: Number(rating),
    text,
    timestamp: new Date().toISOString()
  };

  reviews.push(newReview);
  fs.writeJsonSync(REVIEWS_FILE, reviews, { spaces: 2 });

  res.json({ message: 'Review added!', review: newReview });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
