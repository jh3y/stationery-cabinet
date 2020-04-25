const {
  React: { Fragment, useReducer, useRef, useEffect },
  ReactDOM: { render },
  PropTypes: T,
} = window

const STORAGE_KEY = 'jh3y-bear-todos'
const PEN_COLORS = [
  'hsl(0, 100%, 30%)',
  'hsl(90, 100%, 30%)',
  'hsl(210, 100%, 30%)',
  'hsl(0, 0%, 0%)',
]
const ROOT_NODE = document.getElementById('app')

const INITIAL_STATE = window.localStorage.getItem(STORAGE_KEY)
  ? JSON.parse(window.localStorage.getItem(STORAGE_KEY))
  : {
      todos: [],
      completion: 1,
    }

const ACTION_KEYS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  COMPLETE: 'COMPLETE',
}
// Return completion status
const getCompletion = todos => {
  if (todos.length === 0) return 1
  const completedTodos = todos.filter(todo => todo.complete).length
  return completedTodos / todos.length
}
const TODOS_REDUCER = (state, action) => {
  let newTodos
  switch (action.type) {
    case ACTION_KEYS.ADD:
      newTodos = [
        {
          id: Date.now(),
          label: action.label,
          complete: false,
          angle: -5 + Math.random() * 10,
          skew: -50 + Math.random() * 100,
          color: PEN_COLORS[Math.floor(Math.random() * PEN_COLORS.length)],
          width: 90 + Math.random() * 20,
          offset: -15 + Math.random() * 80,
        },
        ...state.todos,
      ]
      break
    case ACTION_KEYS.REMOVE:
      newTodos = [...state.todos.filter(({ id }) => id !== action.id)]
      break
    case ACTION_KEYS.COMPLETE:
      newTodos = [
        ...state.todos.map(todo =>
          todo.id === action.id ? { ...todo, complete: !todo.complete } : todo
        ),
      ]
      break
    default:
      newTodos = state.todos
  }
  return {
    ...state,
    // Used so we know to add a smiley when tasks are complete
    dirty: true,
    todos: newTodos,
    completion: getCompletion(newTodos),
  }
}

const Todo = ({ id, label, complete, toggleComplete, onRemove, style }) => {
  return (
    <li className="notepad__item" style={style}>
      <input
        id={`${id}--checkbox`}
        type="checkbox"
        title="Enter a task"
        checked={complete}
        onChange={toggleComplete}
      />
      <label
        title={`${complete ? 'Restart' : 'Finish'} task`}
        className={`todo__label ${complete ? 'todo__label--complete' : ''}`}
        htmlFor={`${id}--checkbox`}>
        <span>{label}</span>
      </label>
      <button
        title="Remove task"
        className="todo__remove"
        type="button"
        onClick={onRemove}>
        Remove
      </button>
    </li>
  )
}
Todo.propTypes = {
  complete: T.bool,
  id: T.number,
  label: T.string,
  toggleComplete: T.func,
  onRemove: T.func,
  style: T.object,
}

const App = () => {
  const [state, dispatch] = useReducer(TODOS_REDUCER, INITIAL_STATE)
  const inputRef = useRef(null)
  const addTodo = e => {
    e.preventDefault()
    dispatch({ type: ACTION_KEYS.ADD, label: inputRef.current.value })
    inputRef.current.value = ''
  }
  const onRemove = id => () => {
    dispatch({
      type: ACTION_KEYS.REMOVE,
      id,
    })
  }
  const toggleComplete = id => e => {
    e.stopPropagation()
    dispatch({
      type: ACTION_KEYS.COMPLETE,
      id,
    })
  }

  // localStorage effect
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, state.todos])

  return (
    <Fragment>
      <form className="notepad" onSubmit={addTodo}>
        <div className="notepad__header">
          {new Array(6).fill().map((ring, index) => (
            <div key={`ring--${index}`} className="notepad__ring" />
          ))}
        </div>
        <input
          className="notepad__input"
          placeholder="Do what?"
          type="text"
          // onKeyPress={addTodo}
          required={true}
          ref={inputRef}
        />
        {/* <button type="submit">Add Todo</button> */}
        <ul className="notepad__items">
          {/** Draw a smiley if there are no todos but there have been todos */}
          {/* state.todos.length === 0 && <h1>You've got nothing to do!</h1> */}
          {state.dirty &&
            state.completion === 1 &&
            state.todos.length === 0 && <h1>You did it!</h1>}
          {state.todos.map(todo => {
            return (
              <Todo
                key={todo.id}
                id={todo.id}
                style={{
                  '--angle': todo.angle,
                  '--skew': todo.skew,
                  '--color': todo.color,
                  '--width': todo.width,
                  '--offset': todo.offset,
                }}
                complete={todo.complete}
                toggleComplete={toggleComplete(todo.id)}
                onRemove={onRemove(todo.id)}
                label={todo.label}
              />
            )
          })}
        </ul>
      </form>
      <div className="bear">{`\u{1F43B}`}</div>
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
