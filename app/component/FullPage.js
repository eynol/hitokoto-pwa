import React from 'react';
export default function FullPage(props) {
  let {style: userStyle, onClick} = props;
  let style = Object.assign({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: '500',
    overflow: 'auto',
    backgroundColor: 'white'
  }, userStyle);
  return (
    <div style={style} onClick={onClick}>
      {props.children}
    </div>
  )
};