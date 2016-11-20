'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  ToolbarAndroid,
  NativeModules
} from 'react-native';

import {Button} from 'react-native-material-design';
import Icon from 'react-native-vector-icons/FontAwesome';
import WifiLearning from './FingerprintLearnWork';
import WifiTrack from './FingerprintTrackWork';
import WifiClient from '../utils/WifiClient';

var _navigator;

export default class RegistrationDetail extends Component {

  constructor(props) {
    super(props);
    this.username = props.username;

    this.wifi = new WifiClient('OwnerApp', this.username);

    this.state = {
      location: props.location,
      track: null,
      learning: false,
      tracking: false,
      closestAp: ''
    };
    this.renderLearning.bind(this);
    this.renderInfo.bind(this);
  }

  componentDidMount() {
    this.wifi.getNearestAp()
      .then((ap) => {
        this.setState({closestAp: ap.name})
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // =========== learning ===========
  cancelLearn() {
    this.setState({learning: false});
  }

  done() {
    this.setState({learning: false});
  }

  learn() {
    this.setState({learning: true});
  }

  // =========== tracking ===========
  cancelTracking() {
    this.setState({tracking: false});
  }

  track() {
    this.setState({tracking: true});
  }

  doneTracking(trackResult) {
    this.setState({
      tracking: false,
      track: trackResult
    });
  }

  renderScene(route, navigator) {
    _navigator = navigator;

    return (
      <View style={styles.container}>
        { this.state.learning || this.state.tracking
          ? this.renderAction()
          : this.renderInfo()
        }
      </View>
    )
  }

  renderAction(route, navigator) {
    return (
      <View style={styles.container}>
        { this.state.learning
          ? this.renderLearning()
          : this.renderTracking()
        }
      </View>
    )
  }


  renderLearning() {
    return (
      <WifiLearning onCancel={this.cancelLearn.bind(this)}
                    onDone={this.done.bind(this)}
                    location={this.state.location}
                    username={this.username}/>
    );
  }

  renderTracking() {
    return (
      <WifiTrack onCancel={this.cancelTracking.bind(this)}
                    onDone={this.doneTracking.bind(this)}
                    location={this.state.location}
                    username={this.username}/>
    );
  }

  renderInfo() {
    return (
      <View>
        <Text style={styles.locationName}>{this.state.location}</Text>
        <View style={styles.apInfo}>
          <Icon name="wifi" size={this.state.closestAp.height} style={{marginBottom: 10}}/>
          <Text style={styles.data}>{this.state.closestAp}</Text>
        </View>

        <Button value="NORMAL RAISED" raised={true} onPress={this.learn.bind(this)}
                text='Register Access Point' theme='light'/>

        <Button value="NORMAL RAISED" raised={true} onPress={this.track.bind(this)}
                text='Track Current Location' theme='light'/>
      </View>
    );
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
              { return (
                  <Icon name="sign-out"
                    allowFontScaling={true}
                    onPress={()=>{
                      if (_navigator.getCurrentRoutes().length >= 1  ) {
                        _navigator.pop();
                      }
                    }}
                  />
                );
              },
              RightButton: (route, navigator, index, navState) => {
                return null;
              },
              Title: (route, navigator, index, navState) => {
                return (<Text style={styles.barTitle}>New Location</Text>);
              },
            }}
            style={{backgroundColor: '#FA8428'}}
          />
        }/>
    );
  }


  gotoNext() {
    this.props.navigator.push({
      id: 'NoNavigatorPage',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  barTitle: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10,
    color: 'white'
  },
  locationName: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10
  },
  data: {
    color: '#656565',
    marginBottom: 10
  },
  apInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  }
});


module.exports = RegistrationDetail;
