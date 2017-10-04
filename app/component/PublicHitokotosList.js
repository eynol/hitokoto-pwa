import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, Route, Link} from 'react-router-dom'

import PublicHitokoto from './PublicHitokoto';
import hitokotoDriver from '../API/hitokotoDriver';

function PublicHitokotosList(props) {
  let {hitokotos} = props;

  return <div className='hitokoto-list'>
    <QueueAnim className="view">
      {hitokotos.map(hito => (
        <PublicHitokoto key={hito.id} data={hito}></PublicHitokoto>
      ))}
    </QueueAnim>
  </div>
};

PublicHitokotosList.propTypes = {}

export default withRouter(PublicHitokotosList);