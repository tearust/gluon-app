import React, { useCallback } from 'react';
import {
  Button,
  Image,
  Icon,
  Avatar,
  Card,
  Divider,
} from 'react-native-elements';
import {
  Progress,
  Modal,
  Flex,
  Button as NDButton,
  List,
  InputItem,
} from '@ant-design/react-native';
import {Base, _, UI, createContainer, Log} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View, ScrollView, TouchableOpacity, NativeModules} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';

import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import Layer1 from '../../layer1';

import userAction from '../../store/action/user';

export default createContainer(
  class extends Base {
    _defineState() {
      this.loop = false;
      return {
        log: [],
        connected: 0,

        modal_visible: false,
        modal_title: '',
        modal_text: '',
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

          {this.state.connected > 1 && 
            <Button
              type="solid"
              onPress={this.recharge.bind(this)}
              containerStyle={{marginTop: 40}}
              title="TOP UP"
            />
          }
          
          {/* <Button type="outline" onPress={this.createNewAccount.bind(this)} containerStyle={{marginTop: 10}} title="Create New Account" /> */}

          {/* {this.renderLog()} */}
          {this.renderSetLayer1UrlModal()}
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
      const color = [
        'red',
        'yellow',
        '#fff',
      ][this.state.connected];
      return (
        <Header 
          centerComponent={{
            text: 'LAYER1 ACCOUNT',
            style: {
              color: color,
              fontSize: 20,
              fontWeight: 'bold'
            }
          }}
          rightComponent={
            <TouchableOpacity onPress={this.setUrl.bind(this)}>
              <Icon
                type="ionicon"
                name="options-outline"
                color="#fff"
                size={28}
              />
            </TouchableOpacity>
          }
        />
      );
    }

    async setUrl(){
      const layer1 = await Layer1.get();
      const url = await layer1.getLayer1Url(); 

      this.openSetLayer1UrlModal(url);

      // UI.prompt('Set Layer1 URL', 'Click Ok will restart app.', async (new_url)=>{
      //   if(!new_url || !_.startsWith(new_url, 'ws')){
      //     UI.error('Invalid layer1 url');
      //     return false;
      //   }

      //   UI.loading(true);
      //   try{
      //     await layer1.setLayer1Url(new_url);
      //     await Layer1.get();
      //   }catch(e){}

      //   UI.loading(false);
        
      // }, 'plain-text', url);
   
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
      let time = 500;
      const loop = async ()=>{
        try{
          const l = await Layer1.get();
          const connected = l.isConnected();
          if(this.state.connected !== connected){
            this.setState({
              connected
            });

            if(connected === 2){
              // TODO 
              this.props.refreshAccount();
            }
          }

          if(connected === 2){
            time = 5000;
          }
        }catch(e){

        }
        
        _.delay(()=>{
          this.loop && loop();
        }, time);
      };

      this.loop = true;
      await loop();
    }

    componentWillUnmount(){
      this.loop = false;
    }

    closeSetLayer1UrlModal(){
      this.setState({
        modal_visible: false,
        modal_text: ''
      });
    }
    openSetLayer1UrlModal(title){
      this.setState({
        modal_title: title,
        modal_text: title,
        modal_visible: true,
      })
    }

    renderSetLayer1UrlModal(){
      const callback = async ()=>{
        const new_url = _.clone(this.state.modal_text);
        if(!new_url || !_.startsWith(new_url, 'ws')){
          UI.error('Invalid layer1 url');
          return false;
        }

        UI.loading(true);
        try{
          this.closeSetLayer1UrlModal();
          const layer1 = await Layer1.get();
          await layer1.setLayer1Url(new_url);
          await Layer1.get();

          this.setState({connected: 0});
          await this.componentDidMount();

        }catch(e){}

        UI.loading(false);
      };
      
      return (
        <Modal
          popup={false}
          transparent
          visible={this.state.modal_visible}
          animationType="slide-up"
          style={{width:Layout.window.width-30, zIndex:1,}}
          onClose={this.closeSetLayer1UrlModal.bind(this, false)}>
          <View
            style={{
              paddingVertical: 0,
              paddingHorizontal: 0,
              // height: 400,
            }}>
            <Text style={{textAlign: 'center', fontSize: 18}}>{'Set Layer1 URL'}</Text>
            <View style={{marginTop: 12, borderWidth: 0}}>
              <Text style={{textAlign: 'center', fontSize: 15}}>{this.state.modal_title}</Text>
              <InputItem
                type="text"
                value={this.state.modal_text}
                onChange={(val)=>{this.setState({modal_text:val})}}
                placeholder="Layer1 URL"
              />

              
            </View>
          </View>

          <Flex direction="row" style={{marginTop: 30}}>
            <Flex.Item style={{paddingRight: 10}}>
              <NDButton
                size="small"
                {...Styles.cancel_button}
                onPress={this.closeSetLayer1UrlModal.bind(this)}>
                CANCEL
              </NDButton>
            </Flex.Item>

            <Flex.Item style={{paddingLeft: 10}}>
              <NDButton
                size="small"
                styles={{
                  text: {
                    color: 'red',
                  },
                }}
                {...Styles.confirm_button}
                onPress={callback.bind(this)}>
                CONFIRM
              </NDButton>
            </Flex.Item>
          </Flex>
        </Modal>
      );
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
      refreshAccount() {
        dispatch(userAction.refresh());
      },
    };
  },
);
