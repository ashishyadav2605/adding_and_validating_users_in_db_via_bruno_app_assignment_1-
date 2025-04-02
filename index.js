const express = require('express');
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const User = require('./models/User')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3010;
const dburl = process.env.db_url;

app.use(bodyParser.json());

mongoose.connect(dburl)
.then(()=> console.log('Mongo DB connected'))
.catch(err => console.error('MongoDB connection error:', err))

app.post('/register', async(req, res) => {
  const {username, email, password} = req.body;

  if(!username || !password || !email){
    return res.status(400).json({success: false, message: 'All fields are required'});
  }
  
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, email, password: hashedPassword });
    
    await newUser.save();
    
    res.status(201).json({success: true, message: 'User registed succesfully'});
  } catch(error){
    res.status(500).json({success: false, message: 'Error registering user', error});
  }
})
app.use(express.static('static'));

// app.get('/', (req, res) => {
//   res.sendFile(resolve(__dirname, 'pages/index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});