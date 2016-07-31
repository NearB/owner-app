"use strict";

export class FingerPrint {

  constructor(mac, rssi) {
    this.mac = mac;
    this.rssi = rssi;
  }

  toJSON() {
    return {
      mac: this.mac,
      rssi: this.rssi
    };
  }
}

export class TrackingInformation {

  constructor(group, user, place, time, fingerprints) {
    this.group = group;
    this.username = user;
    this.location = place;
    this.time = time;
    this.wifiFingerprint = fingerprints;
  }

  toJSON() {
    return {
      'group': this.group,
      'username': this.username,
      'location': this.location,
      'time': this.time,
      'wifi-fingerprint': this.wifiFingerprint
    };
  }
}

