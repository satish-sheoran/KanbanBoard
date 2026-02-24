// 1. add count of task

// getting primary color
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
    .getPropertyValue('--primary-color').trim();

// getting All COLUMNS, New Task Button
const ToDoElem = document.querySelector('#To-Do'); //TO-DO column
const ProgressElem = document.querySelector('#Progress'); //Progress Column
const CompletedElem = document.querySelector('#Completed'); //Complete Column
const addTaskBtn = document.querySelector('#addTask'); //Add New Task Button

let allTasks = JSON.parse(localStorage.getItem('Tasks')) || []; //All Tasks


// initialising Current Dragging Task
let draggingItem;

/* save to local storage FN */
function saveToLocal(Tasks) {
    localStorage.setItem('Tasks', JSON.stringify(Tasks))
}

/* FN which Add DragStartEvent On All Tasks */
function addDragStartEventOnTasks() {
    document.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragstart', (e) => {
            draggingItem = e.target;
        });
    })
}


/* FN which adds DragEnter,DragLeave,DragOver,Drop Events Listeners on All COlumns */
function addEvntToCols(col) {
    col.addEventListener('dragenter', (e) => {
        e.preventDefault();
        col.style.border = `2px dotted ${primaryColor}`
        col.style.transform = 'scale(1.05)'
    });

    col.addEventListener('dragleave', (e) => {
        e.preventDefault();
        col.style.border = `2px dotted transparent`
        col.style.transform = 'scale(1)'
    });
    // writing it so that our browser allows dropping
    col.addEventListener("dragover", (event) => {
        // prevent default to allow drop
        event.preventDefault();
    });
    col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.appendChild(draggingItem);
        col.style.border = `2px dotted transparent`
        col.style.transform = 'scale(1)';
        let currTask = allTasks.find(task => task.title === draggingItem.children[0].innerText && task.desc === draggingItem.children[1].innerText); //getting the task which is being dragged
        currTask.col = col.getAttribute('id'); //setting up the column in which it is dropped
        saveToLocal(allTasks); //saving it in local storage

    })
}
// instant adding Event Listener To All COLUMNS
addEvntToCols(ToDoElem)
addEvntToCols(ProgressElem)
addEvntToCols(CompletedElem)

/* FN which adds Delete Functionality to All DELETE BUTTONS */
function deleteBtnEvntAdder() {
    const deleteBtn = document.querySelectorAll('.delete');

    deleteBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const task = e.target.closest('.task'); // task which is being deleted
            const title = task.children[0].innerText;
            const desc = task.children[1].innerText;
            const col = (task.closest('.task-column')).getAttribute('id'); //getting the column in which task is (completed/progress/ToDo)

            /* Finding that item in allTasks*/
            const index = allTasks.findIndex(taskItem =>
                taskItem.title === title &&
                taskItem.desc === desc &&
                taskItem.col === col
            );

            if (index !== -1) {
                allTasks.splice(index, 1);
                saveToLocal(allTasks); //uplaoding changes to local storage
                task.remove();
            }
            return;
        })
    })
}

/* Main FN which Loads All Tasks of Local Storage into HTML and Also Calls deleteBtnEvntAdder() and addDragStartEventOnTasks() which adds delete button Functionality and add DragStart Event Listener on Tasks Respectively */
function TaskLoader() {
    allTasks.map(({ title, desc, col }) => {

        const div = document.createElement('div');
        div.classList.add('task');
        div.setAttribute('draggable', 'true');

        div.innerHTML = `<h2>${title}</h2>
                    <p>${desc}</p>
                   <button class="delete">Delete</button>`;
        document.querySelector(`#${col}`).appendChild(div);
    })
    addDragStartEventOnTasks(); //now add drag event to all these tasks
    deleteBtnEvntAdder(); //delete button working
}
TaskLoader(); // calling istantly




/* ADDING NEW TASK RELATED LOGIC STARTS HERE : */
const addNewTaskBtn = document.querySelector('#addNewTask'); //adding the Task Btn
const newtaskContainer = document.querySelector('.newtaskContainer'); //container 
const modalBg = document.querySelector('.modalBg'); // basically a layer used for blur and cancel adding task


addTaskBtn.addEventListener('click', (e) => {
    newtaskContainer.classList.toggle('active')
})

modalBg.addEventListener('click', () => {
    newtaskContainer.classList.remove('active')
})

addNewTaskBtn.addEventListener('click', (e) => {
    const title = document.querySelector('.newTask-title');
    const desc = document.querySelector('.newTask-desc');

    // if title is empty
    if (title.value.trim() === '') {
        document.querySelector('.error-title').style.minHeight = "14px";
        document.querySelector('.error-title').textContent = "Title is required";
        return;
    }
    // next time if error have still styles , remove them if user enters title before clicking the add Task btn
    document.querySelector('.error-title').style.minHeight = "0px";
    document.querySelector('.error-title').textContent = '';

    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');


    div.innerHTML = `<h2>${title.value}</h2>
                    <p>${desc.value}</p>
                    <button class="delete">Delete</button>`;

    ToDoElem.appendChild(div);
    allTasks.push({ title: title.value, desc: desc.value, col: `${ToDoElem.getAttribute('id')}` })
    saveToLocal(allTasks);
    title.value = '';
    desc.value = '';
    addDragStartEventOnTasks();
    deleteBtnEvntAdder();
    newtaskContainer.classList.remove('active');

})
/* ADDING NEW TASK RELATED LOGIC ENDS HERE */
