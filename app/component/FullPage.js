import React from 'react';
export default function FullPage(props) {
  let {style: userStyle, onClick} = props;
  if (!Object.assign) {
    Object.assign = function assign(src, target) {
      for (var i in target) {
        src[i] = target[i]
        console.log(target[i])
      }
      return src;
    }
  }
  let style = Object.assign({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: '500',
    backgroundColor: 'white'
  }, userStyle);
  return (
    <div style={style} onClick={onClick}>
      {props.children}
    </div>
  )
};