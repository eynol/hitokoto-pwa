import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, Route, Link} from 'react-router-dom'

import hitokotoDriver from '../API/hitokotoDriver';
import tranformDate from '../API/social-time-transform'

import {tag, item, idspan, userName, userHitokoto} from './PublicHitokoto.css'

const _ = (n) => n < 10
  ? '0' + n
  : n;
function PublicHitokoto(props) {
  let {
      data: {
        id,
        hitokoto,
        source,
        author,
        creator,
        category,
        created_at,
        collec
      }
    } = props,

    timeStr = tranformDate(new Date(created_at));

  return <div className={item}>
    <div>
      <Link to="user" className={userName}>
        <span>{creator}</span>
      </Link>
      <span className="color-basic">{timeStr}</span>
    </div>
    <p className={userHitokoto}>
      {hitokoto}<br/>——{author
        ? author + ' '
        : ''}{source}
    </p>
    <div>
      <span className={tag + ' color-basic'}>{id}</span>
      <span className={tag + ' color-basic'}>{category}</span>
      <Link className="color-red" to="user">{collec[0]}</Link>
    </div>
  </div>
};

PublicHitokoto.propTypes = {}

export default withRouter(PublicHitokoto);