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

console.disableYellowBox = true;
import HomeView from './component/HomeView';

import UserLogin from './component/container/UserLogin';
import UserHome from './component/container/UserHome';
import AddStore from './component/container/AddStore';
import AddLocation from './component/container/AddLocation';
import StoreDetails from './component/container/StoreDetails';


import RegistrationDetail from './component/RegistrationDetail';

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
          initialRoute={{id: 'UserLogin', name: 'Login'}}
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

    if (routeId === 'UserLogin') {
      return (
        <UserLogin
          navigator={navigator}/>
      );
    }
    if (routeId === 'UserHome') {
      return (
        <UserHome
          navigator={navigator}
          username={route.username}
          userId={route.userId} />
      );
    }
    if (routeId === 'StoreDetails') {
      return (
        <StoreDetails
          navigator={navigator}
          store={route.store}
          username = {route.username}
          />
      );
    }
    if (routeId === 'AddStore') {
      return (
        <AddStore
          navigator={navigator}
          username={route.username}
          userId={route.userId} />
      );
    }
    if (routeId === 'AddLocation') {
      return (
        <AddLocation
          navigator={navigator}
          username={route.username}
          store={route.store}/>
      );
    }
    if (routeId === 'RegistrationDetail') {
      return (
        <RegistrationDetail
          navigator={navigator}
          location={route.location}
          username= {route.username}
          store={route.store}/>
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
