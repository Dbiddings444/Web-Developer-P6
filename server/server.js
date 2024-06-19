const dotenv = require('dotenv'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.error('Failed to connect to Database:', error));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Text from server');
});

// Use the authentication routes
app.use('/users', userRoutes);

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
