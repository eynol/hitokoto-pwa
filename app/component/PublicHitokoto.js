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

const STATE = {
  'public': '公开',
  'private': '私密',
  'reviewing': '审核中',
  'rejected': '驳回(私密)'
}

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
        collection,
        state
      },
      viewonly,
      showState,
      usernameProxy,
      collectionProxy
    } = props,

    timeStr = tranformDate(created_at);

  return (
    <div className={item}>
      <div className="clearfix">
        {viewonly
          ? null
          : ([
            (usernameProxy
              ? (
                <a href="javascript:" key="user" onClick={usernameProxy} className={userName}>
                  <span>{creator}</span>
                </a>
              )
              : (
                <Link key="user" to={"/explore/" + creator} className={userName}>
                  <span>{creator}</span>
                </Link>
              )),
            (collectionProxy
              ? (
                <a
                  href="javascript:"
                  key="collection"
                  className="color-basic"
                  onClick={collectionProxy}>{collection}</a>
              )
              : (
                <Link
                  key="collection"
                  className="color-basic"
                  to={"/explore/" + creator + '/' + collection}>{collection}</Link>
              )),
            (<br key="br"/>)
          ])
}
        <span className={timetag}>{showState
            ? STATE[state] + ' - '
            : null}{timeStr}</span>
      </div>
      <div className={userHitokotoFlex}>
        <div className={userHitokotoFlexChild + ' clearfix'}>
          <span className={userHitokoto}>{hitokoto}</span><br/>
          <span className={userHitokotoSource}>—— {author
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