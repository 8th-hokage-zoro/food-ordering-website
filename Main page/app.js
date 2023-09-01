const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();


mongoose.connect('mongodb://0.0.0.0:27017/login_demo', {
  useNewUrlParser:true,
  useUnifiedTopology:true,
});
const db=mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Add this code before defining other routes
app.use(express.static(__dirname));

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const userSchema=new mongoose.Schema({
  username:String,
  password:String,
});
const User=mongoose.model('users', userSchema);



app.post('/login', async (req, res) => {
  const { username, password }=req.body;

  try {
      console.log('Received credentials:', username, password);

      const user=await User.findOne({ username });
      console.log('Database query result:', user);

      if (user && user.password===password) {
          res.redirect('/dashboard.html');
      } else {
          res.send('Invalid credentials');
      }
      
  }
  catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
  }
});



app.post('/signup', async (req, res) => {
  const { username, password }=req.body;

  try {
      console.log('Received sign-up request:', username, password);

    
      const existingUser=await User.findOne({ username });
      if (existingUser) {
          res.send('Username already exists');
          return;
      }

    
      const newUser=new User({
          username,
          password,
      });

      await newUser.save();

      res.redirect('/login.html');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
  }
});


const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
