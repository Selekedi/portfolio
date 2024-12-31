const container = document.getElementById("container")
const modal = document.getElementById("modal")
const hostUrl = "http://127.0.0.1:5000"

let tasks = JSON.parse(localStorage.getItem("tasks"))



//let tasks = JSON.parse(localStorage.getItem("tasks"))
window.addEventListener("DOMContentLoaded", async e => {
    let count = 0
    while(!tasks && count < 5){
        await saveTasksToLocatStorage()
        tasks = JSON.parse(localStorage.getItem("tasks")) 
        count++
    }
    if(!tasks){
        console.log("couldnt resolve tasks");
        alert("couldnt resolve tasks, contact us so we can attend to the issue")
    }
    populateTasks()
    await getTasks()
})

function populateTasks(){
    if(tasks === "empty"){
        const noTasks = `
        <div id = "no-tasks-container">
            <h2>
                You Have No Tasks
            </h2>
            <button class = "add-btn" onclick = "openModal('create')">Create Task</button>
        </div>
        `
        container.innerHTML = noTasks
    }else {
        const addTasks = `
            <div id = "add-tasks">
                <button class = "add-btn" onclick = "openModal('create')">Add Task</button>
            </div>
        `
        const articles = Object.entries(tasks).map(([id,task]) => `
            <article onclick = "openModal('view','${id}')">
                ${task}
            </article>
        `).join("")
        container.innerHTML = addTasks + articles
    }

}

function openModal(type,id){
    if(type === "create"){
        const createView = `
        <div id = "create-view">
            <textarea col = "30" row = "2" placeholder ="Write here"></textarea>
            <div class = "controls">
                <button onclick = "closeModal()">Close</button>
                <button class = "add-btn" onclick = "createTask()">Create New Task</button>
            </div>
        </div>`
        modal.innerHTML = createView
    }else if(type === "view"){
        const view = `
            <div id = "view-container">
                <h2>
                    Task ${id}
                </h2>
                <p>${tasks[id]}</p>
                <div class = "controls">
                    <button class = "close-btn" onclick = "closeModal()">close</button>
                    <button class = "edit-btn" onclick = "openModal('edit','${id}')">edit</button>
                    <button class = "delete-btn" onclick = "openModal('delete','${id}')">Delete</button>
                </div>
            </div>
        `
        modal.innerHTML = view
    }else if(type === "edit"){
        const editView = `
            <div id ="edit-container">
                <h2>Edit Task ${id}</h2>
                <textarea col = "30" row = "2" placeholder ="Write here">${tasks[id]}</textarea>
                <div class = "controls">
                        <button class = "close-btn" onclick = "closeModal()">close</button>
                        <button class = "edit-btn" onclick = "editTask('${id}')">edit</button>
                </div>
            </div>
        `
        modal.innerHTML = editView
    }else if (type === "delete"){
        const deleteView = `
        <div id = "delete-container">
            <h2>Delete Task ${id}</h2>
            <p>Are you sure You want to delete the task</p>
            <div class = "controls">
                <button class = "close-btn" onclick = "closeModal()">No</button>
                <button class = "delete-btn" onclick = "deleteTask('${id}')">Yes, Delete</button>
            </div>
        </div>
        `
        modal.innerHTML = deleteView
    }
    modal.classList.add("show")
}

function closeModal(){
    modal.classList.remove("show")
    modal.innerHTML = ""
}

async function createTask(){
    const task = modal.querySelector("textarea").value
    if(!tasks){
        alert("write something")
        return
    }
    try {
        const response = await fetch("task",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({task})
        })
        if(!response.ok){
            alert("couldnt edit because of network issues")
            return
        }
        const responseData = await response.json()
        if(!responseData.created){
            alert("couldnt create booking because of server issues")
            return
        }
        await saveTasksToLocatStorage()
        tasks = JSON.parse(localStorage.getItem("tasks"))
        populateTasks()
        closeModal()
    } catch (error) {
        alert("failed to create booking, try again")
    }
}

async function editTask(id) {
    const task = modal.querySelector("textarea").value
    if(!task || task === tasks[id]){
        closeModal()
        return
    }
    try {
        const response = await fetch("task",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({task,id})
        })
        if(!response.ok){
            alert("couldnt edit because of network issues")
            return
        }
        const responseData = await response.json()
        if(!responseData.edited){
            alert("couldnt edit because of server issues")
            return
        }
        await saveTasksToLocatStorage()
        tasks = JSON.parse(localStorage.getItem("tasks"))
        populateTasks()
        closeModal()
    } catch (error) {
        alert("couldnt edit tasks, try again")
        return
    }
    
}

async function deleteTask(id) {
    try {
        const response = await fetch("task",{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({id})
        })
        if(!response.ok){
            alert("couldnt delet bookinge because of")
            return
        }
        const responseData = await response.json()
        if(!responseData.deleted){
            alert("couldnt delete because of server issues,try again")
            return
        }
        await saveTasksToLocatStorage()
        tasks = JSON.parse(localStorage.getItem("tasks"))
        populateTasks()
        closeModal()
    } catch (error) {
        alert("couldnt delete task because of network issues")
        return
    }
}

async function getTasks(){
    try {
        const response = await fetch("tasks")
        if(!response.ok){
            console.log("network error")
            return false
        }

        const data = await response.json()

        if(!data.items){
            console.log(data.items)
            return false
        }
        return data.items
    } catch (error) {
        return false
    }
}

async function saveTasksToLocatStorage(){
    try {
        const tasks = await getTasks()
        if(!tasks){
            localStorage.setItem("tasks",JSON.stringify(null))
            return 
        }
        if(tasks.length === 0){
            localStorage.setItem("tasks",JSON.stringify("empty"))
            return
        }

        const tasksObject = {}
        for(const task of tasks){
            tasksObject[task.id] = task.task
        }
        localStorage.setItem("tasks",JSON.stringify(tasksObject))
        
    } catch (error) {
        console.error(error)
        return false
    }
}






