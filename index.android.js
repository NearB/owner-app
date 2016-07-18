import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  Navigator,
  StyleSheet,
  TouchableOpacity,
  BackAndroid
} from 'react-native';

import RegistrationDetail from './component/RegistrationDetail';
import HomeView from './component/HomeView';

var _navigator; // we fill this up upon on first navigation.

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator.getCurrentRoutes().length === 1  ) {
    return false;
  }
  _navigator.pop();
  return true;
});

class App extends Component {

  render() {
    return (
      <Navigator
          initialRoute={{id: 'HomeView', name: 'List'}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }}
      />
    );
  }

  renderScene(route, navigator) {
    var routeId = route.id;
    _navigator = navigator;

    if (routeId === 'HomeView') {
      return (
        <HomeView
          navigator={navigator}/>
      );
    }
    if (routeId === 'RegistrationDetail') {
      return (
        <RegistrationDetail
          navigator={navigator}
          location={route.location} />
      );
    }
    return this.noRoute(navigator);
  }

  noRoute(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}> NO ROUTE NO ROUTE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

AppRegistry.registerComponent('OwnerApp', () => App);
