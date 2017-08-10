import React from 'react';
export default function FullPage(props) {
  let style = Object.assign({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: '500',
    backgroundColor: 'white'
  }, props.style);
  return (
    <div style={style}>
      {props.children}
    </div>
  )
};