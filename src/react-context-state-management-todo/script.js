const { PropTypes, React, ReactDOM, uuid } = window
const { createContext, Component, Fragment } = React
const { render } = ReactDOM

// STORE
const store = createContext('todo-app')

// ACTIONS
const addTodo = dispatch => todo => dispatch({ type: 'ADD_TODO', todo })
const toggleTodo = dispatch => id => dispatch({ type: 'TOGGLE_TODO', id })

// REDUCER
const initialState = []
const todos = (state = initialState, action) => {
  if (!action) return state
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          complete: false,
          id: uuid(),
          todo: action.todo,
        },
      ]
    case 'TOGGLE_TODO':
      return state.map(
        i => (i.id === action.id ? { ...i, complete: !i.complete } : i)
      )

    default:
      return state
  }
}

const reducers = {
  todos,
}

/**
 * Context Managment code
 */
const Provide = (Wrapped, reducers = {}) =>
  class Provided extends Component {
    getReducedState = action => (state = {}) => {
      const newState = Object.entries(reducers).reduce(
        (result, [key, reduce]) => {
          result[key] = reduce(state[key], action)
          return result
        },
        {}
      )
      return newState
    }
    mapDispatchToActions = actions =>
      Object.entries(actions).reduce((acc, [key, value]) => {
        acc[key] = value(this.dispatch, () => this.state)
        return acc
      }, {})
    state = this.getReducedState()()
    dispatch = action =>
      new Promise(resolve =>
        this.setState(this.getReducedState(action), resolve)
      )
    render = () => {
      const { mapDispatchToActions, props, state } = this
      return (
        <store.Provider value={{ ...state, mapDispatchToActions }}>
          <Wrapped {...props} />
        </store.Provider>
      )
    }
  }

const Consume = (selector, actions, Wrapped) =>
  class Consumer extends Component {
    render = () => (
      <store.Consumer>
        {context => {
          const data = selector(context)
          this.actions = this.actions || context.mapDispatchToActions(actions)
          return <Wrapped {...this.actions} {...data} {...this.props} />
        }}
      </store.Consumer>
    )
  }

// COMPONENTS
class TodoAdd extends Component {
  static propTypes = {
    addTodo: PropTypes.func.isRequired,
  }
  onSubmit = e => {
    e.preventDefault()
    this.props.addTodo(this.INPUT.value)
    this.INPUT.value = ''
  }
  render = () => {
    const { onSubmit } = this
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter a TODO"
          required
          ref={i => (this.INPUT = i)}
        />
        <input type="submit" value="Add Todo" />
      </form>
    )
  }
}
const ConsumingTodoAdd = Consume(() => {}, { addTodo }, TodoAdd)

const Todo = ({ complete, id, todo, toggleTodo }) => (
  <li onClick={() => toggleTodo(id)}>
    {complete ? <del>{todo}</del> : <span>{todo}</span>}
  </li>
)
Todo.propTypes = {
  complete: PropTypes.bool,
  id: PropTypes.string,
  todo: PropTypes.string,
  toggleTodo: PropTypes.func,
}
const ConsumingTodo = Consume(() => ({}), { toggleTodo }, Todo)

const Todos = ({ todos }) => {
  if (!todos.length) return <p>You have nothing to do!</p>
  return (
    <ul>
      {todos.map(t => (
        <ConsumingTodo key={`todo--${t.id}`} {...t} />
      ))}
    </ul>
  )
}
Todos.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      complete: PropTypes.bool,
      id: PropTypes.string,
      todo: PropTypes.string,
      toggleTodo: PropTypes.func,
    })
  ),
}
const ConsumingTodos = Consume(state => ({ todos: state.todos }), {}, Todos)

// Putting it all together
const App = () => (
  <Fragment>
    <h1>Todo App</h1>
    <ConsumingTodoAdd />
    <ConsumingTodos />
  </Fragment>
)
const ProvidedApp = Provide(App, reducers)
const rootNode = document.getElementById('app')
render(<ProvidedApp />, rootNode)
