import React from 'react';

import {withRouter} from 'react-router-dom';
import {wrapper, paper, manageBox, closeButton, backButton} from './FullPageCard.css'

function FullPageCard(props) {
  let {style, onClick} = props;
  return (
    <div key="default" style={style} className={wrapper} onClick={onClick}>
      <div className={paper}>
        <div className={manageBox}>
          <h1>
            <a
              href="javascript:"
              onClick={props.close
              ? props.close
              : () => props.history.goBack()}
              className={backButton}>
              <i className="iconfont icon-back_android"></i>
            </a>{props.cardname} {/* <a
              href="javascript:"
              onClick={() => props.history.goBack()}
              className={closeButton}>
              <i className="iconfont icon-close"></i>
            </a> */}

          </h1>
          <div>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(FullPageCard);