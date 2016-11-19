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

    this.username = props.username;
    console.log(this.username);
    this.locationName = '';
    this.state = {
      disableRegister: true,
      iconStyle: styles.disabledNext
    };
    this.updateLocation = this.updateLocation.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
  }

  updateLocation(location) {
    let disable = true;
    let style = styles.disabledNext;
    if (!_s.isBlank(location)) {
      this.locationName = location;
      disable = false;
      style = styles.enabledNext;
    }
    this.setState({disableRegister: disable, iconStyle: style});
  }

  renderScene(route, navigator) {
    _navigator = navigator;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <MKTextField placeholder='Where are you?'
                       style={styles.textfield}
                       underlineEnabled={true}
                       onTextChange={this.updateLocation}
                       returnKeyType="next"
          />
          <Icon name="arrow-circle-right" style={this.state.iconStyle} allowFontScaling={true}
                onPress={this._next.bind(this)}/>
        </View>
      </KeyboardAwareScrollView>
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
                  <Icon name="arrow-circle-left"
                    allowFontScaling={true}
                    onPress={()=>{
                      if (_navigator.getCurrentRoutes().length >= 1  ) {
                        _navigator.pop();
                      }
                    }}
                  />
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
    if (!this.state.disableRegister) {
      this.gotoNext();
    }
  }

  gotoNext() {
    this.props.navigator.push({
      id: 'RegistrationDetail',
      name: 'RegistrationDetail',
      location: this.locationName,
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
    margin: 10,
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
