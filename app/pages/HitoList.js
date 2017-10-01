import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {matchPath} from 'react-router'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';

import hitokotoDriver from '../API/hitokotoDriver'

import {Card, Card_options, Card_content} from './HitoCollection.css'
import {menu} from './Home.css'
import {ellipsis} from './UI.css'

import HitoView from '../component/HitoView'

class HitoList extends Component {
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

      let col_name = match.params.name;
      let username = this.props.user.nickname;
      let url = location.protocol + '//' + location.host + '/api/' + username + '/' + col_name;
      return {url, username, name: col_name};
    } else {
      return;
    }
  }
  addToSources() {

    let url = this.getURL();

    if (url) {

      hitokotoDriver.patterManager.newSource({
        id: Date.now(),
        url: url.url,
        name: url.name,
        adapter: 0,
        online: true,
        local: true
      });
      this.forceUpdate();
    }

  }

  isSourcesContians() {

    let url = this.getURL()
    if (url) {
      let reg = new RegExp('^' + url.url);
      let index = hitokotoDriver.patterManager.sources.findIndex((source => {

        console.log(reg, source.url, reg.test(source.url))
        if (reg.test(source.url)) {
          return true;
        } else {
          return false;
        }
      }));
      if (~ index) {
        return true;
      }
    }

    return false;

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
    this.props.history.push(this.props.location.pathname + '/new');
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
        className='HitokotoList'>{ListToShow}</QueueAnim>
    )
  }
}

HitoList.propTypes = {
  hitokotos: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  updateHitokoto: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired
}
export default withRouter(HitoList)