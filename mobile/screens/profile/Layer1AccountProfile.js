import React from 'react';
import {
  Button,
  Image,
  Icon,
  Avatar,
  Card,
  Divider,
} from 'react-native-elements';
import {Base, _, UI, createContainer, Log} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View, ScrollView} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress} from '@ant-design/react-native';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';

import userAction from '../../store/action/user';

export default createContainer(
  class extends Base {
    _defineState() {
      return {
        log: [],
      };
    }
    _defineStyle() {
      return {};
    }
    renderMain(p, s) {
      const sy = {
        text: {
          fontSize: 15,
          marginTop: 10,
          marginBottom: 10,
        },
      };

      const {layer1_account} = this.props;
      return (
        <ScrollPageView header={this.renderHeader()} style={{paddingTop: 10}}>
          {layer1_account && (
            <Card containerStyle={{margin: 0}}>
              <Card.Title>ACCOUNT DETAILS</Card.Title>
              <Card.Divider />
              <Text style={sy.text}>ADDRESS: {layer1_account.address}</Text>
              <Divider />
              <Text style={sy.text}>BALANCE: {layer1_account.balance}</Text>
              <Divider />
              <Text style={sy.text}>{layer1_account.mnemonic}</Text>
            </Card>
          )}

          <Button
            type="solid"
            onPress={this.recharge.bind(this)}
            containerStyle={{marginTop: 40}}
            title="TOP UP"
          />
          {/* <Button type="outline" onPress={this.createNewAccount.bind(this)} containerStyle={{marginTop: 10}} title="Create New Account" /> */}

          {/* {this.renderLog()} */}
        </ScrollPageView>
      );
    }

    renderLog() {
      return (
        <ScrollView
          style={{
            height: 300,
            backgroundColor: '#000',
            width: Layout.window.width,
            top: Layout.window.height - 440,
            position: 'absolute',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          {_.map(this.state.log, (item) => {
            // const str = `[${item.level}][${item.tag}] : ${item.log}`;
            const str = `[${item.tag}] : ${item.log}`;
            return <Text style={{color: '#0f0'}}>{str}</Text>;
          })}
        </ScrollView>
      );
    }

    renderHeader() {
      return <Header title="LAYER1 ACCOUNT" />;
    }

    async recharge() {
      Log.d('UI', 'click "top up" button');
      UI.loading(true);
      const {layer1_account} = this.props;
      const layer1 = await Layer1.get();

      await layer1.faucet(layer1_account.address);
      const ac = await layer1.getCurrentAccount();

      this.props.setLayer1Account(ac);

      UI.loading(false);
    }

    async createNewAccount() {
      Log.d('UI', 'click "create new account" button');
      UI.loading(true);

      const layer1 = await Layer1.get();
      const ac = await layer1.createNewAccount();
      this.props.setLayer1Account(ac);

      UI.loading(false);
    }

    async componentDidMount() {
      //     UI.loading(true);
      //     const layer1 = await Layer1.get();
      //     const ac = await layer1.getCurrentAccount();
      // console.log(11, ac);
      //     this.props.setLayer1Account(ac);
      //     UI.loading(false);
      // Log.bind((log)=>{
      //   this.setState({log});
      // })
    }
  },
  (state) => {
    const {user} = state;
    return {
      layer1_account: user.layer1_account,
    };
  },
  (dispatch, props) => {
    return {
      setLayer1Account(account) {
        dispatch(userAction.setLayer1Account(account));
      },
    };
  },
);
