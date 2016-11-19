import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToolbarAndroid,
  Navigator,
  ListView
} from 'react-native';

import {MKTextField, MKButton} from 'react-native-material-kit';
import _s from 'underscore.string';
import Icon from 'react-native-vector-icons/FontAwesome';

import ActionButton from 'react-native-action-button';

import MobileClient from '../../utils/MobileClient';
const service = new MobileClient();

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var _navigator;

export default class StoreDetails extends Component {

  constructor(props) {
    super(props);

    this.username = props.username;
    this.ownerId = props.ownerId;
    this.store = props.store;

    console.log(props.store);
    this.state = {
      locations: ds.cloneWithRows(this.store.locations),
      addingLocation: false
    };

    this._selectLocation = this._selectLocation.bind(this);
    this._addLocation = this._addLocation.bind(this);
  }

  _selectLocation(loc){
    this.setState({selected: loc});
    this._next();
  }

  _addLocation(){
    this.setState({addingLocation: true});
    this._next();
  }

  renderScene(route, navigator) {
    _navigator = navigator;

    return (
      <View style={styles.container}>
        <Text style={styles.locationName}>{this.store.name}</Text>
        <View style={styles.apInfo}>
          <Icon name="home" size={20} style={{marginBottom: 10}}/>
          <Text style={styles.data}>{this.store.address}</Text>
        </View>
        <View style={styles.apInfo}>
          <Icon name="user" size={20} style={{marginBottom: 10}}/>
          <Text style={styles.data}>{this.ownerId}</Text>
        </View>
        <MKButton
          shadowRadius={2}
          shadowOffset={{width:0, height:2}}
          shadowOpacity={.7}
          shadowColor="black"
          onPress={this._addLocation}
          >
          <Text pointerEvents="none" style={{fontWeight: 'bold'}}>
            Add Location
          </Text>
        </MKButton>
        <View style={styles.apInfo}>
          <Icon name="user" size={20} style={{marginBottom: 10}}/>
          <Text style={styles.data}>{this.ownerId}</Text>
        </View>
        <ListView
          dataSource={this.state.locations}

          renderRow={ (rowData) => {
            return (<TouchableOpacity style={{height: 30}}
              onPress={this._selectLocation}>
              <Text style={{fontWeight: 'bold'}}>{rowData.split(':')[1]}</Text>
            </TouchableOpacity>);
            }
          }
        />

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
                    style={{fontSize: 40, justifyContent: 'center', alignItems: 'center', marginTop: 10}}
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
                    <Text style={styles.barTitle}>Store</Text>
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
    if (this.state.addingLocation){
      this.gotoNext();
    }
  }

  gotoNext() {
    if (this.state.addingLocation){
      this.props.navigator.push({
        id: 'AddLocation',
        name: 'AddLocation',
        username: this.username
      });
    } else {
      //TODO Edit store

      // this.props.navigator.push({
      //   id: 'AddStore',
      //   name: 'AddStore',
      //   ownerId: this.ownerId
      // });
    }

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
  },
  locationName: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    margin: 10
  },
  data: {
    color: '#656565',
    marginBottom: 10
  },
  apInfo: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  }
});


module.exports = StoreDetails;
