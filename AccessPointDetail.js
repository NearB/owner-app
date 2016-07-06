import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableOpacity,
  Navigator,
  NativeModules
} from 'react-native';
import _ from 'underscore'

class AccessPointDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      ap: props.accessPoint,
      navBar: {
        LeftButton(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
              onPress={() => navigator.parentNavigator.pop()}>
            <Image
              style={styles.resizeMode}
              resizeMode={Image.resizeMode.contain}
              source={require('./back-arrow.png')}
            />
            </TouchableOpacity>
          );
        },

        RightButton(route, navigator, index, navState) { return null;},

        Title(route, navigator, index, navState) {
          return (
            <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: 'white', margin: 10, fontSize: 16}}>
                {props.accessPoint.name}
              </Text>
            </TouchableOpacity>
          );
        }
      }
    };
  }

  render() {
    return (
      <Navigator
      renderScene={this.renderScene.bind(this)}
      navigator={this.props.navigator}
      navigationBar={
        <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
          routeMapper={this.state.navBar} />
      } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={this.gotoNext.bind(this)}>
          <Text style={styles.title}>SSID: {this.state.ap.SSID}</Text>
          <Text style={styles.title}>Level: {this.state.ap.level}</Text>
          <Text style={styles.data}>{this.state.ap.BSSID}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  gotoNext() {
    this.props.navigator.push({
      id: 'NoNavigatorPage',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    justifyContent: 'center'
  },
  data: {
    color: '#656565'
  },
  resizeMode: {
    width: 90,
    height: 60,
    borderWidth: 0
  }
});

module.exports = AccessPointDetail;
