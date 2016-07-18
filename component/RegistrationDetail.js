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
import WifiClient from '../utils/WifiClient';

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


export default class RegistrationDetail extends Component {

  constructor(props) {
    super(props);
    this.wifi = new WifiClient('OwnerApp', 'RegistrationDetail');
    this.state = {
      location: props.location,
      learning: false,
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

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigator={this.props.navigator}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) => {
                return null;
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

  cancelLearn() {
    this.setState({learning: false});
  }

  done() {
    this.setState({learning: false});
  }

  learn() {
    this.setState({learning: true});
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        { this.state.learning
          ? this.renderLearning()
          : this.renderInfo()
        }
      </View>
    )
  }

  renderLearning() {
    return (
      <WifiLearning onCancel={this.cancelLearn.bind(this)}
                    onDone={this.done.bind(this)}
                    location={this.state.location}/>
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
      </View>
    );
  }

  gotoNext() {
    this.props.navigator.push({
      id: 'NoNavigatorPage',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    });
  }
}

module.exports = RegistrationDetail;
