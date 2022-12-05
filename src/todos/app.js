import html from './app.html?raw';
import todoStore,{Filters} from '../store/todo.store';
import {renderTodos,renderPending} from './use-cases';

const ElementIDs={
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */

export const App=(elementId)=>{
    const displayTodos=()=>{
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList,todos);
        updatePendingCount();
    }
    const updatePendingCount = ()=>{
            renderPending(ElementIDs.PendingCountLabel);
    }
//cuando la funcion APP( ) se llama
(()=>{
    const app=document.createElement('div');
    app.innerHTML=html;
    document.querySelector(elementId).append(app);
    displayTodos();
})();
//referencias HTML
const newDescripcionInput = document.querySelector(ElementIDs.NewTodoInput)
const todoListUL = document.querySelector(ElementIDs.TodoList);
const clearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
const filtersLIs =document.querySelectorAll(ElementIDs.TodoFilters);
//listeners
newDescripcionInput.addEventListener('keyup',(event)=>{
    if(event.keyCode !==13) return;
    if(event.target.value.trim().length===0) return ;
    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value="";
});

todoListUL.addEventListener('click',(event)=>{
    const element= event.target.closest('[data-id]');
    todoStore.toggleTodo(element.getAttribute('data-id'));
    displayTodos();
});

todoListUL.addEventListener('click',(event)=>{
    const element= event.target.closest('[data-id]');
    const isDestroyElement=event.target.className==='destroy';
if(!element || !isDestroyElement)return;

    todoStore.deleteTodo(element.getAttribute('data-id'));
    displayTodos();
});

clearCompletedButton?.addEventListener('click',()=>{
    todoStore.deleteCompleted();
    displayTodos();
})

filtersLIs.forEach(elemento=>{
    elemento.addEventListener('click',(element)=>{
        filtersLIs.forEach(el=>el.classList.remove('selected'));
        element.target.classList.add('selected'); 
        switch(element.target.text){
            case 'Todos':
                todoStore.setFilter(Filters.All)
                break;
        case 'Pendientes':
            todoStore.setFilter(Filters.Pending)
            break;
            case 'Completados':
                todoStore.setFilter(Filters.Completed)
                break;
        }
        displayTodos();
    })
})
}