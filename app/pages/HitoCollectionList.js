import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';

import hitokotoDriver from '../API/hitokotoDriver'

import HitoView from '../component/HitoView'

class HitoCollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections'
    };
    this.newHitokoto = this.newHitokoto.bind(this);
    this.updateHitokoto = this.updateHitokoto.bind(this);
    this.isSourcesContians = this.isSourcesContians.bind(this);
  }

  componentDidMount() {
    this.fetchHitokotos();
  }
  componentWillUnmount() {
    this.props.leaveCollection()
  }
  getURL() {
    let pathname = this.props.location.pathname;
    let match = matchPath(pathname, {path: '/home/:name'});
    if (match) {
      let collection = match.params.name;
      let username = this.props.user.nickname;
      let url = hitokotoDriver.patterManager.getCORSUrlOfUserCol(username, collection);
      return {username, url, collection}
    }
  }
  addToSources() {

    let url = this.getURL()
    if (url) {
      hitokotoDriver.patterManager.newSourceWithUsernameAndCol(url.username, url.collection);
      this.forceUpdate();
    }

  }

  isSourcesContians() {
    let url = this.getURL()
    if (!url) {
      return false;
    }
    return hitokotoDriver.patterManager.isSourceExsit(url.url);
  }
  fetchHitokotos() {
    let pathname = this.props.location.pathname;
    if (pathname == '/home/') {
      this.props.history.replace('/home');
      return;
    }
    let match = matchPath(pathname, {path: '/home/:name'})

    if (!match) {
      return;
    }

    let {params: {
        name
      }} = match;
    if (name && name.length) {
      this.props.requestCollectionHitokotos(name).then(result => {}, (e) => {})
    } else {
      alert('路径名不正确');
      this.props.history.push('/home');
    }

  }
  updateHitokoto(data) {
    this.props.updateHitokoto(data);
    this.props.history.push(this.props.location.pathname + '/update');
  }
  newHitokoto() {
    let pathname = this.props.location.pathname;
    if (!(/\/new$/.test(pathname))) {
      pathname += '/new';
    }
    this.props.history.push(pathname);
  }
  render() {
    let {status} = this.state;
    let {hitokotos, location: {
          pathname
        }} = this.props,
      ListToShow = [(
          <HitoView
            newone={true}
            update={this.updateHitokoto}
            newHitokoto={this.newHitokoto}
            key='newone'>
            {this.isSourcesContians()
              ? ''
              : <button onClick={() => {
                this.addToSources()
              }}>将此句集加入来源</button>}
            <button
              onClick={() => {
              alert('链接地址为：\n' + this.getURL().url)
            }}>API链接</button>
          </HitoView>
        )];

    if (hitokotos.length > 0) {
      ListToShow = ListToShow.concat(hitokotos.map((hitokoto) => (<HitoView
        key={hitokoto.id}
        preview={this.props.preview}
        update={this.updateHitokoto}
        remove={this.props.remove}
        data={hitokoto}/>)));;
    }

    return (
      <QueueAnim
        animConfig={[
        {
          opacity: [
            1, 0
          ],
          translateY: [0, 50]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateY: [0, -50]
        }
      ]}
        className='tryFlexContainer'>{ListToShow}</QueueAnim>
    )
  }
}

HitoCollectionList.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  updateHitokoto: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
}
export default withRouter(HitoCollectionList)