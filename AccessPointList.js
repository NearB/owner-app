import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Navigator,
  TouchableNativeFeedback,
  RefreshControl,
  NativeModules
} from 'react-native';

import _ from 'underscore'
import _s from 'underscore.string';
// import ActionButton from 'react-native-action-button';
// import Icon from 'react-native-vector-icons/Ionicons';


var WifiManager = NativeModules.WifiManager;

class AccessPointList extends Component {

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });
    this.state = {
      dataSource:ds.cloneWithRows(['row 1', 'row 2']),
      refreshing: false
    }

    this.startScan = this.startScan.bind(this);
  }

  componentDidMount() {
    this.updateListedAccessPoints();
  }

  updateListedAccessPoints() {
      this.loadWifiList((scan) => {
        console.log('loadWifiList callback');
        this.setState({
          // wifiArray is an array of strings, each string being the SSID
          dataSource: this.state.dataSource.cloneWithRows(
            _.map(scan, function(val, name){
              var apData = JSON.parse(val);
              return {
                name: _s.humanize(apData.SSID),
                SSID: apData.SSID,
                BSSID: apData.BSSID,
                level: apData.level,
                timeStamp: apData.timestamp
              };
            }))
          });
          // console.log(this.state.dataSource);
        });
    }

    loadWifiList(callback){
      WifiManager.getScanResults(
        (result) => {
          console.log(result);
          callback(result);
        },
        (msg) => {
          console.log(result);
        }
      );
    }

    startScan(){
      console.log("Starting scan");
      WifiManager.startScan(
        () => {
          setTimeout(() => {
             this.updateListedAccessPoints();
          }, 2000);
        },
        (msg) => {
          console.log(result);
        }
      );
    }

    render() {
      return (
        <Navigator
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar style={{backgroundColor: '#246dd5', alignItems: 'center'}}
          routeMapper={NavigationBarRouteMapper} />
        } />
      );
    }

    renderScene(route, navigator) {
      return (
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderAccessPoint.bind(this)}
        style={styles.listView}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.startScan.bind(this)}
          />}
        />
      );
    }
    renderAccessPoint(ap) {
      return (
        <TouchableHighlight onPress={this.gotoNext.bind(this, ap)}  underlayColor='#dddddd'>
        <View>
        <Text style={styles.title}>SSID: {ap.SSID}</Text>
        <Text style={styles.author}>{ap.BSSID}</Text>
        </View>
        </TouchableHighlight>
      );
    }

    gotoNext(ap) {
      this.props.navigator.push({
        id: 'AccessPointDetail',
        name: 'AccessPointDetail',
        accessPoint: ap
      });
    }
  }

  var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
      return null;
    },
    RightButton(route, navigator, index, navState) {
      return null;
    },
    Title(route, navigator, index, navState) {
      return (
          <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Available Access Points
          </Text>
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    listView: {
      backgroundColor: '#F5FCFF'
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: 20,
      marginBottom: 8,
    },
    author: {
      color: '#656565'
    }
  });

  module.exports = AccessPointList;
