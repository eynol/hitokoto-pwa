import React, {Component} from 'react';
import {Link, withRouter, Route} from 'react-router-dom';
import FullPageCard from '../component/FullPageCard'
import Loading from '../component/Loading'

import httpManager from '../API/httpManager';
import QueueAnim from 'rc-queue-anim';
import CollectionBox from '../component/CollectionBox';

import hitokotoDriver from '../API/hitokotoDriver';

import {CardContainer} from '../component/CollectionBox.css'

class ExploreUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      inited: false
    }
    this.handleView = this.handleView.bind(this);
  }
  componentWillMount() {
    this.exploreUser();
  }
  exploreUser() {
    if (!this.props.uid) {
      return this.props.history.push('/');
    }
    httpManager.API_getPublicUserDetail(this.props.uid).then(result => {
      this.setState({inited: true, user: result.user})
    })
  }
  handleView(colname) {
    this.props.history.push(this.props.location.pathname + '/' + colname);
  }
  addToSource(colname, event) {
    hitokotoDriver.patterManager.newSourceWithUsernameAndCol(this.props.userName, colname);
    this.forceUpdate();
    event.stopPropagation();
  }
  render() {
    let {path, location, userName} = this.props;
    let profile = this.state.user,
      patterManager = hitokotoDriver.patterManager,
      ListToShow = null;
    if (this.state.inited) {
      ListToShow = profile.collectionsCount.map((count, index) => {
        return ({name: profile.collections[index], count: count})
      }).map((item, index) => (
        <CollectionBox
          data={item}
          key={index}
          tabIndex={index}
          viewonly={true}
          view={this.handleView}>
          {patterManager.isSourceExsit(patterManager.getCORSUrlOfUserCol(userName, item.name))
            ? null
            : (
              <a
                href="javascript:"
                tabIndex={index}
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
          : (<Loading key="loading"/>)}
      </FullPageCard>
    )
  }
}
export default withRouter(ExploreUser)
// export default About