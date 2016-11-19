import React, {Component} from 'react';
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

export default class UserHome extends Component {

  constructor(props) {
    super(props);

    this.selected = null;
    this.username = props.username;
    this.ownerId= props.userId;
    this.state = {
      stores: ds.cloneWithRows([]),
      addingStore: false
    };

    this._fetchStores = this._fetchStores.bind(this);
    this._selectStore = this._selectStore.bind(this);
    this._addStore = this._addStore.bind(this);
    this._next = this._next.bind(this);
  }

  componentDidMount() {
    this._fetchStores();
  }

  _fetchStores() {
    service.stores('GET')
    .then((res) => {
      const data = res.data;
      console.log(data);
      this.setState({stores: ds.cloneWithRows(data)})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  _selectStore(store){
    console.log(store);
    this.selected = store;
    this.setState({addingStore: false});
    this._next();
  }

  _addStore(){
    this.setState({addingStore: true});
    this._next();
  }

  renderScene(route, navigator) {

    _navigator = navigator;

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.stores}

          renderRow={ (rowData) => {
            return (<TouchableOpacity style={{height: 60}}
              onPress={() => { this._selectStore(rowData);}}>
              <Text style={{fontWeight: 'bold'}}>{rowData.name}</Text>
              <Text>{rowData._id}</Text>
            </TouchableOpacity>);
            }
          }
        />

        <ActionButton
          position="right"
          buttonColor="#FA8428"
          onPress={this._addStore}
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
                  <Icon name="sign-out"
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
                    <Text style={styles.barTitle}>Stores</Text>
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
    if (this.state.addingStore){
      this.props.navigator.push({
        id: 'AddStore',
        name: 'AddStore',
        ownerId: this.state.ownerId
      });
    } else {
      this.props.navigator.push({
        id: 'StoreDetails',
        name: 'StoreDetails',
        store: this.selected,
        ownerId: this.ownerId,
        username: this.username
      });
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
    marginTop: 15,
    marginLeft: 100,
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


module.exports = UserHome;
