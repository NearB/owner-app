import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Navigator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class NavigatorLeft extends Component {

  constructor(props){
    super(props);
    this.clickCallback = props.onPress;
  }
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.clickCallback}>
          <Icon name="arrow-left"
            style={{
              fontSize: 25,
              justifyContent: 'center',
              alignItems: 'center',
              color:'#FFFFFF',
              marginTop: 15,
              marginLeft: 12
            }}
            allowFontScaling={true}/>
        </TouchableOpacity>
      </View>
    );
  }
}

module.exports = NavigatorLeft;
