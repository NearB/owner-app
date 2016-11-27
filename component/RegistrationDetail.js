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
import WifiLearning from './WifiLearning';
import WifiTrack from './WifiTrack';
import WifiClient from '../utils/WifiClient';
import NavLeft from './common/NavigatorLeft';
import MobileClient from '../utils/MobileClient';
import _s from 'underscore.string';

const service = new MobileClient();

const STORES_GROUP = 'Stores';

var _navigator;

export default class RegistrationDetail extends Component {

  constructor(props) {
    super(props);
    this.username = props.username;
    this.store = props.store;
    this.location = props.location;

    if (this.username == null || this.store == null || this.location == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log(this.store);
    console.log({
      username: this.username,
      location: this.location,
    });

    this.findUsername = _s.camelize(_s.clean(`${this.username}:${this.store.name}`).replace(/\s/g, "-"));
    this.findLocation = _s.camelize(_s.clean(`${this.store.name}:${this.location}`).replace(/\s/g, "-"));

    this.wifi = new WifiClient(STORES_GROUP, this.findUsername);

    this.state = {
      track: null,
      learning: false,
      tracking: false,
      closestAp: ''
    };
    this.renderLearning.bind(this);
    this.renderInfo.bind(this);
    this.goToHome.bind(this);
    this.gotoNext.bind(this);
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

  done(locationInfo) {
    const qparams = encodeURI(locationInfo.fingerprints().join(','));
    const user = encodeURI(`${this.username}:${this.store.name}`);


    service.locate('GET', `?beacons=${qparams}&username=${user}&group=Stores`, {})
    .then(res => {
      console.log(res.data);

      const newStore = Object.assign({}, this.store, {locations: this.store.locations.concat(locationInfo.location)})
      service.stores('PUT', this.store._id, {
        body: JSON.stringify(newStore)
      })
      .then(res => {
        console.log("RESPONSE");
        console.log(res.data);
        this.store = res.data;
        this.goToHome();
      })
      .catch(err => {
        console.log("ERROR");
        console.log(err);
      });
    }).catch((error) => {
      console.log(error);
    });

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

  // ========== Render ==========

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
                    location={this.findLocation}
                    username={this.findUsername}/>
    );
  }

  renderTracking() {
    // <Button value="NORMAL RAISED" raised={true} onPress={this.track.bind(this)}
    //         text='Track Current Location' theme='light'/>
    return (
      <WifiTrack onCancel={this.cancelTracking.bind(this)}
                    onDone={this.doneTracking.bind(this)}
                    location={this.findLocation}
                    username={this.findUsername}/>
    );
  }

  renderInfo() {
    return (
      <View>
        <Text style={styles.locationName}>{this.location}</Text>
        <View style={styles.apInfo}>
          <Icon name="wifi" size={this.state.closestAp.height} style={{marginBottom: 10}}/>
          <Text style={styles.data}>{this.state.closestAp}</Text>
        </View>

        <Button value="NORMAL RAISED" raised={true} onPress={this.learn.bind(this)}
                text='Register Access Point' theme='light'/>
      </View>
    );
  }

  goToHome() {
    this.props.navigator.resetTo({
      id: 'UserHome',
      name: 'UserHome',
      username: this.username,
      userId: this.store.ownerId
    });
  }

  gotoNext() {
    this.props.navigator.push({
      id: 'NoNavigatorPage',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    });
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
                  <NavLeft onPress={()=>{ this.props.navigator.pop();}}/>
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
