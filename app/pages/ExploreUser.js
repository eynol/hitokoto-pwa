import React, {Component} from 'react';
import {Link, withRouter, Route} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import Loading from '../component/Loading'

import httpManager from '../API/httpManager';
import QueueAnim from 'rc-queue-anim';
import CollectionBox from '../component/CollectionBox';

import hitokotoDriver from '../API/hitokotoDriver';
import showNotification from '../API/showNotification';

import {CardContainer} from '../component/CollectionBox.css'

class ExploreUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      inited: false,
      error: null
    }
    this.handleView = this.handleView.bind(this);
    this.exploreUser = this.exploreUser.bind(this);
  }
  componentWillMount() {
    this.exploreUser();
  }
  exploreUser() {
    if (!this.props.uid) {
      return this.props.history.push('/');
    }
    httpManager.API_getPublicUserDetail(this.props.uid).then(result => {
      this.setState({inited: true, error: null, user: result.user})
    }).catch(e => {
      this.setState({
        error: e.message || e || '获取用户句集失败',
        inited: false
      });
      showNotification('获取用户句集失败', 'error');
    })
  }
  handleView(colname) {
    this.props.history.push(this.props.location.pathname + '/' + colname);
  }
  removeFromSoure(colname, evt) {
    hitokotoDriver.patterManager.removeSourceWithUsernameAndCol(this.props.userName, colname, true);
    showNotification('已从来源中移除「' + colname + '」!\n如果模式中含有该句集，请在「模式管理中删除」', 'info', false, 4)
    this.forceUpdate();
    evt.stopPropagation();
  }
  addToSource(colname, event) {
    hitokotoDriver.patterManager.newSourceWithUsernameAndCol(this.props.userName, colname, true);
    showNotification('已添加「' + colname + '」至来源!\n将会获取该来源内「公开」的句子', 'success')
    this.forceUpdate();
    event.stopPropagation();
  }
  render() {
    let {path, location, userName} = this.props;
    let profile = this.state.user,
      patterManager = hitokotoDriver.patterManager,
      ListToShow = null;
    if (this.state.inited) {
      ListToShow = profile.collections.map((item, index) => (
        <CollectionBox
          data={item}
          key={index}
          tabIndex={index + 1}
          viewonly={true}
          view={this.handleView}>
          {patterManager.isSourceExsit(patterManager.getUrlOfUserCol(userName, item.name, true))
            ? (
              <a
                href="javascript:"
                tabIndex={index + 1}
                onClick={this.removeFromSoure.bind(this, item.name)}>从来源中删除</a>
            )
            : (
              <a
                href="javascript:"
                tabIndex={index + 1}
                onClick={this.addToSource.bind(this, item.name)}>加入来源</a>
            )}
        </CollectionBox>
      ));

    };
    return (
      <FullPageCard cardname={userName}>
        {this.state.inited
          ? (
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
          : (<Loading error={this.state.error} retry={this.exploreUser} key="loading"/>)}
      </FullPageCard>
    )
  }
}
export default withRouter(ExploreUser)
// export default About