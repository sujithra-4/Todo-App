//using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//sample in memory storage for todo items
//let todos=[];
//connecting mongodb

mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("connected to mongodb")
})
.catch((err)=>{
    console.log("error connecting to mongodb", err);
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})
//creating model
const TodoModel = mongoose.model('Todo', todoSchema);

//create a new todo item
app.post('/todos',async (req,res)=>{
    const{title,description} =req.body;
    // const newTodo ={
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

try{
    const newTodo = new TodoModel({title,description});
    await newTodo.save();
    res.status(201).json(newTodo);
}
catch(error){
     console.log("error creating todo", error);
     res.status(500).json({message:"error creating todo"});
}
        

})

//get all items
app.get('/todos',async (req,res)=>{
    try{
      const todos = await TodoModel.find();
       res.json(todos);
    }
    catch(error){
        console.log("error fetching todos", error);
        res.status(500).json({message:"error fetching todos"});
    }
   
})


//update a todo item
app.put('/todos/:id',async(req,res)=>{
    try{
    const{title,description} = req.body;
    const id = req.params.id; 
    const updatedTodo =  await TodoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    );
    if(!updatedTodo){
        return res.status(404).json({message:"todo not found"})
    }
    res.json(updatedTodo)

}
catch(error){
     console.log("error fetching todos", error);
     res.status(500).json({message:"error fetching todos"});
}
})


//Delete a todo item
app.delete('/todos/:id',async(req,res)=>{
    try{
    const id = req.params.id;
    await TodoModel.findByIdAndDelete(id);
    res.status(204).end();
    }
    catch(error){
          console.log("error fetching todos", error);
        res.status(500).json({message:"error fetching todos"});
    }
})
    

//start the server
const PORT =process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log("server is running on port " + PORT);
})
