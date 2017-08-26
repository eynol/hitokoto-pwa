import React, {Component} from 'react';

export default class Index extends Component {
  renders() {
    console.log('app container render')
    let firstFrame = (
      <div
        key="firstFrame"
        style={{
        backgroundColor: this.state.layout.backgroundColor,
        height: '100%',
        overflow: 'hidden'
      }}>

        <HitokotoContainer location={this.props.location} layout={this.state.layout}/>
        <Nav
          inline={true}
          nickname={this.state.nickname}
          navCallbacks={{
          exit: this
            .handleSignOut
            .bind(this)
        }}/>

        <Login
          path='/login'
          loginCallback={this
          .handleSignIn
          .bind(this)}
          loginDone={this
          .updateNameAndToken
          .bind(this)}/>
        <Regist
          path='/regist'
          registCallback={this
          .handleSignUp
          .bind(this)}
          registDone={this
          .updateNameAndToken
          .bind(this)}/>

        <LayoutSetting
          path='/layoutsetting'
          layout={this.state.layout}
          changeLayout={this
          .handleLayoutChange
          .bind(this)}
          patterns={hitokotoDriver.patterManager.patterns}
          currentPatternID={this.state.currentPatternID}
          patternChange={this
          .handlePatternChange
          .bind(this)}/>
        <Route
          path='/exit'
          render={({match, location, history}) => {
          setTimeout(() => {
            this.handleSignOut();
          }, 200);
          return (<Redirect to="/"/>)
        }}/>
        <Copyright/>
      </div>
    );

    return (
      <QueueAnim
        style={{
        width: '100%',
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
      }}
        duration='1000'
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
      ]}>
        <Route path='/' key='/' render={Page1}/>
        <Route path='/home' key='/home' render={Page2}/>
      </QueueAnim>
    )
  }
}