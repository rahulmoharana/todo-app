import React from 'react'
import { useState,useRef } from 'react'
import axios from 'axios'
import { useEffect } from 'react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
    
import { SplitText } from "gsap/SplitText";


import './App.css'
const API = 'http://localhost:5000/api/todos'

gsap.registerPlugin(useGSAP,SplitText);





function App() {
  const [todos,setTodos]=useState([]);
  const[text,setText]=useState();
  const [editingId,setEditingId]=useState(null)
  console.log(todos);
  const logoref = useRef(null)
  
  

  const fetchData = async ()=>{
    const res = await axios.get(API)
    console.log(res);
    
    setTodos(res.data)

  }
  useEffect(()=>{
    let spilt = SplitText.create(logoref.current,{
  type:"chars",
})
    gsap.from(spilt.chars,{
  y:100,
  stagger:.05

})
fetchData()


gsap.from(".glass-card",{
  y:-100,
  opacity:0,
  stagger:0.1

})
    
  },[])

  const addOrupdatetodo = async(e)=>{
    e.preventDefault();
    if(editingId){
      await axios.put(`${API}/${editingId}`,{text})
      setEditingId(null)
    }else{
      await axios.post(API,{text})
    }
    setText('')
    fetchData()

  }

  const deleteTodo = async(id)=>{
    await axios.delete(`${API}/${id}`)
    fetchData()
  }
  const startEditing = (todo)=>{
    setEditingId(todo._id);
    setText(todo.text)

  }
  return (
    <div className="container">
      <nav>
        <h1 ref={logoref} className="head">Todo App.</h1>
        <form onSubmit={addOrupdatetodo}>
          <input
            type="text"
            value={text}
            placeholder="Enter a task"
            onChange={(e) => setText(e.target.value)}
          />
          <button className={editingId ? "upd-btn" : "add-btn"} type="submit">
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </nav>
      <div className="data">
        <ul>
       {todos.map(todo=>
        <li className='glass-card' key={todo._id}>
          {todo.text}
         <div className="btn">
           <button onClick={()=>startEditing(todo)} className='upd-btn'>Edit</button>
          <button onClick={()=>deleteTodo(todo._id)} className='dlt-btn'>Delete</button>

         </div>
        </li>
       )}
      </ul>
      </div>
    </div>
  );
}

export default App