import {PANEL_HIDE, PANEL_OPEN} from '../actions'

const panel = (panel = '', action) => {
  switch (action.type) {
    case PANEL_OPEN:
      return PANEL_OPEN + action.value;

    case PANEL_HIDE:
      return PANEL_HIDE + action.value;

    default:
      return panel;
  }
};
export default panel;