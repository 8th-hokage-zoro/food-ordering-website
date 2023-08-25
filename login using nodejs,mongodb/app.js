const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/login_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a simple user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('users', userSchema);

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      console.log('Received credentials:', username, password);
  
      const user = await User.findOne({ username });
      console.log('Database query result:', user);
  
      if (user && user.password === password) {
        res.send('Login successful');
      } else {
        res.send('Invalid credentials');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    }
});

// ... (existing code)

// Handle sign-up form submission
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
      console.log('Received sign-up request:', username, password);

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          res.send('Username already exists');
          return;
      }

      // Create a new user
      const newUser = new User({
          username,
          password,
      });

      await newUser.save();

      res.send('Sign-up successful');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
  }
});

// ... (existing code)


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
