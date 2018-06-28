import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { database } from './firebase/configFirebase';

//-----------------------------------------------
//  ACTION GENERATORS----------------------------
//-----------------------------------------------

const addTodo = todo => ({
  type: 'ADD_TODO',
  todo
});

const startAddTodo = ({
  title = '',
  body = '',
  createdAt = 0,
  completedAt = 0,
  completed = false
} = {}) => {
  return dispatch => {
    const todo = { title, body, createdAt, completedAt, completed };
    database
      .ref('todos')
      .push(todo)
      .then(ref => {
        dispatch(
          addTodo({
            id: ref.key,
            ...todo
          })
        );
      });
  };
};

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
//  REDUCERS-------------------------------------
//-----------------------------------------------
const defaultState = [];
const todosReducer = (state = defaultState, action) => {
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
};

//-----------------------------------------------
//  STORE CONFIGURATION--------------------------
//-----------------------------------------------

const store = createStore(todosReducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log(store.getState());
});

//-----------------------------------------------
//  DISPATCH--------------------------
//----------------------------------------------

const todo1 = store.dispatch(
  startAddTodo({ title: 'run', body: 'run 2km daily' })
);
const todo2 = store.dispatch(startAddTodo({ title: 'homework' }));

// store.dispatch(removeTodo(todo1.todo.id));

// store.dispatch(
//   updateTodo(todo2.todo.id, { body: 'last homework', completed: true })
// );
