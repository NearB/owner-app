'use strict';

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-material-design';
import {MKSpinner} from 'react-native-material-kit';

import WifiClient from '../utils/WifiClient';

import MobileClient from '../utils/MobileClient';
const service = new MobileClient();


export default class WifiLearning extends Component {

  constructor(props) {
    super(props);

    this.wifi = new WifiClient('NearB', props.username);
    this.numberOfScans = 0;
    this.maxScans = 10;
    this.scanJob = null;
    this.locationName = props.location;

    this.state = {
      locationInfo: null,
      learning: true,
      onCancel: props.onCancel,
      onDone: props.onDone
    };

    this.startScan = this.startScan.bind(this);
    this.registerAp = this.registerAp.bind(this);
    this.cancel = this.cancel.bind(this);
    this.done = this.done.bind(this);
    this._stopScanJob = this._stopScanJob.bind(this);

  }

  cancel() {
    console.log("CANCEL");
    this._stopScanJob();
    this.state.onCancel();
  }

  done() {
    console.log("DONE");
    this._stopScanJob();
    this.state.onDone();
  }

  _stopScanJob() {
    this.numberOfScans = 0;
    this.setState({learning: false});
    clearInterval(this.scanJob);
  }

  startScan() {
    console.log("Starting scan");
    this.scanJob = setInterval(() => {
      if (!this.state.learning) {
        return;
      }

      if (this.numberOfScans == this.maxScans) {
        return this.done();
      }

      this.numberOfScans++;

      this.wifi.getLocationInfo(this.locationName)
        .then(info => {
          this.setState({locationInfo: info});
          this.registerAp();
        })
        .catch(err => {
          console.log(err);
        });
    }, 1000);
  }

  componentDidMount() {
    this.startScan();
  }

  registerAp() {
    console.log(this.state.locationInfo.toJSON());

    // //FIXME find a better way to handle this instead of hardcoded the IP of our docker server
    // fetch(`http://192.168.0.103:11019/learn`, {
    //     json: true,
    //     method: 'POST',
    //     body: JSON.stringify(this.state.locationInfo.toJSON())
    //   }
    // )
    service.locations('PUT','', {
      body: JSON.stringify(this.state.locationInfo.toJSON())
    })
    .then((res) => {
      console.log(res.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <MKSpinner style={styles.spinner}/>
          <Button value="NORMAL RAISED" raised={true} onPress={this.state.onCancel} text='Cancel' theme='light'/>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  spinner: {
    width: 40,
    height: 40,
    margin: 20
  }
});


module.exports = WifiLearning;
