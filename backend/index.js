const express = require('express')
const app  = express()
const mongoose= require('mongoose')
const cors =require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGOURL).then(()=>console.log("db connected"))
.catch(err => console.error(err))

const TodoSchema = mongoose.Schema({
    text:String,
    completed:Boolean
})

const todo = mongoose.model('todo',TodoSchema);

app.get('/api/todos',async (req,res)=>{
    const todos  = await todo.find();
    res.json(todos)
})

app.post('/api/todos',async(req,res)=>{
    const {text}= req.body;
    const newTodo = new todo({text,completed:false})
    await newTodo.save()
    res.json(newTodo)

})
app.put('/api/todos/:id',async(req,res)=>{
    const{id}=req.params;
    const{text,completed}=req.body;
    const upadated = await todo.findByIdAndUpdate(id,{text,completed},{new:true})
    res.json(upadated)
})

app.delete('/api/todos/:id',async(req,res)=>{
    
    await todo.findByIdAndDelete(req.params.id)
    res.json('Deleted')
})
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`App running at port ${process.env.PORT}`);
    
})