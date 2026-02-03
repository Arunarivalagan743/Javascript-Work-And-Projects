const todoList = [];
const add =  document.querySelector(".submit");
add.addEventListener('click',()=>{
    addTodo();
})
document.body.addEventListener('keydown',(event)=>{
    if(event.key ==="Enter")
    {
        addTodo();
    }
    console.log(event.key);
    
})


function addTodo() {
    const name = document.querySelector('.todo-name').value;
    const date = document.querySelector('.todo-date').value;

    if (name === '' || date === '') return;

    todoList.push({
        name: name,
        date: date
    });

    document.querySelector('.todo-name').value = '';
    document.querySelector('.todo-date').value = '';

    renderTodo();
}

function renderTodo() {
    let todoListHtml = '';

    todoList.forEach((todo, index) => {
        let html = `
            <div>${todo.name}</div>
            <div>${todo.date}</div>
            <button class="delete-button">Delete</button>
        `;
        todoListHtml += html;
    });
    document.querySelector('.todolist').innerHTML = todoListHtml;
     document.querySelectorAll('.delete-button').forEach((value,index)=>{
  value.addEventListener('click',()=>{
    todoList.splice(index,1);
    renderTodo();
  })
     })
}
