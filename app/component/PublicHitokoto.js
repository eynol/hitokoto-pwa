import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, Route, Link} from 'react-router-dom'

import hitokotoDriver from '../API/hitokotoDriver';
import tranformDate from '../API/social-time-transform'

import {
  tag,
  item,

  timetag,
  userName,
  userHitokotoFlex,
  userHitokotoFlexChild,
  userHitokoto,
  userHitokotoSource,
  actions
} from './PublicHitokoto.css'

const _ = (n) => n < 10
  ? '0' + n
  : n;
function PublicHitokoto(props) {
  let {
      data: {
        hitokoto,
        source,
        author,
        creator,
        creator_id,
        category,
        created_at,
        collection
      },
      viewonly
    } = props,

    timeStr = tranformDate(new Date(created_at));

  return (
    <div className={item}>
      <div className="clearfix">
        {viewonly
          ? null
          : ([(
              <Link to={"/explore/" + creator} className={userName}>
                <span>{creator}</span>
              </Link>
            ), (
              <Link className="color-basic" to={"/explore/" + creator + '/' + collection}>{collection}</Link>
            ), (<br/>)])
}
        <span className={timetag}>{timeStr}</span>
      </div>
      <div className={userHitokotoFlex}>
        <div className={userHitokotoFlexChild + ' clearfix'}>
          <span className={userHitokoto}>{hitokoto}</span><br/>
          <span className={userHitokotoSource}>——{author
              ? author + ' '
              : ''}{source}</span>
        </div>
      </div>
      <div className="clearfix">
        <div className={"pull-right " + actions}>
          {props.children}
        </div>
      </div>
    </div>
  )
};

PublicHitokoto.propTypes = {}

export default withRouter(PublicHitokoto);