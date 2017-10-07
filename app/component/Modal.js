import React from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

const ANIMATION_DURING = 300;

export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.classList.add('modal__root');
  }

  componentDidMount() {
    this.el.classList.add('modal-enter');
    modalRoot.appendChild(this.el);

    setTimeout(() => {
      this.el.classList.remove('modal-enter');
    }, ANIMATION_DURING);

    let bodyClasses = document.body.classList;
    if (!bodyClasses.contains('overflowhide')) {
      bodyClasses.add('overflowhide');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.exit && !this.props.exit) {
      this.el.classList.add('modal-leave');
    }
  }

  componentWillUnmount() {

    if (modalRoot.children.length == 1) {
      let bodyClasses = document.body.classList;
      if (bodyClasses.contains('overflowhide')) {
        bodyClasses.remove('overflowhide');
      }
    }

    modalRoot.removeChild(this.el);

  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el,);
  }
}

class ProxyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exit: false
    }
    this.proxyExit = this.proxyExit.bind(this);
  }

  proxyExit(event) {

    this.setState({
      exit: true
    }, () => {

      setTimeout(() => {

        this.props.exit();
      }, ANIMATION_DURING + 100)
    });
    event && event.stopPropagation();
  }
  render() {
    let {exit, children} = this.props;
    return (
      <Modal exit={this.state.exit}>
        <div className="modal" onClick={this.proxyExit}>
          <div
            className="modal__card"
            onClick={(e) => {
            if (e.target.getAttribute('role') == 'exit') {
              this.proxyExit();
            };
            e.stopPropagation()
          }}>
            <span className="modal__default-close" onClick={this.proxyExit}>
              <i className="iconfont icon-round_close_light" onClick={this.proxyExit}></i>
            </span>
            {children};
          </div>
        </div>
      </Modal>
    )
  };
}

export default ProxyModal