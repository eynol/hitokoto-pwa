const DEFAULT_LAYOUT = {
  font: 'simsun',
  fontWeight: '600',
  layoutHorizon: false,
  backgroundColor: '#ffffff'
}

const INSTANT_LAYOUT_NAME = 'instant_layout';

function $getInstantLayout() {
  let string = localStorage.getItem(INSTANT_LAYOUT_NAME);
  if (!string) {
    return DEFAULT_LAYOUT;
  }
  return JSON.parse(string);
}
function $setInstantLayout(layout) {
  localStorage.setItem(INSTANT_LAYOUT_NAME, JSON.stringify(layout));
}

const layout = (state = $getInstantLayout(), action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state, {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo => (todo.id === action.id)
        ? {
          ...todo,
          completed: !todo.completed
        }
        : todo)
    default:
      return state
  }
}

export default layout
