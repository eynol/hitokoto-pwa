import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, Route, Link} from 'react-router-dom'
import Loading from './Loading'
import {ANIMATE_CONFIG_NEXT} from '../configs'

import PublicHitokoto from './PublicHitokoto';
import hitokotoDriver from '../API/hitokotoDriver';

function PublicHitokotosList(props) {
  let {hitokotos, inited} = props;

  return <div className='hitokoto-list'>
    <QueueAnim className="view" animConfig={ANIMATE_CONFIG_NEXT}>
      {inited
        ? null
        : <Loading key="loading"/>}
      {hitokotos.map(hito => (
        <PublicHitokoto key={hito.id} data={hito}></PublicHitokoto>
      ))}
    </QueueAnim>
  </div>
};

PublicHitokotosList.propTypes = {}

export default withRouter(PublicHitokotosList);