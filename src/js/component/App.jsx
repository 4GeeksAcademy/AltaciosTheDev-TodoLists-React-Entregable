import React from "react"
import {useState, useEffect, useRef} from 'react'
import { nanoid } from "nanoid"

function App() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([])

  //edit mode state will serve to indicate which function will be used in submit, either add or edit.
  const [edit, setEdit] = useState({
    mode:false,
    id: "",
    task: ""
  })

  const inputRef = useRef()

  useEffect(() => {
    console.log(todos)
    inputRef.current.focus()
  },[todos])

  function handleSubmit(e){
    //0.always prevent default so it doesnt load page again. 
    e.preventDefault()

    //1. if something SUBMITS, call add or edit.
    //    if(/^\s*$/.test(task) === false){}
      //2. if edit mode, call edit, else call add.
      if(edit.mode){
        //if edit mode
        //1.call edit function
        editTodo()
        //2.reset edit state values 
        setEdit({
          mode:false,
          id: "",
          task: ""
        })
      }
      else{
        addTodo()
      }
      //3. after, task is emptied.
      setTask("")

  }

  function editTodo(){ 
    let newTask = ""
    if(/^\s*$/.test(task) === false){
      //if input NOT empty or blank spaces, newTask = task(Value of input)
      newTask = task
    }
    //if task indeed was empty, newTask value = whatever was stored in edit.task(old value of task when clicked edit AND ENTERED EDIT MODE)
    else{
      newTask = edit.task
    }
    //new edittedTodo created: id from stored in edit, task was determined above, completed and show false, edit goes to false again.
    let edittedTodo = {
      id: edit.id,
      task: newTask,
      completed: false,
      showDelete: false,
      edit: false
    }

    //set todos again, map until you find the todo.id that matches the id stored in edit.id and OVERWRITE ONLY that one.
    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
        return prevTodo.id === edit.id ? edittedTodo : prevTodo
      })
    })
  }

  //
  function enterEditMode(id, task){
    //1)Whichever todo was responsible, will switch edit to TRUE.
    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
          return prevTodo.id === id ? {...prevTodo, edit: true} : prevTodo
      })
    })

    //2)any edit button will set the editMode = true
    setEdit({
      mode:true,
      id: id,
      task: task
    })
  }


  function addTodo(){
    if(/^\s*$/.test(task) === false){
      //1. create todo object if input has value
      let newTodo = {
        id: nanoid(),
        task: task,
        completed: false,
        showDelete: false,
        edit: false
      }
      //2.set todo array to everything and the newtodo
      setTodos(prevTodos => {
        return [newTodo, ...prevTodos]
      })
    }
    //if input empty just leave the function
    else {
      return
    }
  }

  function handleDelete(id){
    setTodos(prevTodos => {
      return prevTodos.filter(prevTodo => {
        return prevTodo.id !== id
      })
    })
  }

  function handleComplete(id, checkedValue){
    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
        return prevTodo.id === id ? {...prevTodo, completed: checkedValue} : prevTodo
      })
    })
  }

  function toggleShowDelete(id){
    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
        return prevTodo.id === id ? {...prevTodo, showDelete:!prevTodo.showDelete} : prevTodo
      })
    })
  }

  return (
    <>  
        <form className="new-item-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <label htmlFor="item" className="header">New item:</label>
                <input ref={inputRef} id="item" value={task} onChange={(e) => setTask(e.target.value)}/>
            </div>
            <button className="btn">Submit</button>
        </form>
        <h1 className="header header2">Todo List:</h1>
        <ul className="list">

          {todos.length === 0 && "Nothing todo... do something with your life!"}

          {todos.map((todo) => { 
              return(
                  <li key={todo.id} className="itemWrapper" onMouseEnter={() => toggleShowDelete(todo.id)} onMouseLeave={() => toggleShowDelete(todo.id)}>
                    <label>
                        {/* 1. checkbox only appears when individual edit for each todo is FALSE */}
                        {todo.edit === false && <input type="checkbox" checked={todo.completed} onChange={(e) => handleComplete(todo.id, e.target.checked)}/>}
                        {/* 2. if edit is TRUE, task will no longer be available, just a message indicating to write corrrections and SUBMIT */}
                        {todo.edit? "Write corrections above and submit..." : todo.task }
                    </label>
                    {todo.edit ? 
                      "" : 
                      <div className="item-controls">
                          <button className="btn btn-danger" onClick={() => handleDelete(todo.id)}>Delete</button>
                          {/* if edit is TRUE, NO BUTTONS CAN BE CLICKED, BUT THIS NEEDS TO BE GLOBAL.*/}
                          {edit.mode === false && <button className="btn btn-warning" onClick={() => enterEditMode(todo.id, todo.task)}>Edit</button>}
                      </div>
                    }
                  </li>
              )
          })}
        </ul>
    </>
  )
}

export default App