import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import {withRouter, Route, Link} from 'react-router-dom'

import hitokotoDriver from '../API/hitokotoDriver';
import tranformDate from '../API/social-time-transform'

import {
  tag,
  item,
  idspan,
  userName,
  userHitokotoFlex,
  userHitokotoFlexChild,
  userHitokoto,
  userHitokotoSource,
  userHitokotoAction
} from './PublicHitokoto.css'

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
        creator_id,
        category,
        created_at,
        collec
      }
    } = props,

    timeStr = tranformDate(new Date(created_at));

  return (
    <div className={item}>
      <div>
        <Link to={"/explore/" + creator} className={userName}>
          <span>{creator}</span>
        </Link>
        <Link className="color-basic" to={"/explore/" + creator + '/' + collec[0]}>{collec[0]}</Link>&nbsp;&nbsp;
        <span className="color-basic">{timeStr}</span>
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
        <span className={tag + ' color-basic'}>No.{id}</span>
        <span className={tag + ' color-basic'}>#{category}#</span>
        <div className="pull-right">
          <a href="javascript:" className={userHitokotoAction}>
            <i className="iconfont icon-like">喜欢</i>
          </a>
          <a href="javascript:" className={userHitokotoAction}>
            <i className="iconfont icon-favor">收藏</i>
          </a>
        </div>

      </div>
    </div>
  )
};

PublicHitokoto.propTypes = {}

export default withRouter(PublicHitokoto);