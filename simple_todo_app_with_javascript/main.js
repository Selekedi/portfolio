const wrapper = document.getElementById("wrapper")
const modal = document.getElementById("modal")

let tasks = initializeLocalStorage("tasks",null)

populateTasks()


function populateTasks(){
    if(!tasks){
        const createNewTaskHtml = `
        <h2>You Have No Tasks</h2>
        <button onclick= "openModal('create')">Add Task</button>
        `
        wrapper.innerHTML = createNewTaskHtml
    }else {
        const addTask = `<div class= "add-btn-container">
        <button onclick= "openModal('create')">Add New Task</button>
        </div>`
        const articles = Object.entries(tasks).map(([key,value]) => `
        <article onclick = openModal('view','${key}')>
            <p>${value}</p>
        </article>
        `).join("")

        wrapper.innerHTML = addTask + articles
    }

}



function openModal(type,id){
    if(type === "create"){
        const modalContents = `
            <h2>Create New Task</h2>
            <textarea cols = "30" row = "2" placeholder = "write here ..."></textarea>
            <div class = "controls">
            <button class = "cancel-btn" onclick = "closeModal()">Cancel </button>
            <button class = "add-btn" onclick = "createTask()">Add Task </button>
            </div>
        `
        modal.innerHTML = modalContents
        modal.classList.add("show")
    }else if(type === "view"){
        const content = `
            <h2>Task ${id}</h2>
            <p>${tasks[id]}</p>
            <div class = "controls">
            <button class= "cancel-btn" onclick= "closeModal()">Close</button>
            <button class = "edit-btn" onclick= "openModal('edit','${id}')">Edit</button>
            <button class = "delete-btn" onclick= "deleteTask('${id}')">Delete Task</button>
            </div>
        `
        modal.innerHTML = content
        modal.classList.add("show")
    }else if(type === "edit"){
        const content = `
            <h2>Edit Task ${id}</h2>
            <textarea cols = "30" row = "2">${tasks[id]}</textarea>
            <div class = "controls">
            <button class = "cancel-btn" onclick= "closeModal()">Close</button>
            <button class = "edit-btn" onclick= "editTask('${id}')">Edit</button>
            </div>
        `
        modal.innerHTML = content
    }
    
}

function closeModal(){
    modal.classList.remove("show")
    modal.innerHTML = ""
}

function createTask(){
    const text = modal.querySelector("textarea").value
    createTodoArticle(text)
    closeModal()
}

function createTodoArticle(task){
    if(tasks == null){
        tasks = updateLocalStorage("tasks",{"1":String(task)})
    }else {
        const newtasksObject = tasks
        const keys = Object.keys(newtasksObject)
        const newKey = Number(keys[keys.length - 1]) + 1
        newtasksObject[String(newKey)] = String(task)
        tasks = updateLocalStorage("tasks",newtasksObject)
    }
    populateTasks()
}

function editTask(id){
    const newText = modal.querySelector("textarea").value
    const newtasksObject = tasks
    newtasksObject[id] = newText
    tasks = updateLocalStorage("tasks",newtasksObject)
    populateTasks()
    closeModal()
}

function deleteTask(id){
    const newtasksObject = tasks
    delete newtasksObject[id]
    if(Object.entries(newtasksObject).length <= 0){
        tasks = updateLocalStorage("tasks",null)
    }else {
        tasks = updateLocalStorage("tasks",newtasksObject)
    }
    
    populateTasks()
    closeModal()
}
function initializeLocalStorage(key,value){
    if(!localStorage.getItem(key)){
        localStorage.setItem(key,JSON.stringify(value))
    }

    return JSON.parse(localStorage.getItem(key))
}

function updateLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value))
    return JSON.parse(localStorage.getItem(key))
}



