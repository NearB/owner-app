import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToolbarAndroid,
  Navigator
} from 'react-native';

import {MKTextField} from 'react-native-material-kit';
import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

var _navigator;

export default class AddStore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ownerId: props.ownerId,
      iconStyle: styles.enabledNext
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
    this.handleAddressUpdate = this.handleAddressUpdate.bind(this);
    this._toogleSubmit = this._toogleSubmit.bind(this);
  }

  handleNameUpdate(name) {
    this.name = name;
    this._toogleSubmit();
  }

  handleAddressUpdate(address) {
    this.address = address;
    this._toogleSubmit();
  }

  _toogleSubmit() {
    const disable = _s.isBlank(this.user);
    if (this.state.disableSubmit !== disable) {
      this.setState({disableSubmit: disable})
    }
  }

  handleSubmit() {
    service.stores('POST', '', {
      name: this.name,
      ownerId: this.state.ownerId,
      stock: [],
      locations: ['laBirreria:main'],
      adIds: [],
      campaignIds: [],
      address: this.address
    })
    .then(res => {
      console.log(res.data);
      _navigator.pop();
    })
    .catch(err => {
      console.log(err);
    });
  }

  renderScene(route, navigator) {
    _navigator = navigator;

    return (
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'column',   alignItems: 'center',
            justifyContent: 'center',}}>
            <MKTextField placeholder='Username'
                         style={styles.textfield}
                         underlineEnabled={true}
                         onTextChange={this.handleUserUpdate}
                         returnKeyType="next"
            />
            <MKTextField placeholder='Password'
                         style={styles.textfield}
                         underlineEnabled={true}
                         password={true}
                         onTextChange={this.handlePasswordUpdate}
                         returnKeyType="next"
            />
          </View>
          <View style={{flex: 0.5, flexDirection: 'column',   alignItems: 'flex-start',
                justifyContent: 'center',}}>
            {this.state.disableSubmit ? null
              : <Icon name="arrow-circle-right" style={this.state.iconStyle}
                  allowFontScaling={true}
                  onPress={this.handleSubmit}/>}
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
              { return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.barTitle}>New Store</Text>
                  </View>
                );
              },
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
      id: 'UserHome',
      name: 'UserHome',
      username: this.user,
      userId: this.userId
    });
  }
}

const styles = StyleSheet.create({
  textfield: {
    width: 150,
    marginTop: 32,
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
    flex: 1,
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


module.exports = AddStore;
