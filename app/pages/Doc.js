import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import FullPageCard from '../component/FullPageCard'

import {thanksList, debug, article} from './About.css';

export default function Doc(props) {

  return (
    <FullPageCard cardname="接口文档">
      <div className={article}>
        <section>
          <h2>#1 获取一个hitokoto</h2>
          <p>
            <b>GET</b>&nbsp;
            <span>https://hitokoto.heitaov.cn/cors</span>
          </p>
          <h4>Query参数：</h4>
          <blockquote>
            <ul>
              <li>
                <b>seed</b>(可选):整数类型，种子计数器，用于顺序获取hitokoto。</li>
              <li>
                <b>jsonp</b>(可选):String类型，jsonp函数名</li>
            </ul>
          </blockquote>
          <br/>
          <h4>示例:</h4>
          <p>https://hitokoto.heitaov.cn/cors/偏执狂/默认句集?seed=2333</p>
          <h4>返回结果</h4>
          <blockquote>
            <pre>
                <code>
                  {`
  {
    "_id":"59e701bb441b87b015878046",           //句子的数据库唯一id
    "updated_at":"2017-10-18T07:24:43.872Z",    //句子更新时间
    "created_at":"2017-10-18T07:24:43.872Z",    //句子创建时间
    "id":50,                                    //句子的顺序ID,
    "source":"fate/stay night",                 //句子的来源
    "author":"",                                //句子的作者是谁
    "category":"其他",                          //句子的分类
    "hitokoto":"Excalibur!",                   //句子的内容
    "creator_id":"59e6fddfa94d61a551c0a64d",   //创建者的id
    "state":"public",                          //当前句子的状态
    "creator":"emmmmm",                        //创建者的名字
    "fid":"59e6fddfa94d61a551c0a64e",          //句集的数据库唯一id
    "collection":"默认句集"                     //句集的名称
  }
  `}
                </code></pre>
          </blockquote>
        </section>
        <section>
          <h2>#2 获取某个句集下的hitokoto</h2>
          <p>
            <b>GET</b>&nbsp;
            <span>https://hitokoto.heitaov.cn/cors/:username/:collection</span>
          </p>
          <h4>Path参数：</h4>
          <blockquote>
            <ul>
              <li>
                <b>username</b>(必选):String类型，用户的名字</li>
              <li>
                <b>collection</b>(必选):String类型，句集的名字</li>
            </ul>
          </blockquote>
          <h4>Query参数：</h4>
          <blockquote>
            <ul>
              <li>
                <b>seed</b>(可选):整数类型，种子计数器，用于顺序获取hitokoto。</li>
              <li>
                <b>jsonp</b>(可选):String类型，jsonp函数名</li>
            </ul>
          </blockquote>
          <br/>
          <h4>返回结果</h4>
          <blockquote>
            <pre>
              <code>
                {`
  {
  "_id":"59e701bb441b87b015878046",           //句子的数据库唯一id
  "updated_at":"2017-10-18T07:24:43.872Z",    //句子更新时间
  "created_at":"2017-10-18T07:24:43.872Z",    //句子创建时间
  "id":50,                                    //句子的顺序ID,
  "source":"fate/stay night",                 //句子的来源
  "author":"",                                //句子的作者是谁
  "category":"其他",                          //句子的分类
  "hitokoto":"Excalibur!",                   //句子的内容
  "creator_id":"59e6fddfa94d61a551c0a64d",   //创建者的id
  "state":"public",                          //当前句子的状态
  "creator":"emmmmm",                        //创建者的名字
  "fid":"59e6fddfa94d61a551c0a64e",          //句集的数据库唯一id
  "collection":"默认句集"                     //句集的名称
  }
  `}
              </code></pre>
          </blockquote>
        </section>
      </div>
    </FullPageCard>
  )
}
