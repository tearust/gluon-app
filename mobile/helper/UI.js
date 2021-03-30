import pubsub from './pubsub';
import React from 'react';
import {Toast} from '@ant-design/react-native';
import {View, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import Text from '../components/Text';
import {Icon} from 'react-native-elements';

const F = {
  loading(f = false) {
    pubsub.publish('app-loading', f);
  },
  toast: Toast,

  error(str) {
    Toast.fail(str, 3);
  },

  info(str) {
    Toast.info(str, 3);
  },
  success(str = 'success') {
    Toast.success(str, 1);
  },

  log(x) {
    alert(JSON.stringify(x));
  },

  soon() {
    alert('coming soon...');
  },

  confirm(title, text, cb) {
    Alert.alert(
      title,
      text,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => cb()},
      ],
      {cancelable: false},
    );
  },

  prompt(title, text, cb, type='plain-text', defaultValue=''){
    Alert.prompt(
      title,
      text,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: (a) => cb(a)},
      ],
      type,
      defaultValue,
      null,
    )
  },

  getHeaderBackElement(goBackFn) {
    return (
      <TouchableOpacity onPress={goBackFn}>
        <View
          style={{
            flexDirection: 'row',
            width: 50,
            left: 0,
            justifyContent: 'space-between',
            top: 2,
          }}>
          <Icon name="chevron-left" color="#fff" />
          <Text style={{color: '#fff', top: 3}}>Back</Text>
        </View>
      </TouchableOpacity>
    );
  },

  goBack() {
    pubsub.publish('app-go-back');
  },
  goPath(name) {
    pubsub.publish('app-go-push', name);
  },
  goTab(name) {
    F.goPath('tab');
    pubsub.publish('app-set-tab', name);
  },

  async showPrivatePasswordModal(mode = 'set') {
    return new Promise((resolve, reject) => {
      pubsub.publish('app-private-password', true, mode, (text) => {
        if (text) {
          resolve(text);
        } else {
          reject();
        }
      });
    });
  },
};

export default F;
