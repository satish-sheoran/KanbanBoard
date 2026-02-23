// getting primary color
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
    .getPropertyValue('--primary-color').trim();

// getting all the elems
const tasks = document.querySelectorAll('.task');
const taskColumns = document.querySelectorAll('.task-column');
const deleteBtn = document.querySelectorAll('.delete');

// initialising the task which is being dragged
let draggingItem;

// adding drag events to tasks
tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        draggingItem = e.target;
    });
})

// adding dragenter and dragleave event on all task columns
taskColumns.forEach(col => {
    col.addEventListener('dragenter', (e) => {
        event.preventDefault();
        col.style.border = `2px dotted ${primaryColor}`
        col.style.transform = 'scale(1.05)'
    });

    col.addEventListener('dragleave', (e) => {
        event.preventDefault();
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
        e.target.appendChild(draggingItem);
        col.style.border = `2px dotted transparent`
        col.style.transform = 'scale(1)'
    })
});

//delete button working
deleteBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.task').remove();

    })
})