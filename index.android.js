import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Navigator,TouchableOpacity, TouchableHighlight,
  NativeModules
} from 'react-native';

var AccessPointDetail = require('./AccessPointDetail');
var AccessPointList = require('./AccessPointList');

class App extends Component {
  render() {
    return (
      <Navigator
          initialRoute={{id: 'AccessPointList', name: 'List'}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }} />
    );
  }

  renderScene(route, navigator) {
    var routeId = route.id;

    if (routeId === 'AccessPointList') {
      return (
        <AccessPointList
          navigator={navigator}/>
      );
    }
    if (routeId === 'AccessPointDetail') {
      return (
        <AccessPointDetail
          navigator={navigator}
          accessPoint={route.accessPoint} />
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

var styles = StyleSheet.create({
});

AppRegistry.registerComponent('OwnerApp', () => App);
