import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Task from '../API/Task';
import showNotification from '../API/showNotification';
import timeTransform from '../API/social-time-transform';
import httpManager from '../API/httpManager';
import indexedDBManager from '../API/IndexedDBManager'
import offlineWatcher from '../API/Offline'
import hitokotoDriver from '../API/hitokotoDriver'
const patterManager = hitokotoDriver.patterManager;

import FullPageCard from '../component/FullPageCard'

class Sync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swSupported: null,
      localLength: null, //本地已缓存的长度
      syncLength: patterManager.sources.map(() => 'loading'), // 服务器端的长度,
      syncRecord: null, //本地同步记录
      working: false, //是否有同步操作
      isUnmounted: false
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log('cwrp')
  }
  componentWillUnmount() {
    console.log('unmouted')
    this.setState({isUnmounted: true})
  }
  componentWillMount() {
    this.setState(state => {
      if ('serviceWorker' in navigator) {
        state.swSupported = true;
      };
      if (offlineWatcher.online) {
        //在线，去请求每一个来源，获得总数

      } else {
        //离线
      }
      return state;
    });

    //本地缓存长度
    Promise.all(patterManager.sources.map(source => {
      return indexedDBManager.getHitokotoCount(source.url)
    })).then(result => {
      if (!this.state.isUnmounted) {
        this.setState({localLength: result})
      }
    });

    //本地 同步记录
    Promise.all(patterManager.sources.map(source => {
      return indexedDBManager.getSyncRecord(source.url)
    })).then(result => {
      if (!this.state.isUnmounted) {
        this.setState({syncRecord: result})
      }
    })

    //  服务器端总长度
    patterManager.sources.map((src, index) => {
      return httpManager.API_sync(src.url).catch(e => {
        showNotification('同步功能检测失败！\n来源名：' + src.name + '\nURL:' + src.url, 'error', true)
        return ({})
      }).then(res => res.sync).then(count => {
        if (!this.state.isUnmounted) {
          this.setState(state => {
            state.syncLength[index] = count;
            return state;
          })
        }
      })
    })
    /*
    Promise.all(patterManager.sources.map(src => {
      return httpManager.API_sync(src.url).catch(e => ({}));
    })).then(result => {
      let syncLength = result.map(res => res.sync);
      if (!this.state.isUnmounted) {
        console.log(syncLength);
        this.setState({syncLength: syncLength})
      }
    })
    */
  }
  refreshOneSource(index) {

    let url = patterManager.sources[index].url;
    if (!this.state.isUnmounted) {

      this.setState({working: false})
    }
    //local lengths
    indexedDBManager.getHitokotoCount(url).then(result => {
      if (!this.state.isUnmounted) {
        this.setState(state => {
          state.localLength[index] = result;
        })
      }
    });

    //sync Record
    indexedDBManager.getSyncRecord(url).then(result => {
      if (!this.state.isUnmounted) {
        this.setState(state => {
          state.syncRecord[index] = result;
          return state;
        })
      }
    });

    //serverSide length
    httpManager.API_sync(url).catch(e => {
      showNotification('同步功能检测失败！\n来源名：' + patterManager.sources[index].name + '\nURL:' + url, 'error', true)
      return ({})
    }).then(res => res.sync).then(count => {
      if (!this.state.isUnmounted) {
        this.setState(state => {
          state.syncLength[index] = count;
          return state;
        })
      }
    })
  }
  syncOne(index) {
    this.setState({working: true})
    let task = new Task();
    task.update('开始缓存任务！')
    //
    let source = patterManager.sources[index],
      local = this.state.localLength[index],
      size = this.state.syncLength[index],
      record = this.state.syncRecord[index],
      url = source.url,
      cursor,
      $syncedLength = 0;

    if (record && record.lastCursor != 'empty') {
      cursor = record.lastCursor;
    } else {
      cursor = 'empty';
    }

    let recursional = (url, cursor) => {
      return httpManager.API_sync(url, {cursor}).then(result => {
        //
        let data = result.data,
          limit = result.limit,
          size = data.length,
          maybeMore = size == limit;

        if (size > 0) {
          cursor = data[size - 1]._id
        }
        $syncedLength += size;

        return indexedDBManager.putHitokotoBulk(url, data).then(result => indexedDBManager.putSyncRecord(url, {
          lastTime: new Date(),
          lastCursor: cursor
        })).then((foo) => {
          task.update('已缓存:' + $syncedLength + '条...')
          if (maybeMore) {
            return recursional(url, cursor)
          }
        })
      });
    }
    recursional(url, cursor).catch(e => {
      task.failed('同步失败！')
      return; //返回正常值，继续then
    }).then(() => {
      //递归调用结束了
      if ($syncedLength == 0) {
        showNotification('同步了0条记录，可能的原因：\n1.用户将以前的句子删除了\n2.用户将以前的句子设置为私密\n3.如果开启审核机制，用户修改了句子，那么句子将处于审核状态\n' +
            '4.遇到了bug',
        'error', true)
      } else {

        task.success('同步了' + $syncedLength + '条记录！')
      }
      this.refreshOneSource(index);
    })

  }
  render() {
    let list, {localLength, syncLength, syncRecord, working} = this.state;

    if (!localLength) {
      list = patterManager.sources.map((src, index) => (
        <li key={src.id}>
          <div>
            <h4>{src.name}</h4>
            <p className="txt-sm">
              <i className="iconfont icon-loading-anim"></i>载入中
            </p>
            <p className="acts">
              <button className="disabled">载入中....</button>
            </p>
          </div>
        </li>
      ))
    } else if (localLength) {
      list = patterManager.sources.map((src, index) => {
        let supportSync = syncLength[index];

        if (supportSync == 'loading') {
          return (
            <li key={src.id}>
              <div>
                <h4>{src.name}</h4>
                <p className="txt-sm">
                  已缓存{localLength[index]}/<i className="iconfont icon-loading-anim"></i>检测同步功能中
                </p>
                <p className="acts">
                  <button className="disabled">等待检测完毕....</button>
                </p>
              </div>
            </li>
          )

        } else if (supportSync === undefined) {
          return (
            <li key={src.id}>
              <div>
                <h4>{src.name}</h4>
                <p className="txt-sm">
                  已缓存{localLength[index]}/<span className="color-red">不支持同步</span>
                </p>
                <p className="acts">
                  <button className="disabled">暂不支持</button>
                </p>
              </div>
            </li>
          )

        } else {
          //云端返回了总数据
          let local = localLength[index],
            length = syncLength[index],
            record;
          if (syncRecord) {
            record = syncRecord[index];

            if (local >= length || length == 0) {
              //不用同步
              return (
                <li key={src.id}>
                  <div>
                    <h4>{src.name}</h4>
                    <p className="txt-sm">
                      已缓存{local}/{length} {record
                        ? ' - 上次同步于' + timeTransform(record.lastTime)
                        : null}
                    </p>
                    <p className="acts">
                      <button className="disabled">无需同步</button>
                    </p>
                  </div>
                </li>
              )
            } else {
              //前去同步
              return (
                <li key={src.id}>
                  <div>
                    <h4>{src.name}
                      <span className="new-info">可更新{length - local}</span>
                    </h4>
                    <p className="txt-sm">
                      已缓存{local}/{length}{record
                        ? ' - 上次同步于' + timeTransform(record.lastTime)
                        : null}
                    </p>
                    <p className="acts">
                      {working
                        ? <button className="disabled">
                            <i className="iconfont icon-loading-anim"></i>同步中</button>
                        : <button onClick={this.syncOne.bind(this, index)}>同步</button>}
                    </p>
                  </div>
                </li>
              )
            }

          } else {
            //还未获取本地缓存记录
            return (
              <li key={src.id}>
                <div>
                  <h4>{src.name}</h4>
                  <p className="txt-sm">
                    已缓存{local}/{length}
                  </p>
                  <p className="acts">
                    <button className="disabled">获取同步历史记录中....</button>
                  </p>
                </div>
              </li>
            )
          }
        }
      })
    }

    return (
      <FullPageCard cardname="离线缓存">
        <div className="lum-list tryFlexContainer">
          <ul>
            {list}
          </ul>
        </div>
      </FullPageCard>
    )
  }
}
export default Sync
