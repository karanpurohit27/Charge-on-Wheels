const express = require('express');
const app= express();
const { registerUser, signin, getStation, bookStation, getSlot } = require('./database');
const port = 5000;
const cors =require("cors")
app.use(cors());
const bodyParser = require('body-parser');
//const { default: StationList } = require('../Client/take-u-forward/src/Components/StationList');
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Karan is here to compete and win")
})
app.post('/submit', async (req, res) => {
  try {
    const rs=await registerUser(req.body.user, req.body.password);
    if(rs==='not')res.send('User Exist');
    else res.send('User registered');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
app.post('/signin', async (req, res) => {


  // Find user by username in the database
  try {
    const rs=await signin(req.body.user, req.body.password);
    console.log(rs)
    if(rs==="error")res.status(500).json({ error: 'Internal server error' })
    if(rs==="invalid")res.json('invalid credential')
    else res.json({ rs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing user');
  }
});

app.get('/getstation', async (req, res) => {


  // Find user by username in the database
  try {
    const rs=await getStation();
    console.log(rs);
    res.send(rs)
   
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing user');
  }
});

app.get('/station/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  
  try {
    const rs=await getSlot(newData, id);
    console.log(rs);
    res.send(rs)
   
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing user');
  }
  
});
app.put('/station/:id', async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  console.log(newData)
  try {
    const rs=await bookStation(newData, id);
    console.log(rs);
    res.send(rs)
   
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing user');
  }
  
});


app.listen(port,()=>{
    console.log("Server is ON!")
});