import React from 'react';
import style from './Copyright.css'

let {"copyright-state": id, "copyright-open": openClass, "copyright-close": closeClass, copyrightWrapper, hoverToShow} = style;

export default function Copyright(props) {
  return (
    <div className={copyrightWrapper}>
      <input type="checkbox" id={id} hidden/>
      <label className={openClass} htmlFor={id}></label>
      <div className={style.copyright}>
        <label className={closeClass} htmlFor={id}></label>
        <p>Copyright &copy;2017 heitaov.cn
          <span className={hoverToShow}>蜀ICP备16001587号-1 QQ群：302713047</span>
        </p>
      </div>
    </div>
  )
};