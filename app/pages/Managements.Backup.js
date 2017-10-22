import React, {Component} from 'react';

import hitokotoDriver from '../API/hitokotoDriver'
import httpManager from '../API/httpManager'
import showNotification from '../API/showNotification'

import FullPageCard from '../component/FullPageCard'

const patterManager = hitokotoDriver.patterManager;

class Backup extends Component {
  constructor(props) {
    super(props);
  }
  handleBackup() {
    let backup = {
      sources: patterManager.sources,
      patterns: patterManager.patterns
    };
    let base64 = this.encode(backup);

    httpManager.API_backup({data: base64}).then(res => {
      showNotification(res.message, 'success')
    })
  }
  handleRestore() {
    httpManager.API_restore().then(res => {
      let backup = res.backup,
        bakObj;

      if (backup) {
        bakObj = this.decode(backup);

        patterManager.restoreSources(bakObj.sources);
        hitokotoDriver.restorePatterns(bakObj.patterns);
        showNotification('恢复成功！', 'success')
      } else {
        showNotification('无备份！', 'info')

      }
    })
  }
  encode(obj) {
    let string = JSON.stringify(obj),
      safeString = encodeURIComponent(string);

    return window.btoa(safeString); //base64
  }
  decode(base64) {
    let safeString = window.atob(base64),
      string = decodeURIComponent(safeString);
    return JSON.parse(string); //object
  }
  render() {
    return (
      <FullPageCard cardname="备份还原">
        <div className="lum-list ">
          <p>如果是自动同步的话，每一步操作都要备份会很麻烦，所以请手动操作，在多设备间同步您的来源和模式。</p>
          <ul>
            <li>
              <a href="javascript:" onClick={this.handleBackup.bind(this)}>
                <h4>备份</h4>
                <p>将会把本地的来源和模式上传到服务器。</p>
              </a>
            </li>
            <li>
              <a href="javascript:" onClick={this.handleRestore.bind(this)}>
                <h4>还原</h4>
                <p>将会使用服务器上备份的来源和模式替换掉本地的来源和模式</p>
              </a>
            </li>
          </ul>
        </div>
      </FullPageCard>
    )
  }
}
export default Backup
