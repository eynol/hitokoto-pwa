import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver';

let httpMangaer = hitokotoDriver.httpManager;

import {Card, Card_options, Card_content} from './HitoCollection.css'
import {menu} from './Home.css'
import {ellipsis} from './UI.css'

import CollectionBox from '../component/CollectionBox'
import HitoView from '../component/HitoView'

class HitoCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'collections',
      currentView: null,
      hitokotos: null
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let pathname = nextProps.location.pathname;
    let result = pathname == '/home' || this.props.location.pathname == '/home';

    console.log('SCU', result);
    return result;
  }
  viewCollection(name) {
    this
      .props
      .viewCollection(name);
  }
  componentWillUpdate(e) {
    console.log('CWU', JSON.stringify(e))
  }

  componentWillReceiveProps(props) {
    console.log('CWRP', JSON.stringify(props))
  }

  componentDidUpdate(d) {
    console.log('CDU', d)
  }
  componentDidMount() {
    console.log('CDM')
  }
  render() {
    let {status} = this.state;
    let {collections, location: {
          pathname
        }} = this.props,
      ListToShow;

    if (pathname == '/home') {
      ListToShow = collections.map((collection, index) => {
        return (<CollectionBox
          changeName={this.props.changeName}
          delete={this.props.deleteCollection}
          tabIndex={index}
          view
          ={this
          .viewCollection
          .bind(this)}
          key={collection.name}
          data={collection}/>)
      });
      if (collections.length != 0) {

        ListToShow.push(<CollectionBox
          tabIndex={collections.length}
          newone={true}
          newCollection={this.props.newCollection}
          key={'newcol'}
          data={{}}/>);
      }
    } else {
      ListToShow = null;
    }

    console.log(ListToShow);
    return (
      <QueueAnim
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
      ]}
        className='HitoCollection'>{ListToShow}</QueueAnim>
    )
  }
}
export default withRouter(HitoCollection)