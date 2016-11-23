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

var _navigator;

export default class AddLocation extends Component {

  constructor(props) {
    super(props);

    this.storeName = props.storeName;
    this.username = props.username;
    this.locationName = '';
    this.state = {
      disableSubmit: true,
      iconStyle: styles.enabledNext
    };
    this._updateLocation = this._updateLocation.bind(this);
    this._toogleSubmit = this._toogleSubmit.bind(this);
    this._next = this._next.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
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
    _navigator = navigator;

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

  render() {
    return (
      <Navigator
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
              { return (
                <View>
                  <TouchableOpacity
                    onPress={()=>{ this.props.navigator.pop();}}>
                    <Icon name="arrow-left"
                      style={{
                        fontSize: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        color:'#FFFFFF',
                        marginTop: 12,
                        marginLeft: 12
                      }}
                      allowFontScaling={true}/>
                  </TouchableOpacity>
                </View>
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

  _next() {
    if (!this.state.disableSubmit) {
      this.gotoNext();
    }
  }

  gotoNext() {
    this.props.navigator.push({
      id: 'RegistrationDetail',
      name: 'RegistrationDetail',
      location: this.locationName,
      storeName: this.storeName,
      username: this.username
    });
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
    fontSize: 50,
    marginTop: 10
  },
  disabledNext: {
    color: '#808080',
    fontSize: 50,
    marginTop: 10
  }
});

module.exports = AddLocation;
