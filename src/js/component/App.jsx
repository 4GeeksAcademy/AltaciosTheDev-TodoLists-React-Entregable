import React from "react"
import {useState, useEffect, useRef} from 'react'
import { nanoid } from "nanoid"

function App() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState(() => {
    const fromLocalStorage = localStorage.getItem("ITEMS")

    if(fromLocalStorage == null){
      return []
    }
    else{
      return JSON.parse(fromLocalStorage)
    }
  })

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

    localStorage.setItem("ITEMS", JSON.stringify(todos))
  },[todos])

  function handleSubmit(e){
    //0.always prevent default so it doesnt load page again. 
    e.preventDefault()

    //1. if something written, call add or edit.
    //    if(/^\s*$/.test(task) === false){}
      //2. if edit mode, call edit, else call add.
      if(edit.mode){
        editTodo()
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
      newTask = task
    }
    else{
      newTask = edit.task
    }
    let edittedTodo = {
      id: edit.id,
      task: newTask,
      completed: false,
      showDelete: false,
      edit: false
    }

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
      let newTodo = {
        id: nanoid(),
        task: task,
        completed: false,
        showDelete: false,
        edit: false
      }
      setTodos(prevTodos => {
        return [newTodo, ...prevTodos]
      })
    }

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

  function handleComplete(id, completed){
    setTodos(prevTodos => {
      return prevTodos.map(prevTodo => {
        return prevTodo.id === id ? {...prevTodo, completed: completed} : prevTodo
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
                <label htmlFor="item">New item</label>
                <input ref={inputRef} id="item" value={task} onChange={(e) => setTask(e.target.value)}/>
            </div>
            <button className="btn">Submit</button>
        </form>
        <h1 className="header">Todo List</h1>
        <ul className="list">

          {todos.length === 0 && "Nothing todo... do something with your life!"}

          {todos.map((todo) => { 
              return(
                  <li key={todo.id} className="itemWrapper" onMouseEnter={() => toggleShowDelete(todo.id)} onMouseLeave={() => toggleShowDelete(todo.id)}>
                    <label>
                        <input type="checkbox" checked={todo.completed} onChange={(e) => handleComplete(todo.id, e.target.checked)}/>
                        {todo.edit? "Write corrections above and submit..." : todo.task }
                    </label>
                    {todo.edit ? 
                      "" : 
                      <div className="item-controls">
                          <button className="btn btn-danger" onClick={() => handleDelete(todo.id)}>Delete</button>
                          {edit.mode === false && <button className="btn btn-warning" onClick={() => enterEditMode(todo.id, todo.task)}>Modify</button>}
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