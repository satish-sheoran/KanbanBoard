// 1.new added task delete nhi ho rha h 

// getting primary color
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
    .getPropertyValue('--primary-color').trim();

// getting all the elems
// const tasks = document.querySelectorAll('.task');
const ToDoElem = document.querySelector('#To-Do');
const ProgressElem = document.querySelector('#Progress');
const CompletedElem = document.querySelector('#Completed');
const taskColumns = document.querySelectorAll('.task-column');
const addTaskBtn = document.querySelector('#addTask');

let allTasks = JSON.parse(localStorage.getItem('Tasks')) || [];


// initialising the task which is being dragged
let draggingItem;

// Task loader in HTML and this is main fn. 
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

TaskLoader();


/* adding drag events to tasks */
function addDragStartEventOnTasks() {
    const allTheTasks = document.querySelectorAll('.task');
    allTheTasks.forEach(task => {
        task.addEventListener('dragstart', (e) => {
            draggingItem = e.target;
        });
    })
}


/* save to local storage fn */
function saveToLocal() {
    localStorage.setItem('Tasks', JSON.stringify(allTasks))
}

/* adding dragenter and dragleave event on all task columns */
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
        saveToLocal(); //saving it in local storage

    })
}
addEvntToCols(ToDoElem)
addEvntToCols(ProgressElem)
addEvntToCols(CompletedElem)

//delete button working
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
                saveToLocal(); //uplaoding changes to local storage
            }
            e.target.closest('.task').remove();
        })
    })
}



/* new task add related */
const addNewTaskBtn = document.querySelector('#addNewTask');
const newtaskContainer = document.querySelector('.newtaskContainer');
const modalBg = document.querySelector('.modalBg');


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
    saveToLocal();
    title.value = '';
    desc.value = '';
    addDragStartEventOnTasks();
    deleteBtnEvntAdder();
    newtaskContainer.classList.remove('active');

})
/**New Task add Related */
