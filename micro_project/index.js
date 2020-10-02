var express = require('express');

const app = express();

const body_parser = require('body-parser');

let server = require('./server.js');
let middle_ware = require('./middleware.js');

// app.use(body_parser.urlencoded({extended :true}));
// app.use(body_parser.json());

const MongoClient = require('mongodb');
const Url = 'mongodb://localhost:27017';
const db_Name = 'hospitalInventory';
let db;
MongoClient.connect(Url , {useUnifiedTopology : true} , (err ,client) =>{
    if(err)return console.log(err);
    console.log("Connected...!");
    db = client.db(db_Name);
});

app.get('/Hospital_details' , async (req , res) => {
    console.log("hospital details are fetching....");
    var result = await db.collection('hospital').find().toArray();
    res.json(result);
    console.log(result);
});

app.get('/Ventilator_details' , async (req , res) => {
    try{
        console.log("Ventilators details are fetching....");
        var result = await db.collection('ventilators').find().toArray();
        res.json(result);
        console.log(result);
    }
    catch(err){
        res.json(err);
    }
});

app.post('/search_vent_by_status' , async (req ,res) =>{
    try{
        var h = req.body.status;
        var Ventilator_details = await db.collection('ventilators').find({"status":h}).toArray();
        res.json(Ventilator_details);
        console.log(Ventilator_details);
    }
    catch(err){
        res.send(err);
    }
});

app.post('/search_vent_by_name' , async (req ,res) =>{
    try{
        var h = req.body.name;
        var Ventilator_details = await db.collection('ventilators').find({"name":h}).toArray();
        res.json(Ventilator_details);
        console.log(Ventilator_details);
    }
    catch(err){
        res.send(err);
    }
});

app.post('/Update_ventilator' , async(req ,res) =>{
    try{
        var vent_id={ventilatorid :req.body.ventilatorid};
        console.log(vent_id);
        var new_values={ $set :{ status:"unoccupied"}};
        db.collection("ventilators").updateOne(vent_id,new_values,function(err,result){
            if(err) throw err;
            console.log("Updated");
            res.json("updated");
        });
    }
    catch(err){
        res.send(err);
    }
})

app.post('/add_ventilator' , (req ,res) =>{
    var hid = req.body.hid;
    var vid = req.body.ventilatorid;
    var st = req.body.status;
    var na = req.body.name;
    var item={hid:hid,ventilatorid:vid,status:st,name:na};
    db.collection("ventilators").insertOne(item,function(err,result){
		if(err) throw err;
		console.log("inserted");
		res.json("Inserted");
	});


});

app.post('/deleted' , async (req ,res) =>{
    try{
        var id = req.body.ventilatorid;
        var query = {ventilatorid : id};
        var del = await db.collection('ventilators').deleteOne(query);
        console.log(del);
        res.json(del);
    }
    catch(err){
        res.send(err);
    }
});

app.listen(8080 , () =>{
    console.log("Started on port : 8080");
});