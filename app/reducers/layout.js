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

import {UPDATE_LAYOUT} from '../actions'

const layout = (layout = $getInstantLayout(), action) => {
  switch (action.type) {
    case UPDATE_LAYOUT:

    case UPDATE_LAYOUT:

    default:

      return layout
  }
}

export default layout
