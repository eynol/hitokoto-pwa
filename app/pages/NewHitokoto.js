import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'
import style from './NewHitokoto.css';
import Textarea from 'react-textarea-autosize';
let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  back,
  backButton,
  ellipsis,
  hitokotoTextarea,
  hitokotoSouceInput
} = style;

class NewHitokoto extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.location.pathname == nextProps.path || this.props.location.pathname == nextProps.path;
  }
  render() {
    let {location, path} = this.props;
    let child = '';
    return (
      <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']}>{location.pathname == path
          ? <FullPageCard key="23">
              <header className={manageBox}>
                <h1 className={clearfix}>关于hitokoto
                  <Link to='/' className={closeButton}>
                    <i className={icon + ' ' + close}></i>
                  </Link>
                  <Link to='/' className={backButton}>
                    <i className={icon + ' ' + back}></i>
                  </Link>
                </h1>
                <br/>
                <div>
                  <div>
                    <Textarea minRows={3} className={hitokotoTextarea} placeholder="请在此输入hitokoto"></Textarea>
                  </div>
                  <div>
                    <input type="text" placeholder="...在这里写来源出处" className={hitokotoSouceInput}/>
                  </div>
                </div>
              </header>
            </FullPageCard>
          : null}</QueueAnim>
    )
  }
}

export default withRouter(NewHitokoto);