import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';
import CollectionBox from '../component/CollectionBox'
import HitoView from '../component/HitoView'

import Loading from '../component/Loading'
import {CardContainer} from '../component/CollectionBox.css'

class HitoCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections',
      currentView: null,
      hitokotos: null,
      inited: false
    }
    this.viewCollection = this.viewCollection.bind(this);
    this.newCollection = this.newCollection.bind(this);
    this.changeCollectionName = this.changeCollectionName.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
  }

  componentDidMount() {
    this.fetchCollections()
  }
  fetchCollections() {
    httpManager.API_myCollections().then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.setState({inited: true});

        this.props.fetchCollectionSuccess(result.collections);
      }
      console.log(result);
    }).catch(e => alert(e));
  }
  viewCollection(name) {
    this.props.history.push('/home/' + name);
  }
  newCollection(name) {
    return httpManager.API_newCollection({name}).then(result => {
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

    httpManager.API_updateCollectionName({oldname, newname}).then(result => {
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
    httpManager.API_deleteCollection({name}).then(result => {
      if (result.err) {
        alert(result.err);
      } else {
        this.props.fetchCollectionSuccess(result.collections);
      }
      console.log('result', result);
    });
  }
  render() {
    let {status, inited} = this.state;
    let {collections: {
          data
        }} = this.props,
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
      ListToShow = (<Loading key="loading"/>)
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
        className={CardContainer}>{ListToShow}</QueueAnim>
    )
  }
}
HitoCollection.propTypes = {
  collections: PropTypes.object.isRequired,
  fetchCollectionSuccess: PropTypes.func.isRequired
}
export default withRouter(HitoCollection)