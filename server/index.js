const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { error } = require('console');
const uri = "mongodb+srv://aaron:aa@cluster0.cgelvmu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run(){
    
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());
//const secretkey = "123";


var student = '';
await client.connect();
var user1 = '';
var pass = '';
app.post('/login',  async(req, res) => {
 
    const { username, password } = req.body;
        try {
       /*     const us=[
                {
                    "username": "aarone",
                    "password": "aea",
                    "name": "Aaronrm",
                    "rollno": "kte21msqa",
                    "religion": "cgrsja",
                    "phone": "87418029380",
                    "fathersname": "andcsh",
                    "mothersname": "shckadk",
                    "attendance": {
              
                      "Math": [
                        {
                          "date": "01/01/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/02/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/03/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/04/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/05/2021",
                          "value": "Absent"
                        }
                      ],
                      "English": [
                        {
                          "date": "01/01/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/02/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/03/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/04/2021",
                          "value": "Present"
                        },
                        {
                          "date": "01/05/2021",
                          "value": "Absent"
                        }
                      ]
              
                    }
                }
            ]*/
            await client.connect();
            const db = client.db('data');
            const collection = db.collection('user');
          /* try {
                const insertManyResult = await collection.insertMany(us);
                console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
              } catch (err) {
                console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
              }*/
            await client.db("user").command({ ping: 1 });
           
            const user = await collection.findOne({ username, password});
           
            if (user) {
              var pos= user.pos
              if(pos === 'admin' || server){
              
                const token1 = jwt.sign({ username,exp:600 }, '1234');
                
                res.json({ token1,pos,user});
                student=user;
                user1 = username;
                pass = password;
    
                if(pos==='teacher'){
                sub=user.subject;
                cls=user.class;

            }
            const cursor1 = collection.find({ pos: { $in: ['teacher', 'student'] } });
            tusers=[];
            await cursor1.forEach(user => {
              tusers.push(user);
            });
             const cursor = collection.find({pos:'student',class: cls});
              users = [];
              await cursor.forEach(user => {
                users.push(user);
              });
            
            }
          
            if(!server && pos!=='admin'){
              res.status(401).json({ message: 'SERVER STOPPED BY ADMIN' });
            }
          }
          else if (username === "" || password === "") {
            res.status(401).json({ message: 'Enter username or password!' });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }

        }
     
      
        finally {
            console.log('done');
        }
      
      
      
}); 

app.get("/api/student1", async(req, res) => {
  const db = client.db('data');
  const collection = db.collection('user');
  const user = await collection.findOne({username:user1, password:pass});
    var us = user;
    res.json(us);
});
app.get("/api/student", async(req, res) => {
  
    res.json(student);
});

const path2 = 'uploads/notification/'

if (!fs.existsSync(path2)) {
  fs.mkdirSync(path2, { recursive: true });
}




app.post('/upload', (req, res) => {
  let sub = req.headers['access-control-allow-headers'];
  let date = req.headers['date111'];
  let len = req.headers['len'];
  let path1 = 'uploads/assig/';

  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path1);
    },
    filename: (req, file, cb) => {
      const [name,type] = file.originalname.split('.')

      cb(null,name+'.'+type);
    },
  });

  const upload = multer({ storage });

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    console.log('file uploaded');
    res.json({ file: req.file });
  });
});
app.post('/studentupload', (req, res) => {
 
  let path1 = 'uploads/assig/';

  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path1);
    },
    filename: (req, file, cb) => {
      const [name,type] = file.originalname.split('.')

      cb(null,name+'.'+type);
    },
  });

  const upload = multer({ storage });

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }

    console.log('file uploaded');
    res.json({ file: req.file });
  });
});
app.post("/studentassig", async(req, res) => {
  const {filename,upload,sub,classroll} = req.body;
  console.log(upload);

  try{
    const db = client.db('data');
    const collection = db.collection('user');
    const users = await collection.find().toArray();
    await Promise.all(users.map(async (user) => {
      var myquery1 = {name:user.name, class:cls,pos:'teacher',assignment: { $exists: true, $type: 'array'}};
      var newvalues1 = { $push: { ['assignment'] :{sub,$type:'array'}} };
    
      await collection.updateOne(myquery1, newvalues1).then(res =>{
        console.log("assig added");
      }).catch(err =>{
        console.log(err);
      });
    
      var myquery = {
        name: user.name,
        pos: 'teacher',
        ['assignment.' + sub]: {
          $elemMatch: {
            upload: upload,
            classroll: classroll
          }
        }
      };
            var newvalues = { $set: { ['assignment.' + sub + '.$.studentfile']: filename } };
      console.log(upload);
    
      let result = await collection.updateOne(myquery, newvalues);
      if (result.matchedCount === 0) {
        myquery = {name:user.name,class: cls,pos:'teacher' };
        newvalues = { $push: {  ['assignment.' + sub]:{studentfile:filename,upload: upload,classroll:classroll}} };
      }
      await collection.updateOne(myquery, newvalues).then(res =>{
        console.log("assig updated");
        console.log(filename,upload,classroll);
      }).catch(err =>{
        console.log(err);
      });
    }));
  }finally{

  }
  res.json({message:'success'});
});



let subj = [];
const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path2);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload1 = multer({ storage:storages });
app.post('/pdfnotify', upload1.single('file'), (req, res) => {
  console.log("file uploaded");
  res.json({ file: req.file });
});
const assigpath = path.join('C:/Users/mincy/Desktop/portal');


app.get('/getFile/:f', async (req, res) => {
  const f = req.params.f;
  console.log(req.params.f);

  fs.readdir('uploads/assig/', async (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    const file = files.find(file => file.startsWith(f))
    if (file) {
      const filePath = path.join(assigpath, 'uploads/assig', f);
      console.log(filePath);

      fs.stat(filePath,(err,stats) =>{
        if (err) {
          console.error(err);
          return;
        }
        res.setHeader('X-Creation-Time', stats.birthtime.toISOString());
        if(subj[req.params.f]){
        res.setHeader('access-control-allow-headers',sub[req.params.f])
        }
        res.sendFile(filePath);
      });
    
    } else {
      res.status(404).send('File not found');
    }
  });
});


app.get('/getFle/:sub/:index', function(req, res) {
  fs.readdir(assigpath+'/'+[req.params.sub], (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }
    console.log("present");

    const file = files[req.params.index];
    if (file) {
      console.log("present");
      const filePath = path.join(assigpath+'/'+[req.params.sub], file);
      fs.stat(filePath,(err,stats) =>{
        if (err) {
          console.error(err);4444
          return;
        }
        res.setHeader('X-Creation-Time', stats.birthtime.toISOString());
        if(subj[req.params.index]){
        res.setHeader('access-control-allow-headers',sub[req.params.index])
        }
        res.sendFile(filePath);
      });
    } else {
      res.status(404).send('File not found');
    }
  });
});

const notifypath = path.join('C:/Users/mincy/Desktop/portal', 'uploads/notification');

app.get('/getNotify/:index', function(req, res) {
  fs.readdir(notifypath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }
    const file = files[req.params.index];
    if (file) {
      const filePath = path.join(notifypath, file);
      fs.stat(filePath,(err,stats) =>{
        if (err) {
          console.error(err);
          return;
        }
        res.setHeader('x-creation-time', stats.birthtime.toISOString());
        res.setHeader('Access-Control-Expose-Headers', 'x-creation-time'); // Add this line
        res.sendFile(filePath);
      });
      console.log(file);
    } else {
      res.status(404).send('File not found');
    }
  });
});


let server = true;

app.get('/set', function(req, res) {
   console.log("resumed");
   server = true;
   res.json({message:'SERVER RESUMED'});  

  
 });
 app.get('/get',function(req,res){
   res.json(server);

 });
 app.get("/wait", function(req, res) {
     console.log("wating");
     server = false;
     res.json({message:'SERVER STOPPED'});  
 });
var users = [];
var tusers = [];

app.get("/api/total", (req, res) => {

    res.json(users);
});
app.get("/api/alltotal", async(req, res) => {
  const db = client.db('data');
  const collection = db.collection('user');
  const cursor1 = collection.find({ pos: { $in: ['teacher', 'student'] } });
        tusers=[];
        await cursor1.forEach(user => {
          tusers.push(user);
        });   
  res.json(tusers);
});

app.post("/sprof",async(req,res)=>{
   
  const { roll,rollno,fname,mname,phone } = req.body;
  try{

    const db = client.db('data');
    const collection = db.collection('user');
    var myquery = {username:student.username,password:student.password}; 
    var newvalues = { $set: {rollno:roll,classroll:rollno,fathersname:fname,mothersname:mname,phone:phone} };
    await collection.updateOne(myquery, newvalues).then(res =>{
      console.log("profile updated");
     
      

  
  }).catch(err =>{
      console.log(err);
  });
  const user = await collection.findOne(myquery);
  student=user;
  
}finally{

}
  res.json('updated');




});
app.post("/changepass",async(req,res)=>{
   
  const { cpass } = req.body;
  try{

    const db = client.db('data');
    const collection = db.collection('user');
    var myquery = {username:student.username,password:student.password}; 
    var newvalues = { $set: {password:cpass} };
    await collection.updateOne(myquery, newvalues).then(res =>{
      console.log("profile updated");
     
      

  
  }).catch(err =>{
      console.log(err);
  });
  const user = await collection.findOne(myquery);
  student=user;
  
}finally{

}
  res.json('updated');




});
app.post("/tprof",async(req,res)=>{
   
  const { subject,fname,mname,phone } = req.body;
  try{

    const db = client.db('data');
    const collection = db.collection('user');
    var myquery = {username:student.username,password:student.password}; 
    var newvalues = { $set: {subject:subject,fathersname:fname,mothersname:mname,phone:phone} };
    await collection.updateOne(myquery, newvalues).then(res =>{
      console.log("profile updated");
     
      

  
  }).catch(err =>{
      console.log(err);
  });
  const user = await collection.findOne(myquery);
  student=user;
  
}finally{

}
  res.json('updated');




});

app.post("/removeDept",async(req,res)=>{
  const arr = req.body;
  const val = arr.arr;
  console.log(val);
  console.log(arr);
  try{

    const db = client.db('data');
    const collection = db.collection('user');
    if(val){
    var myquery = {pos:'admin'}; 
    var newvalues = { $pull: { ['depts.'+'dept']: val } }

    await collection.updateOne(myquery, newvalues).then(res =>{
      console.log("dept removed");
      

  
  }).catch(err =>{
      console.log(err);
  });
  }}
  finally{

  }
  res.json('updated');
});

var dept='';
app.post("/adddept",async(req,res) =>{
  
  const dept1  = req.body;
  dept=dept1;
  console.log(dept);
  try{
    const db = client.db('data');
    const collection = db.collection('user');
    var myquery = {pos:'admin',depts: { $exists: true, $type: 'array'}}; 
    var newvalues = { $push: { ['depts'] :{$type:'array'}} };
    await collection.updateOne(myquery, newvalues).then(res =>{
      console.log("depts added");
      

  
  }).catch(err =>{
      console.log(err);
  });

  var myquery1 = {pos:'admin',['depts'+'.dept']: 'dept[0]' };
  var newvalues1 = { $set: { ['depts'+ '.dept.$']: dept['d'] } };
  
  let result = await collection.updateOne(myquery1, newvalues1);
             if (result.matchedCount === 0) {
                myquery1 = {pos:'admin' };
                newvalues1 = { $push: {  ['depts.'+'dept']: dept['d']} };
              }
               await   collection.updateOne(myquery1, newvalues1).then(res =>{
                      console.log("dept updated");
                      
          
                  }).catch(err =>{
                      console.log(err);
                  });
                
}finally{

}
  res.json('updated');
});

app.post("/adduser", async(req,res)=>{
  const {username,pass,pos,clas,name,item} = req.body;
  
  try{
   

    const db = client.db('data');
    const collection = db.collection('user');
    const user = await collection.findOne({ username, pass});
    if(user){
      res.status(401).json({ message: 'User already exists!' });
    }
    else{
      try{
        const us=[
          {
              "username": username,
              "password": pass,
              "name":name,
              "pos":pos,
              "dep":item,
              "class":clas
                
          }
      ]
      try {
        const insertManyResult = await collection.insertMany(us);
        const cursor1 = collection.find({ pos: { $in: ['teacher', 'student'] } });
        tusers=[];
        await cursor1.forEach(user => {
          tusers.push(user);
        });        
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
       
      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }

      }
      finally{
        
      }

    }

  }
  finally{
    console.log("user created");
  }
 res.json({message:'success'});
});

app.post("/assig", async(req, res) => {
  const {assig,date,date1,filenameWithSuffix,selectedValue} = req.body;
  try{
    const db = client.db('data');
    const collection = db.collection('user');
    for(const user of users){
      var myquery1 = {name:user.name, class:cls, ['assignment'+'.'+sub]: { $exists: false}}; 
      var newvalues1 = { $set: { ['assignment'+'.'+sub] :[]} };

      const res = await collection.updateOne(myquery1, newvalues1);
      console.log("assignment added");
  
      if(res.matchedCount === 0){
          await collection.updateOne(myquery1, newvalues1).then(res =>{
              console.log("assignment added");
          }).catch(err =>{
              console.log(err);
          });
      }
      
    var myquery = {name:user.name, class: cls,['assignment.'+ sub +'.upload']: date1 };
    var newvalues = { $set: { ['assignment.' + sub+'.$']: { date: date, value: assig, upload:date1,file:filenameWithSuffix,submit:selectedValue } } };
    
    let result = await collection.updateOne(myquery, newvalues);
                if (result.matchedCount === 0) {
                  myquery = {name:user.name,class: cls };
                  newvalues = { $push: {  ['assignment.' + sub]: { date: date, value: assig, upload:date1,file:filenameWithSuffix,submit:selectedValue }} };

                }
                 await   collection.updateOne(myquery, newvalues).then(res =>{
                        console.log("assig updated");
                        console.log(filenameWithSuffix);
                        
            
                    }).catch(err =>{
                        console.log(err);
                    });
                  }
  }finally{

  }
  res.json({message:'success'});
});

app.post("/notify", async(req, res) => {
  const {input,date} = req.body;
  try{
    const db = client.db('data');
    const collection = db.collection('user');
   

    
        

    
  
    
    var myquery = {['notifications']:{$type: 'array'},['notifications.' +'date']: date };
    var newvalues = { $set: { ['notifications'+'.$']: { date: date, value: input } } };
    
    let result = await collection.updateOne(myquery, newvalues);
                if (result.matchedCount === 0) {
                  myquery = {['notifications']:{$type: 'array'}};
                  newvalues = { $push:  {['notifications']:{ date: date, value: input } }};
                }
                 await   collection.updateOne(myquery, newvalues).then(res =>{
                        console.log("notification updated");
                        
            
                    }).catch(err =>{
                        console.log(err);
                    });
                  
  }finally{

  }
  res.json({message:'success'});
});
app.get("/notifications",async function(req,res){
  const db = client.db('data');
    const collection = db.collection('user');
  let nf=  await collection.findOne({notifications:{$type: 'array'}}).catch(err =>{
    console.log(err);
});
  res.json(nf);

});
var sub='';
var cls='';
app.post("/updateusers",async(req,res)=>{
  const { jsonData } = req.body;
  async function run(){
  try{ 
    if(jsonData){
      console.log('yes');
      const db = client.db('data');
      const collection = db.collection('user');
      const obj = JSON.parse(jsonData);
      for (const item of obj) {
      
         const username= item['Name']+'_'+item['Roll No'];
         const password =  item['Roll No']+'_'+item['Name'];
         
            const user = await collection.findOne({ username, password});
            if(user){
              res.status(401).json({ message: 'User already exists!' });
            }
            else{
              try{
                const us=[
                  {
                      "username": username,
                      "password": password,
                      "name":item['Name'],
                      "pos":item['Position'],
                      "dep":item['Department'],
                      "class":item['Class'],
                      "rollno":item['Roll No']
                        
                  }
              ]
              try {
                const insertManyResult = await collection.insertMany(us);
                const cursor1 = collection.find({ pos: { $in: ['teacher', 'student'] } });
                tusers=[];
                await cursor1.forEach(user => {
                  tusers.push(user);
                });        
                console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
               
              } catch (err) {
                console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
              }
        
              }
              finally{
                
              }
        
            
      }
         
        
      }
                  
    }

  }finally{

  }
  res.json({message:'success'});

} 
 run().catch(console.dir);

});
app.post("/updateatt", async(req, res) => {
    const { date, selectedValues,jsonData } = req.body;
    async function run(){
    try{
            console.log('yes');
            const db = client.db('data');
            const collection = db.collection('user');

            if(date && selectedValues){
            for(const Rollno in selectedValues){
                console.log(sub);
                for(const user of users){
                  var myquery1 = {name: user.name, class: cls, ['attendance'+'.'+sub]: { $exists: false }}; 
                  var newvalues1 = { $set: {['attendance'+'.'+sub] : [] }};
              
                  const res = await collection.updateOne(myquery1, newvalues1);
                  console.log("attendance added");
              
                  if(res.matchedCount === 0){
                      await collection.updateOne(myquery1, newvalues1).then(res =>{
                          console.log("attendance added");
                      }).catch(err =>{
                          console.log(err);
                      });
                  }
              

    
   
  }
                var myquery = { classroll: Rollno,class:cls,['attendance.'+ sub +'.date']: date };
                var newvalues = { $set: { ['attendance.' + sub+'.$']: { date: date, value: selectedValues[Rollno] } } };
                let result = await collection.updateOne(myquery, newvalues);
                if (result.matchedCount === 0) {
                  myquery = {classroll: Rollno, class:cls};
                  newvalues = { $push: {  ['attendance.' + sub]: { date: date, value: selectedValues[Rollno] }} };
                }
                 await   collection.updateOne(myquery, newvalues).then(res =>{
                        console.log(Rollno);
                        console.log("1 document updated");
                        
            
                    }).catch(err =>{
                        console.log(err);
                    });
              
            }}
            else{
                const obj = JSON.parse(jsonData);
for (const item of obj) {

   
    for (const key in item) {
        if(key !=='Name'){
            var myquery = { name:item['Name'],['attendance.'+ sub +'.date']: key };
            var newvalues = { $set: { ['attendance.' + sub+'.$']: { date: [key], value:item[key] } } };
            let result = await collection.updateOne(myquery, newvalues);
        if (result.matchedCount === 0) {
            myquery = {name:item['Name']};
            if(item[key]==='P'){
            newvalues = { $push: {  ['attendance.' + sub]: { date: key, value:'Present' }} };
        }
            else if (item[key]==='A'){
                newvalues = { $push: {  ['attendance.' + sub]: { date: key, value:'Absent' }} };

            }
    }
         await   collection.updateOne(myquery, newvalues).then(res =>{
                console.log("1 document updated");
                
    
            }).catch(err =>{
                console.log(err);
            });
            
    }
}
   
  
}
            }
        }
        
        finally{

        }
        res.json({message:'success'});

    } 
       run().catch(console.dir);

});

app.post("/updatemark", async(req, res) => {
    const {series, selectedValues,jsonData } = req.body;
    async function run(){
    try{
            console.log('yes');
            const db = client.db('data');
            const collection = db.collection('user');
            for(const user of users){
              var myquery1 = {name: user.name, class: cls, ['sessionals'+'.'+sub]: { $exists: false }}; 
              var newvalues1 = { $set: {['sessionals'+'.'+sub] : [] }};
          
              const res = await collection.updateOne(myquery1, newvalues1);
              console.log("sessionals added");
          
              if(res.matchedCount === 0){
                  await collection.updateOne(myquery1, newvalues1).then(res =>{
                      console.log("sessionals added");
                  }).catch(err =>{
                      console.log(err);
                  });
              }
          



}
            if( selectedValues){
            for(const Rollno in selectedValues){
                console.log('no');
                var myquery = { classroll: Rollno,class:cls,['sessionals.'+ sub+'.series']: series };
                var newvalues = { $set: { ['sessionals.' + sub+'.$']: { series: series, value: selectedValues[Rollno] } } };
                let result = await collection.updateOne(myquery, newvalues);
                if (result.matchedCount === 0) {
                  myquery = {classroll: Rollno ,class:cls};
                  newvalues = { $push: {  ['sessionals.' + sub]: { series: series, value: selectedValues[Rollno] }} };
                }
                 await   collection.updateOne(myquery, newvalues).then(res =>{
                        console.log(Rollno);
                        console.log("1 document updated");
                        
            
                    }).catch(err =>{
                        console.log(err);
                    });
              
            }}
            else{
                const obj = JSON.parse(jsonData);
for (const item of obj) {

   
    for (const key in item) {
        if(key !=='Name'){
            var myquery = { name:item['Name'],['sessionals.'+ sub +'.series']: key };
            var newvalues = { $set: { ['sessionals.' + sub+'.$']: { series: key, value:String(item[key]) } } };
            let result = await collection.updateOne(myquery, newvalues);
        if (result.matchedCount === 0) {
            myquery = {name:item['Name']};
            newvalues = { $push: {  ['sessionals.' + sub]: { series: key, value:String(item[key]) }} };
        
          
    }
         await   collection.updateOne(myquery, newvalues).then(res =>{
                console.log("1 document updated");
                
    
            }).catch(err =>{
                console.log(err);
            });
            
    }
}
   
  
}
            }
        }
        
        finally{

        }
        res.json({message:'success'});

    } 
       run().catch(console.dir);

});
app.get("/api", (req, res) => {
    res.json({ message: "serverconnected" });
});



app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
}       run().catch(console.dir);
