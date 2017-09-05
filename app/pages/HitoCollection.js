import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';
import {Card, Card_options, Card_content} from './HitoCollection.css'
import {menu} from './Home.css'
import {ellipsis} from './UI.css'

import CollectionBox from '../component/CollectionBox'
import HitoView from '../component/HitoView'

class HitoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections',
      currentView: null,
      hitokotos: null
    }
    this.viewCollection = this.viewCollection.bind(this);
    this.newCollection = this.newCollection.bind(this);
    this.changeCollectionName = this.changeCollectionName.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
  }
  componentWillUpdate(e) {
    console.log('CWU')
  }

  componentWillReceiveProps(props) {
    console.log('CWRP')
  }

  componentDidUpdate(d) {
    console.log('CDU', d)
  }
  componentDidMount() {
    console.log('CDM');
    this.fetchCollections()
  }
  fetchCollections() {
    httpManager.API_myCollections().then(result => {
      console.log('result mycollection')
      if (result.err) {
        alert(result.err);
      } else {
        this.props.fetchCollectionSuccess(result.collections);
      }
      console.log(result);
    }).catch(e => alert(e));
    console.log('result mycollection')
  }
  viewCollection(name) {
    this.props.history.push('/home/' + name);
  }
  newCollection(name) {
    let form = new FormData();
    form.append('name', name);

    return httpManager.API_newCollection(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.props.fetchCollectionSuccess(result.collections);
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
    httpManager.API_updateCollectionName(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.props.fetchCollectionSuccess(result.collections);
      }
      console.log('result', result);
    });
  }
  deleteCollection(name) {
    if (name === '默认句集') {
      console.log('默认句集无法删除')
      return;
    }
    let form = new FormData();
    form.append('name', name);

    httpManager.API_deleteCollection(form).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.props.fetchCollectionSuccess(result.collections);
      }
      console.log('result', result);
    });
  }
  render() {
    let {status} = this.state;
    let {
        collections: {
          inited,
          data
        }
      } = this.props,
      ListToShow;
    if (inited) {

      ListToShow = data.map((collection, index) => {
        return (<CollectionBox
          changeName={this.changeCollectionName}
          delete={this.deleteCollection}
          tabIndex={index}
          view={this.viewCollection}
          key={collection.name}
          data={collection}/>)
      })
      ListToShow.push(<CollectionBox
        tabIndex={data.length}
        newone={true}
        newCollection={this.newCollection}
        key={'newcol'}
        data={{}}/>);

    } else {
      ListToShow = (
        <div>请求hitokoto中</div>
      )
    }

    return (
      <QueueAnim
        animConfig={[
        {
          opacity: [
            1, 0
          ],
          translateX: [0, 50]
        }, {
          opacity: [
            1, 0
          ],
          position: 'absolute',
          translateX: [0, -50]
        }
      ]}
        className='HitoCollection'>{ListToShow}</QueueAnim>
    )
  }
}
HitoList.propTypes = {
  collections: PropTypes.object.isRequired,
  fetchCollectionSuccess: PropTypes.func.isRequired
}
export default withRouter(HitoList)