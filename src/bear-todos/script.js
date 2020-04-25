const {
  React: { Fragment, useReducer, useRef, useEffect },
  ReactDOM: { render },
  PropTypes: T,
  gsap: { set, to, timeline },
} = window

const STORAGE_KEY = 'jh3y-bear-todos'
const PEN_COLORS = [
  'hsl(0, 100%, 50%)',
  'hsl(90, 100%, 50%)',
  'hsl(50, 100%, 50%)',
  'hsl(210, 100%, 50%)',
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

let SWEAT_DROP_TL
let SHADES_TL
let UNAMUSED_TL
let CONCERNED_TL
let SOB_TL
const FACE_ACTIONS = [
  // Showing the shades
  () => {
    SHADES_TL.play()
  },
  // Showing the smile, transform eyes and mouth
  () => {
    SHADES_TL.reverse()
    SWEAT_DROP_TL.pause()
    SWEAT_DROP_TL.time(0)
    set('.eyes--normal', { display: 'none' })
    set(['.eyes--smiley', '.bear__mouth'], { display: 'block' })
  },
  // Sweat droplets timeline
  () => {
    SWEAT_DROP_TL.play()
    set('.eyes--normal', { display: 'none' })
    set('.eyes--smiley', { display: 'block' })
  },
  // Stop sweat droplets and set to happy
  () => {
    // Stop sweating
    SWEAT_DROP_TL.pause()
    SWEAT_DROP_TL.time(0)
    set(['.eyes--normal', '.bear__mouth'], { display: 'block' })
    set(['.eyes--smiley', '.bear__mouth--smile'], { display: 'none' })
  },
  // Morph the mouth to the non teeth version
  () => {
    set(['.bear__mouth', '.eyes--smiley', '.bear__mouth--straight'], {
      display: 'none',
    })
    set(['.bear__mouth--smile', '.eyes--normal'], { display: 'block' })
  },
  // Straight face
  () => {
    set(['.bear__mouth', '.bear__mouth--smile', '.eyes--smiley'], {
      display: 'none',
    })
    set(['.bear__mouth--straight', '.eyes--normal'], { display: 'block' })
    UNAMUSED_TL.reverse()
  },
  () => {
    set(['.eyes--normal', '.bear__mouth--straight'], { display: 'block' })
    set(['.bear__mouth', '.bear__brows'], { display: 'none' })
    UNAMUSED_TL.play()
    CONCERNED_TL.pause()
    CONCERNED_TL.time(0)
    to('.bear__mouth--straight', {
      duration: 0.25,
      scaleX: 1,
      transformOrigin: '50% 50%',
    })
  },
  () => {
    UNAMUSED_TL.reverse()
    CONCERNED_TL.play()
    to('.bear__mouth--straight', {
      duration: 0.25,
      scaleX: 0.5,
      transformOrigin: '50% 50%',
    })
    set(['.eyes--normal', '.bear__mouth--straight', '.bear__brows'], {
      display: 'block',
    })
    set(['.bear__mouth--sad'], { display: 'none' })
  },
  // Set sad face
  () => {
    set(['.bear__mouth--straight', '.bear__sob-eye', '.bear__mouth--sobbing'], {
      display: 'none',
    })
    set(['.bear__mouth--sad', '.eyes--normal', '.bear__brows'], {
      display: 'block',
    })
    CONCERNED_TL.pause()
    CONCERNED_TL.time(0)
    SOB_TL.reverse()
  },
  () => {
    set(
      [
        '.bear__mouth--tired',
        '.bear__eyes--tired',
        '.bear__mouth--sad',
        '.eyes--normal',
        '.bear__brows',
      ],
      {
        display: 'none',
      }
    )
    set(['.bear__sob-eye', '.bear__mouth--sobbing'], { display: 'block' })
    SOB_TL.play()
  },
  () => {
    SOB_TL.reverse()
    set(['.bear__eyes--tired', '.bear__brows', '.bear__mouth--tired'], {
      display: 'block',
    })
    set(['.bear__sob-eye', '.eyes--normal', '.bear__mouth--sobbing'], {
      display: 'none',
    })
  },
]
// 1 || 0 === happy
// 0 && dirty === shades
// 2 === Sweat smile
// 3 === smile
// 4 === smile with no teeth
// 5 === straight
// 6 === unamused
// 7 === concerned
// 8 === sad
// 9 === sob
// 10 === tired

const animateCompletion = (remaining, dirty) => {
  if (dirty) {
    FACE_ACTIONS[Math.min(remaining, 10)]()
  } else {
    FACE_ACTIONS[1]()
  }
}

const Bear = ({ dirty, remaining }) => {
  const run = useRef(null)
  useEffect(() => {
    // Do all our setting in an effect after we have some things rendered
    set(['.bear__sweat', '.bear__tear'], { transformOrigin: '50% 0', scale: 0 })
    set(['.bear__tear-stream'], { transformOrigin: '50% 0', scaleY: 0 })
    set('.bear__shades', { x: '+=300' })
    set('.bear__pupil', { transformOrigin: '50% 50%', scale: 0.8 })
    set('.eye__whites path', { transformOrigin: '50% 50%', scale: 0.6 })
    set(
      [
        '.bear__face',
        '.bear__mouth--smile',
        '.eyes--normal',
        '.bear__mouth--straight',
        '.eye__whites',
        '.bear__mouth',
        '.eyes--smiley',
        '.bear__brows',
        '.bear__mouth--sad',
        '.bear__sob-eye',
        '.bear__mouth--sobbing',
        '.bear__mouth--tired',
        '.bear__eyes--tired',
      ],
      {
        display: 'none',
      }
    )
    set('.bear__cheeks circle', { transformOrigin: '50% 50%', scale: 0 })
    // Set up recurring timeline
    SWEAT_DROP_TL = new timeline({ repeat: -1, paused: true })
      .to('.bear__sweat', {
        transformOrigin: '50% 0',
        scale: 1,
        duration: 2,
        y: '+=10',
      })
      .to('.bear__sweat', { opacity: 0, duration: 1 }, 1)
    // Slide in the shades
    SHADES_TL = timeline({ paused: true })
      .to('.bear__mouth', {
        scale: 0,
        transformOrigin: '50% 50%',
        duration: 0.25,
      })
      .to('.bear__shades', { x: 0, duration: 0.25 }, 0)
    UNAMUSED_TL = timeline({ paused: true })
      .set('.eye__whites', { display: 'block' })
      .to('.bear__cheeks circle', {
        scale: 1,
        duration: 0.25,
      })
      .to('.eye__whites path', { duration: 0.25, scale: 1 }, 0)
      .to('.eyes--normal path', { duration: 0.25, scale: 0.5 }, 0)
    CONCERNED_TL = timeline({ paused: true, repeat: -1 })
      .to('.bear__tear', { duration: 2, scale: 1, y: '+=10' }, 0)
      .to('.bear__tear', { duration: 1, opacity: 0 }, 1)
    SOB_TL = timeline({ paused: true }).to('.bear__tear-stream', {
      scaleY: 1,
      duration: 0.25,
    })
  }, [])
  useEffect(() => {
    animateCompletion(remaining, dirty)
  }, [dirty, remaining])
  useEffect(() => {
    if (!run.current && remaining === 0 && dirty) {
      SHADES_TL.time(1)
    }
    run.current = true
  }, [remaining, dirty, run])
  return (
    <svg className="bear" xmlns="http://www.w3.org/2000/svg">
      <g className="bear__head">
        <path
          d="M274 149c0 82-48 143-126 143-73 0-122-61-122-143S76 34 148 34c71 0 126 33 126 115z"
          fill="#803300"
        />
        <path
          d="M233 235c0 27-38 52-85 52-46 0-81-25-81-52s35-44 82-44c46 0 84 17 84 44z"
          fill="#e9c6af"
        />
        <path d="M192 200c0 10-26 33-41 33s-43-23-43-33 27-17 42-17 42 7 42 17z" />
        <ellipse cx="40.4" cy="60.3" rx="31.9" ry="31" fill="#803300" />
        <path
          d="M63 58a22 22 0 00-23-19 22 22 0 00-22 21 22 22 0 0022 22 22 22 0 002 0l3-6a88 88 0 0115-15l3-3z"
          fill="#e9c6af"
        />
        <ellipse
          ry="31"
          rx="31.9"
          cy="60.3"
          cx="-259"
          transform="scale(-1 1)"
          fill="#803300"
        />
        <path
          d="M237 58a22 22 0 0122-19 22 22 0 0122 21 22 22 0 01-22 22 22 22 0 01-2 0l-3-6a88 88 0 00-14-15l-3-3z"
          fill="#e9c6af"
        />
        <path
          d="M147 44c-18 0-35 1-51 4v15a267 267 0 01108 2V49c-18-3-37-5-57-5z"
          fill="red"
        />
        <path
          d="M170 45a21 10 0 016 7 21 10 0 01-7 8c12 1 24 2 35 5V49l-34-4z"
          fill="#e50000"
        />
        <path
          d="M147 8C89 8 46 35 36 94c16-14 37-25 60-30 0 0-3-17 14-22 20-5 25-5 37-5 14 0 21 0 41 5 19 5 16 23 16 23 23 6 43 15 60 29-10-62-57-86-117-86z"
          fill="#1a1a1a"
        />
        <g className="bear__mouth">
          <path
            d="M79 229a74 74 0 0071 53 74 74 0 0071-53 102 81 0 01-71 23 102 81 0 01-71-23z"
            stroke="#000"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bear__mouth-opening"
          />
          <path
            d="M79 229a74 74 0 008 18 102 81 0 0063 17 102 81 0 0063-17 74 74 0 008-18 102 81 0 01-71 23 102 81 0 01-71-23z"
            fill="#fff"
            className="bear__mouth-teeth"
          />
        </g>
        <g className="bear__mouth--smile">
          <path
            d="M96 248c7 14 28 24 54 24 25 0 47-10 54-24"
            fill="none"
            stroke="#000"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="bear__mouth--straight">
          <path
            d="M116 260v0h68"
            fill="none"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <g className="bear__sweat">
          <path
            d="M251 108a13 13 0 11-25 0c0-7 6-25 13-25s12 18 12 25z"
            fill="#0ff"
          />
        </g>
        <g className="bear__tear">
          <path
            d="M63 191a13 13 0 11-25 0c0-7 5-24 12-24s13 17 13 24z"
            fill="#0ff"
          />
        </g>
        <g className="bear__cheeks">
          <circle cx="59.6" cy="191.3" r="17.2" fill="#faa" />
          <circle r="17.2" cy="191.3" cx="238.2" fill="#faa" />
        </g>
        <g className="eyes eyes--smiley">
          <path
            d="M68 149a11 11 0 1122 0"
            fill="none"
            stroke="#000"
            strokeWidth="8.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M68 149a11 11 0 1122 0M209 149a11 11 0 0121 0"
            fill="none"
            stroke="#000"
            strokeWidth="8.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="bear__brows">
          <path
            d="M78 109a29 29 0 01-9 21 29 29 0 01-21 7M222 109a29 29 0 009 21 29 29 0 0021 7"
            fill="none"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="eye__whites">
          <path
            d="M99 149a20 19 0 01-20 19 20 19 0 01-19-19 20 19 0 0119-18 20 19 0 0120 18z"
            fill="#fff"
          />
          <path
            d="M239 149a20 19 0 01-19 19 20 19 0 01-20-19 20 19 0 0120-18 20 19 0 0119 18z"
            fill="#fff"
          />
        </g>
        <g className="eyes eyes--normal">
          <path
            className="bear__pupil"
            d="M99 149a20 19 0 01-20 19 20 19 0 01-19-19 20 19 0 0119-18 20 19 0 0120 18z"
            fill="#000"
          />
          <path
            className="bear__pupil"
            d="M239 149a20 19 0 01-19 19 20 19 0 01-20-19 20 19 0 0120-18 20 19 0 0119 18z"
            fill="#000"
          />
        </g>
        <g className="bear__mouth--sad">
          <path
            d="M199 273a51 46 0 00-49-33 51 46 0 00-49 33 70 51 0 0149-14 70 51 0 0149 14z"
            stroke="#000"
            strokeWidth="2.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="matrix(1 0 0 .70702 0 70)"
          />
        </g>
        <g className="bear__mouth--sobbing">
          <circle
            cx="149.7"
            cy="1017.3"
            r="18.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000"
            strokeWidth="5"
            transform="translate(0 -752)"
          />
          <path
            d="M150 246a18 18 0 00-17 11h33a18 18 0 00-16-11z"
            fill="#fff"
          />
        </g>
        <g className="eyes--sobbing">
          <path
            d="M68 149h23"
            fill="none"
            stroke="#000"
            strokeWidth="6.2"
            strokeLinecap="round"
            className="bear__sob-eye"
          />
          <path
            className="bear__tear-stream"
            d="M71 149c-2 0-3 2-3 4v107l22 17V153c0-2-1-4-3-4z"
            fill="#afafe9"
          />
        </g>
        <g className="eyes--sobbing">
          <path
            className="bear__sob-eye"
            d="M208 149h23"
            fill="none"
            stroke="#000"
            strokeWidth="6.2"
            strokeLinecap="round"
          />
          <path
            className="bear__tear-stream"
            d="M212 149c-2 0-4 2-4 5v123c8-4 16-10 23-16V154c0-3-2-5-4-5z"
            fill="#afafe9"
          />
        </g>
        <g className="bear__mouth--tired">
          <path
            d="M199 273a51 46 0 00-49-33 51 46 0 00-49 33 70 51 0 0149-14 70 51 0 0149 14z"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="matrix(1 0 0 .96338 0 9)"
            strokeWidth="5.1"
          />
          <path
            d="M150 240a51 44 0 00-33 11h66a51 44 0 00-33-11z"
            fill="#fff"
          />
        </g>
        <g className="bear__eyes--tired">
          <path d="M64 148a15 15 0 000 1 15 15 0 0015 15 15 15 0 0015-15 15 15 0 00-2-8 15 15 0 010 1 15 15 0 01-1 1 15 15 0 010 2 15 15 0 010 1 15 15 0 01-1 1 15 15 0 01-1 2 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 0 15 15 0 01-2 1 15 15 0 01-1 1 15 15 0 01-2 0 15 15 0 01-1 0 15 15 0 01-1 0 15 15 0 01-2 0 15 15 0 01-1 0 15 15 0 01-2-1 15 15 0 01-1 0 15 15 0 01-1-1 15 15 0 01-2-1 15 15 0 01-1 0 15 15 0 01-1-1 15 15 0 01-1-2 15 15 0 01-1-1z" />
          <path d="M234 148a15 15 0 011 1 15 15 0 01-15 15 15 15 0 01-15-15 15 15 0 012-8 15 15 0 000 1 15 15 0 000 1 15 15 0 001 2 15 15 0 000 1 15 15 0 001 1 15 15 0 001 2 15 15 0 001 1 15 15 0 001 1 15 15 0 001 1 15 15 0 001 1 15 15 0 001 0 15 15 0 002 1 15 15 0 001 1 15 15 0 002 0 15 15 0 001 0 15 15 0 001 0 15 15 0 002 0 15 15 0 001 0 15 15 0 001-1 15 15 0 002 0 15 15 0 001-1 15 15 0 002-1 15 15 0 001 0 15 15 0 001-1 15 15 0 001-2 15 15 0 000-1z" />
        </g>
        <g className="bear__shades">
          <path d="M52 96l-30 3-19 4 3 20c3 1 6 1 8 4 5 6 2 12 3 24 4 37 16 45 35 47 10 1 31 3 45-2 13-5 24-13 32-24 9-12 10-25 15-35 3-7 10-5 12 0 4 11 6 23 14 35 8 11 20 19 33 24 14 5 34 3 45 2 19-2 31-10 35-47 1-12-2-18 2-24 2-3 6-4 9-4l3-20-19-4c-20-4-32-2-47-2h-17l-33 6c-10 2-20 8-31 8-10 0-21-7-31-9l-33-5H68l-16-1z" />
          <path
            d="M63 104c-13 0-33 1-38 17-4 20-4 44 8 61 10 14 31 11 47 11 25-1 47-21 54-45 2-10 5-19 1-26-8-12-27-16-41-17l-31-1z"
            fill="#333"
          />
          <path
            d="M24 109a5 2 0 01-5 3 5 2 0 01-6-3 5 2 0 015-2 5 2 0 016 2"
            fill="#b3b3b3"
          />
          <path
            d="M237 104c13 0 33 1 38 17 4 20 4 44-8 61-10 14-31 11-47 11-26-1-47-21-54-45-3-10-6-19-1-26 8-12 27-16 41-17l31-1z"
            fill="#333"
          />
          <path
            d="M276 109a5 2 0 005 3 5 2 0 006-3 5 2 0 00-6-2 5 2 0 00-5 2"
            fill="#b3b3b3"
          />
          <path
            d="M84 104l-26 89h23l25-86-22-3zM68 104h-9l-24 81 8 5z"
            fill="#fff"
          />
        </g>
      </g>
      <g className="bear__face bear__face--tired">
        <path
          d="M64 148a15 15 0 000 1 15 15 0 0015 15 15 15 0 0015-15 15 15 0 00-2-8 15 15 0 010 1 15 15 0 01-1 1 15 15 0 010 2 15 15 0 010 1 15 15 0 01-1 1 15 15 0 01-1 2 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 1 15 15 0 01-1 0 15 15 0 01-2 1 15 15 0 01-1 1 15 15 0 01-2 0 15 15 0 01-1 0 15 15 0 01-1 0 15 15 0 01-2 0 15 15 0 01-1 0 15 15 0 01-2-1 15 15 0 01-1 0 15 15 0 01-1-1 15 15 0 01-2-1 15 15 0 01-1 0 15 15 0 01-1-1 15 15 0 01-1-2 15 15 0 01-1-1z"
          fillOpacity=".9"
        />
        <path
          d="M78 109a29 29 0 01-9 21 29 29 0 01-21 7"
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M234 148a15 15 0 011 1 15 15 0 01-15 15 15 15 0 01-15-15 15 15 0 012-8 15 15 0 000 1 15 15 0 000 1 15 15 0 001 2 15 15 0 000 1 15 15 0 001 1 15 15 0 001 2 15 15 0 001 1 15 15 0 001 1 15 15 0 001 1 15 15 0 001 1 15 15 0 001 0 15 15 0 002 1 15 15 0 001 1 15 15 0 002 0 15 15 0 001 0 15 15 0 001 0 15 15 0 002 0 15 15 0 001 0 15 15 0 001-1 15 15 0 002 0 15 15 0 001-1 15 15 0 002-1 15 15 0 001 0 15 15 0 001-1 15 15 0 001-2 15 15 0 000-1z"
          fillOpacity=".9"
        />
        <path
          d="M222 109a29 29 0 009 21 29 29 0 0021 7"
          fill="none"
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
Bear.propTypes = {
  dirty: T.bool,
  remaining: T.number,
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
        <svg viewBox="0 0 24 24">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
        </svg>
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
          {new Array(5).fill().map((ring, index) => (
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
      <Bear
        dirty={state.dirty}
        remaining={state.todos.filter(todo => !todo.complete).length}
      />
    </Fragment>
  )
}

render(<App />, ROOT_NODE)
