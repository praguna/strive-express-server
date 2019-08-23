import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import request from 'request';
import mongoose from 'mongoose';
import problem from  './models/problem'
import problemDetail from './models/problem_detail'
import User from './models/user'
import Admin from './models/admin'
const app = express();
var mongoDB = process.env.MONGO_SERVER
const _app_folder="./angular/strive-client"
mongoose.connect(mongoDB,{useNewUrlParser: true}); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send({test :'Hello from the Server!'});
});

app.post('/api/execute',(req,res)=>{
  request({
    url: process.env.URL,
    method: "POST",
    json: req.body
},
function (error, response, body) {
  console.log(body);
    res.json(body)
});
});


app.post('/api/data/submit',(req,res)=>{
  problem.findOneAndUpdate({name: req.body.problem.name},req.body.problem,{upsert :true,useFindAndModify : false},function (err, problem) {
    if (err) return console.error(err);
    }).then(()=>{
      problem.findOne({name: req.body.problem.name},(err,problem)=>{
      problemDetail.findOneAndUpdate({problem : problem._id},req.body.detail,{upsert :true,useFindAndModify : false}, function(err,doc){
        if (err) return console.error(err)
        res.status(201).json("Update Success");
      });  
    });
  });
});

app.post('/api/data/delete/',(req,res)=>{
  problem.findByIdAndRemove(req.body.id,{useFindAndModify : false},(err,problem)=>{
     if(err) return console.error(err);
     if(problem==null) return res.status(400).json("failure")
     problemDetail.findOneAndRemove({problem : problem._id},(err,_)=>{
        if(err) res.status(400).json("error")
        else res.status(201).json("success")  
     })
   })
})


app.get('/api/data/problem/',(req,res)=>{
  problem.findById(req.query.id, {useFindAndModify :false} ,(err,problem)=>{
    if(err) res.status(400).json("error")
    else res.status(201).json(problem);
  })
});

app.get('/api/data/problem/name',(req,res)=>{
  problem.findOne({name : req.query.name}, {useFindAndModify :false} ,(err,problem)=>{
    if(err) res.status(400).json("error")
    else res.status(201).json(problem);
  })
});

app.get('/api/data/problem/detail/name',async (req,res)=>{
  problem.findOne({name: req.query.name},(err,problem)=>{
    if(err) return console.error(err) 
    if(problem==null) return;
    problemDetail.findOne({problem : problem._id},req.body.detail,{upsert :true,useFindAndModify : false}, function(err,doc){
      if (err) res.status(400).json("error")
      else res.status(201).json(doc);
    });  
  });
})

app.get('/api/data/problem/detail',async (req,res)=>{
  await problemDetail.findOne({problem : req.query.id}, {useFindAndModify :false}, (err, detail)=>{
    if(err) res.status(400).json("error")
    else res.status(201).json(detail)
  })
})

app.get('/api/data/problems/',async (req,res)=>{
  await problem.find({},(err,problem)=>{
    if(err) res.status(400).json("error")
    else res.status(201).json(problem);
  })
});

app.post('/api/data/register',async (req,res)=>{
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    const expires_in =  60 * 60 * 24 *6
    res.status(201).json({ user, token ,expires_in})
} catch (error) {
    res.status(400).json("username or email not unique")
}
})

app.post('/api/data/login', async(req, res) => {
  //Login a registered user
  try {
      const { email, password } = req.body
      const user = await User.findByCredentials(email, password)
      if (!user) {
          return res.status(401).json('Login failed! Check authentication credentials')
      }
      const token = await user.generateAuthToken()
      const expires_in =  60 * 60 * 24 *6
      res.json({ user, token ,expires_in})
  } catch (error) {
      res.status(400).json(error.toString())
  }
});

app.post('/api/data/admin/login',async(req,res)=>{
  //Login a registered Admin
  try {
    const { email, password } = req.body
    const admin = await Admin.findByCredentials(email, password)
    if (!admin) {
        return res.status(401).json('Login failed! Check authentication credentials')
    }
    const token = await admin.generateAuthToken()
    const expires_in =  60 * 60 * 24 *6
    res.json({ admin, token ,expires_in})
 } catch (error) {
    res.status(400).json(error.toString())
 }
})

app.post('/api/data/admin/register',async(req,res)=>{
  //register an admin
  try {
    const admin = new Admin(req.body)
    await admin.save()
    const token = await admin.generateAuthToken()
    const expires_in =  60 * 60 * 24 *6
    res.status(201).json({ admin, token ,expires_in})
} catch (error) {
    res.status(400).json("email not unique")
}
})


app.listen(process.env.PORT, () =>
  console.log(`Proxy Server Listening on port ${process.env.PORT}!`),
);

