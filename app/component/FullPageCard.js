import React from 'react';

import {withRouter} from 'react-router-dom';
import {
  wrapper,
  paper,
  header,
  content,
  manageBox,
  closeButton,
  backButton,
  cardActions,
  withAction
} from './FullPageCard.css'

function FullPageCard(props) {
  let {style, onClick, actions} = props;
  return (
    <div key="default" style={style} className={wrapper} onClick={onClick}>
      <div className={paper}>
        <div className={manageBox}>
          <header
            className={header + (actions
            ? ' ' + withAction
            : '')}>
            <a
              href="javascript:"
              onClick={props.close
              ? props.close
              : () => props.history.goBack()}
              className={backButton}>
              <i className="iconfont icon-back_android"></i>
            </a>
            <span>{props.cardname}</span>
            {actions
              ? <div className={cardActions}>
                  {actions}
                </div>
              : null}
          </header>
          <div className={content}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(FullPageCard);