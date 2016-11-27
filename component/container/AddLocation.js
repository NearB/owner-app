import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToolbarAndroid,
  Navigator
} from 'react-native';

import {MKTextField}from 'react-native-material-kit';
import _s from 'underscore.string';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome';
import NavLeft from '../common/NavigatorLeft';

export default class AddLocation extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.store = props.store;

    if (this.username == null || this.store == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log("username: " + this.username);
    console.log(this.store);

    this.locationName = '';

    this.state = {
      disableSubmit: true,
      iconStyle: styles.enabledNext
    };
    this._updateLocation = this._updateLocation.bind(this);
    this._toogleSubmit = this._toogleSubmit.bind(this);
    this._next = this._next.bind(this);
  }

  _updateLocation(location) {
    this.locationName = location;
    this._toogleSubmit()
  }

  _toogleSubmit() {
    const disable = _s.isBlank(this.locationName);
    if (this.state.disableSubmit !== disable) {
      this.setState({disableSubmit: disable})
    }
  }

  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'column',   alignItems: 'center',
          justifyContent: 'center',}}>
          <MKTextField placeholder='Where are you?'
                       style={styles.textfield}
                       underlineEnabled={true}
                       onTextChange={this._updateLocation}
                       returnKeyType="next"
          />
        </View>
        <View style={{flex: 0.5, flexDirection: 'column',   alignItems: 'flex-start',
              justifyContent: 'center',}}>
          {this.state.disableSubmit ? null
            : <Icon name="arrow-circle-right" style={this.state.iconStyle}
                allowFontScaling={true}
                onPress={this._next}/>}
        </View>
      </View>
    );
  }

  _next() {
    if (!this.state.disableSubmit) {
      const route = {
        id: 'RegistrationDetail',
        name: 'RegistrationDetail',
        location: this.locationName,
        store: this.store,
        username: this.username,
      };

      console.log(route);
      this.props.navigator.push(route);
    }
  }

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
              { return (
                  <NavLeft onPress={()=>{ this.props.navigator.pop();}}/>
                );
              },
              RightButton: (route, navigator, index, navState) =>
              { return null; },
              Title: (route, navigator, index, navState) =>
              { return (<Text style={styles.barTitle}>Location Registration</Text>); },
            }}
            style={{backgroundColor: '#FA8428'}}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  textfield: {
    width: 150,
    marginTop: 32,
    margin: 10
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  barTitle: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    marginLeft: 30,
    marginTop: 12,
    color: 'white'
  },
  enabledNext: {
    color: '#FA8428',
    fontSize: 70,
    marginTop: 10
  },
  disabledNext: {
    color: '#808080',
    fontSize: 50,
    marginTop: 10
  }
});

module.exports = AddLocation;
