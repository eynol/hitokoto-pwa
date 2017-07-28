import React, {Component} from 'react';
import css from './App.css';

import HitokotoContainer from './Controller/HitokotoContainer'

class App extends Component{
  render() {
    return (
      <div className={css.root}>
        <HitokotoContainer/>
      </div>
    );
  }
}

export default App
