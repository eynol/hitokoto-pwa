import React, {Component} from 'react'
import PropTypes from 'prop-types'

import QueueAnim from 'rc-queue-anim';
import httpManager from '../API/httpManager';
import showNotification from '../API/showNotification';

import CollectionBox from '../component/CollectionBox'
import HitoView from '../component/HitoView'
import Modal from '../component/Modal';
import Loading from '../component/Loading'

import {CardContainer} from '../component/CollectionBox.css'

class HitoCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections',
      currentView: null,
      hitokotos: null,
      inited: false,
      error: null,
      deleteCollectionModal: null
    }

    this.fetchCollections = this.fetchCollections.bind(this);

    this.viewCollection = this.viewCollection.bind(this);
    this.newCollection = this.newCollection.bind(this);
    this.changeCollectionName = this.changeCollectionName.bind(this);

    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.deleteCollection = this.deleteCollection.bind(this);
  }

  componentDidMount() {
    this.fetchCollections()
  }
  fetchCollections() {
    httpManager.API_myCollections().then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        this.setState({inited: true, error: null});
        this.props.fetchCollectionSuccess(result.collections);
      }
    }).catch(e => {
      this.setState({error: e, inited: false});
      showNotification(e, 'error');
    });
  }
  viewCollection(name) {
    this.props.history.push('/home/' + name);
  }
  newCollection(name) {
    return httpManager.API_newCollection({name}).then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        showNotification('新增句集成功！', 'success');
        this.props.fetchCollectionSuccess(result.collections);
      }
    })
  }
  changeCollectionName(oldname, newname) {
    if (oldname === '默认句集') {
      showNotification('默认句集无法修改', 'error');
      return;
    }

    httpManager.API_updateCollectionName({oldname, newname}).then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        showNotification('重命名句集成功！', 'success');
        this.props.fetchCollectionSuccess(result.collections);
      }
    });
  }
  showDeleteModal(collectionName) {
    if (collectionName === '默认句集') {
      showNotification(默认句集无法删除, 'error');
      return;
    }
    this.setState({deleteCollectionModal: collectionName})
  }
  hideDeleteModal() {

    this.setState({deleteCollectionModal: null});
  }
  deleteCollection() {
    let name = this.state.deleteCollectionModal;
    httpManager.API_deleteCollection({name}).then(result => {
      if (result.err) {
        showNotification(result.err, 'error');
      } else {
        this.hideDeleteModal();
        showNotification('删除句集成功！', 'success');
        this.props.fetchCollectionSuccess(result.collections);
      }
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
          delete={this.showDeleteModal}
          tabIndex={index}
          view={this.viewCollection}
          key={collection.name}
          data={collection}/>)
      })
      ListToShow.unshift(<CollectionBox
        tabIndex={data.length}
        newone={true}
        newCollection={this.newCollection}
        key={'newcol'}
        data={{}}/>);

    } else {
      ListToShow = (<Loading error={this.state.error} retry={this.fetchCollections} key="loading"/>)
    }

    return [
      (
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
      ), this.state.deleteCollectionModal
        ? <Modal exit={this.hideDeleteModal}>
            <h1>你确定要删除该hitokoto?</h1>
            <div className="clearfix">
              <span className="pull-right">
                <button role="exit">取消</button>
                <button onClick={this.deleteCollection}>确定</button>
              </span>
            </div>
          </Modal>
        : null
    ]
  }
}
HitoCollection.propTypes = {
  history: PropTypes.object.isRequired,
  collections: PropTypes.object.isRequired,
  fetchCollectionSuccess: PropTypes.func.isRequired
}
export default HitoCollection