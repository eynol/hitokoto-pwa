import React from 'react';
import style from './Copyright.css'

let {"copyright-state": id, "copyright-open": openClass, "copyright-close": closeClass ,copyrightWrapper} = style;

export default function Copyright(props) {
  return (
    <div className={copyrightWrapper}>
      <input type="checkbox" id={id} hidden/>
      <label className={openClass} htmlFor={id}></label>
      <div className={style.copyright}>
        <label className={closeClass} htmlFor={id}></label>
        <p>Copyright &copy; 2017 hitokoto.cn 沪ICP备16031287号-1 i@loli.online QQ群：70029304</p>
      </div>
    </div>
  )
};