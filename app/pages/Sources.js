import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import hitokotoDriver from '../API/hitokotoDriver'
import FullPageCard from '../component/FullPageCard'
import SourceDisplay from '../component/SourceDisplay'
import style from './UI.css';

let {
  manageBox,
  clearfix,
  'close-button': closeButton,
  icon,
  close,
  sourcesList,
  back,
  backButton,
  ellipsis
} = style;

class Sources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: hitokotoDriver.patterManager.sources,
      update: undefined,
      newSource: undefined
    }
  }

  showNewSource() {
    this.setState({
      newSource: Date.now()
    })
  }
  handleNewSource(source, error) {
    if (source.adapter) {
      hitokotoDriver
        .testSourceAdapter(source.url, source.adapter)
        .then(() => {
          hitokotoDriver
            .patterManager
            .newSource(source);
          this.setState({sources: hitokotoDriver.patterManager.sources, newSource: undefined})
        })
        .catch((e) => {
          if (typeof e == 'string') {
            alert(e);
          } else if (typeof e == 'object') {
            alert(e.message || e.err.message);
          }
        })

    } else {
      hitokotoDriver
        .patterManager
        .newSource(source);
      this.setState({newSource: undefined})
    }

  }
  hideNewSource() {
    this.setState({newSource: undefined})
  }
  showUpdate(id) {
    this.setState({update: id});
  }
  handleUpdate(source) {
    if (source.adapter) {
      hitokotoDriver
        .testSourceAdapter(source.url, source.adapter)
        .then(() => {
          hitokotoDriver
            .patterManager
            .updateSource(source.id, source);
          this.setState({update: undefined})
        })
        .catch((e) => {
          if (typeof e == 'string') {
            alert(e);
          } else if (typeof e == 'object') {
            alert(e.message || e.err.message);
          }
        })

    } else {
      hitokotoDriver
        .patterManager
        .updateSource(source.id, source);
      this.setState({update: undefined})
    }
  }
  handleDeleteSource(id) {
    if (confirm('确认删除该来源？')) {

      hitokotoDriver
        .patterManager
        .deleteSource(id);

      this.setState({update: undefined})
    }
  }
  hideUpdate() {
    this.setState({update: undefined});
  }
  render() {
    let lists = this
      .state
      .sources
      .map((source) => {
        return (
          <li key={source.id}>
            <p className={ellipsis}>
              <button
                onClick={this
                .showUpdate
                .bind(this, source.id)}>修改</button>&nbsp; {source.name}
              - {source.url}</p>
          </li>
        )
      })

    let sourceDisplayC;
    if (this.state.update) {
      let sourceToUpdate = this
        .state
        .sources
        .find(source => {
          if (source.id == this.state.update) {
            return true;
          } else {
            return false;
          }
        })
      sourceDisplayC = (<SourceDisplay
        title='修改'
        sid={this.state.update}
        hook={{
        update: this
          .handleUpdate
          .bind(this),
        delete: this
          .handleDeleteSource
          .bind(this),
        hide: this
          .hideUpdate
          .bind(this)
      }}
        source={sourceToUpdate}/>)
    } else if (this.state.newSource) {
      sourceDisplayC = (<SourceDisplay
        title='新增'
        hook={{
        newSource: this
          .handleNewSource
          .bind(this),
        hide: this
          .hideNewSource
          .bind(this)
      }}/>)
    }

    return (

      <FullPageCard>
        <div className={manageBox}>
          <h1 className={clearfix}>来源管理
            <Link to='/' className={closeButton}>
              <i className={icon + ' ' + close}></i>
            </Link>
            <Link to='/' className={backButton}>
              <i className={icon + ' ' + back}></i>
            </Link>
          </h1>
          <hr/>
          <p>
            <i>Tips:</i>
            在这里添加其他域名下的hitokoto一言接口，然后在<Link to='/patterns'>模式管理</Link>中使用哦~</p>
          <div>
            <QueueAnim component="ul" className={sourcesList}>
              {lists}
              <li key="new">
                <button
                  onClick={this
                  .showNewSource
                  .bind(this)}
                  style={{
                  float: 'right'
                }}>添加</button>
              </li>
            </QueueAnim>
          </div>
          {sourceDisplayC}
        </div>
      </FullPageCard>

    );
  }
}

export default Sources;