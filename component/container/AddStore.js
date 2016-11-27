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

import NavLeft from '../common/NavigatorLeft';
import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

export default class AddStore extends Component {

  constructor(props) {
    super(props);
    this.userId = props.userId;
    this.username = props.username;

    if (this.username == null || this.userId == null){
      throw new Error("LA CONCHA DE TU REPUTA MADRE");
    }

    console.log("username: " + this.username);
    console.log("userId: " + this.userId);

    this.state = {
      iconStyle: styles.enabledNext
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
    this._toogleSubmit = this._toogleSubmit.bind(this);
    this._next = this._next.bind(this);
  }

  handleNameUpdate(name) {
    this.name = name;
    this._toogleSubmit();
  }

  _toogleSubmit() {
    const disable = _s.isBlank(this.name);
    if (this.state.disableSubmit !== disable) {
      this.setState({disableSubmit: disable})
    }
  }

  handleSubmit() {
    service.stores('POST', '', {
      body: JSON.stringify({
        name: this.name,
        ownerId: this.userId,
        stock: [],
        locations: [],
        adIds: [],
        campaignIds: [],
        address: ''
      })
    })
    .then(res => {
      console.log("RESPONSE");
      console.log(res.data);
      this.store = res.data;
      this._next();
    })
    .catch(err => {
      console.log("ERROR");
      console.log(err);
    });
  }

  renderScene(route, navigator) {
    return (
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'column',   alignItems: 'center',
            justifyContent: 'center',}}>
            <MKTextField placeholder='Store Name'
                         style={styles.textfield}
                         underlineEnabled={true}
                         onTextChange={this.handleNameUpdate}
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

  _next() {
    if (!this.state.disableSubmit) {
      const route = {
        id: 'AddLocation',
        name: 'AddLocation',
        username: this.username,
        store: this.store
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


module.exports = AddStore;
