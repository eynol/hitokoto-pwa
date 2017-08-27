import React, {Component} from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

import NewHitokoto from '../pages/NewHitokoto'
import hitokotoDriver from '../API/hitokotoDriver';
import HitoCollection from './HitoCollection';
import HitokotoList from './HitokotoList';
import HitokotoPreview from './HitokotoPreview';

let httpMangaer = hitokotoDriver.httpManager;

import {home, username, menu, left, right} from './Home.css';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      horizon: true,
      currentCollectionName: '',
      hitokotos: [],
      previewHitokoto: ''
    }
  }
  componentDidMount() {
    console.log('[home]CDM')
    httpMangaer.API_myCollections().then(ret => {
      console.log('result mycollection')
      if (ret.err) {
        alert(ret.err);
      } else {
        this.setState(state => {
          console.log(state)
          if (state.loadingCollect) {
            state.loadingCollect = false;
          }
          state.collections = ret.collections;
          return state;
        })
      }
      console.log(ret);
    }).catch(e => alert(e));
    console.log('result mycollection')
  }
  viewCollection(name) {
    this.props.history.push('/home/' + name);
    this.setState({currentCollectionName: name})
    return httpMangaer.API_viewCollection(name).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.setState(state => {
          console.log(state)
          state.hitokotos = result.hitokotos
          if (state.loadingHito) {
            state.loadingHito = false;
          }
          return state;
        })
      }
      console.log('result', result);
    });
  }
  newCollection(name) {
    let form = new FormData();
    form.append('name', name);

    return httpMangaer.API_newCollection(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.setState({collections: result.collections})
      }
      console.log('result', result);
    });
  }
  changeCollectionName(oldname, newname) {
    if (oldname === '默认句集') {
      console.log('默认句集无法修改')
      return;
    }
    let form = new FormData();
    form.append('oldname', oldname);
    form.append('newname', newname);
    httpMangaer.API_updateCollectionName(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.setState({collections: result.collections})
      }
      console.log('result', result);
    });
  }
  switchLayout() {
    this.setState(state => {
      state.horizon = !state.horizon;
      return state;
    })
  }
  previewHitokoto(hitokoto) {
    hitokoto.creator = this.props.nickname;
    let date = new Date();
    hitokoto.id = '' + date.getFullYear() + date.getMonth() + date.getDate()
    this.setState({previewHitokoto: hitokoto})
    this.props.history.push('/home/hitokoto/preview');
  }
  pubulishHitokoto(hitokoto) {
    let collectionName = this.state.currentCollectionName;
    let form = new FormData();

    form.append('hitokoto', hitokoto.hitokoto);
    form.append('from', hitokoto.from);
    form.append('creator', this.props.nickname);
    form.append('type', hitokoto.type);
    return httpMangaer.API_newHitokoto(collectionName, form).then(result => {

      console.log(result);
      return result
    });
  }
  deleteCollection(name) {
    if (name === '默认句集') {
      console.log('默认句集无法删除')
      return;
    }
    let form = new FormData();
    form.append('name', name);

    httpMangaer.API_deleteCollection(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.setState({collections: result.collections})
      }
      console.log('result', result);
    });
  }
  componentWillUpdate(e) {
    console.log('[home]CWU', JSON.stringify(e))
  }

  componentWillReceiveProps(props) {
    console.log('[home]CWRP', JSON.stringify(props))
  }

  componentDidUpdate(d) {
    console.log('[home]CDU', d)
  }

  render() {
    let {location: {
        pathname
      }, layout: {
        backgroundColor
      }, user: {
        nickname
      }} = this.props;
    let frameToShow = null;

    if (/^\/home$/gim.test(pathname)) {

      frameToShow = (<HitoCollection
        changeName={this.changeCollectionName.bind(this)}
        deleteCollection={this.deleteCollection.bind(this)}
        newCollection={this.newCollection.bind(this)}
        viewCollection={this.viewCollection.bind(this)}
        key='hitocollections'
        collections={this.state.collections}/>)
    } else if (/^\/home\//gim.test(pathname)) {
      frameToShow = (<HitokotoList
        loading={this.state.loadingHito}
        key='hitolist'
        hitokotos={this.state.hitokotos}/>)
    }
    class Test extends Component {
      render() {
        return (
          <div>hhhh
          </div>
        )
      }
    }
    return (
      <div key='home' className={home}>
        <div className={left}>
          <p className={username}>{nickname}</p>
          <ul className={menu}>
            <li>
              <Link to='/'>返回首页</Link>
            </li>
            <li>
              <Link to='/home'>Hitokoto</Link>
            </li>
            <li>资料设置</li>
            <li>修改密码</li>
          </ul>
          <Route key="frame" path="/home" component={withRouter(Test)}></Route>
        </div>
        <QueueAnim
          className={right}
          animConfig={[
          {
            opacity: [
              1, 0
            ],
            translateX: [0, -50]
          }, {
            opacity: [
              1, 0
            ],
            position: 'absolute',
            translateX: [0, 50]
          }
        ]}>
          {frameToShow}
          <NewHitokoto
            path='/home/hitokoto/new'
            publish={this.pubulishHitokoto.bind(this)}
            preview={this.previewHitokoto.bind(this)}/>
        </QueueAnim>
        <HitokotoPreview
          path="/home/hitokoto/preview"
          layout={this.props.layout}
          switchLayout={this.switchLayout.bind(this)}
          publish={this.pubulishHitokoto.bind(this)}
          hitokoto={this.state.previewHitokoto}
          layoutHorizon={this.state.horizon}/>
      </div>
    );
  }
}

Home.propTypes = {
  layout: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}
export default withRouter(Home)