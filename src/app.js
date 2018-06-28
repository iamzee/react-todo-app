import { createStore } from 'redux';
import uuidv1 from 'uuid/v1';

//-----------------------------------------------
//  ACTION GENERATORS----------------------------
//-----------------------------------------------

const addTodo = ({
  title = '',
  body = '',
  createdAt = 0,
  completedAt = 0,
  completed = false
} = {}) => ({
  type: 'ADD_TODO',
  todo: {
    id: uuidv1(),
    title,
    body,
    createdAt,
    completedAt,
    completed
  }
});

const removeTodo = id => ({
  type: 'REMOVE_TODO',
  id
});

const updateTodo = (id, updatedTodo) => ({
  type: 'UPDATE_TODO',
  id,
  updatedTodo
});

//-----------------------------------------------
//  STORE CONFIGURATION--------------------------
//-----------------------------------------------
const defaultState = [];
const store = createStore((state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat(action.todo);
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    case 'UPDATE_TODO':
      return state.map(todo => {
        if (todo.id === action.id) {
          return {
            ...todo,
            ...action.updatedTodo
          };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
});

store.subscribe(() => {
  console.log(store.getState());
});

const todo1 = store.dispatch(addTodo({ title: 'run', body: 'run 2km daily' }));
const todo2 = store.dispatch(addTodo({ title: 'homework' }));

store.dispatch(removeTodo(todo1.todo.id));

store.dispatch(
  updateTodo(todo2.todo.id, { body: 'last homework', completed: true })
);
