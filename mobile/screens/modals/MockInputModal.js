import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc, cache, pubsub, createContainer} from 'helper';
import {ScrollPageView} from '../../components/Page';
import {View, TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {Progress, Card, TextareaItem} from '@ant-design/react-native';
import Layer1 from '../../layer1';

import Styles from '../../constants/Styles';
import Layout from '../../constants/Layout';

import userAction from '../../store/action/user';


export default createContainer(class extends Base {

  _defineState(){
    return {
      val: '',
    };
  }

  _init(){
    
    this.type = this.props.route.params || 'qrcode';
    console.log(11, this.type);
  }

  renderMain(p, s){

    const styles = {
      textBold: {
        fontWeight: '500',
        color: '#fff'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        padding: 16
      },
      cameraStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      containerStyle: {
        
      }
    };

    return (
      <ScrollPageView header={this.renderHeader()} contentStyle={{paddingLeft:0, paddingRight:0,}}>
        
        <TextareaItem 
          style={{
            marginTop: 10,
            paddingVertical: 10,
          }} 
          rows={16} 
          value={this.state.val}
          onChange={(val)=>{this.setState({val})}}
          count={4096} 
          placeholder={`Paste ${this.type} here.`} 
        />

        <Button 
          onPress={this.confirmHandler.bind(this)}
          title="CONFIRM" 
          type="solid"
          containerStyle={{
            marginTop: 50,
            marginLeft: 40,
            marginRight: 40,
            marginBottom: 50,
          }} 
        />
      </ScrollPageView>
       
    );
  }

  confirmHandler(){
    const {val} = this.state;
    if(this.type === 'qrcode'){
      try{
        const json = JSON.parse(val);
        this.props.set_qrcode(json);
        this.onClose();
      }catch(e){
        alert('invalid qrcode');
      }
    }
    
  }

  renderHeader(){
    return (
      <Header 
        title="MOCK INPUT"
        leftComponent={null}
        
        rightComponent={
          <TouchableOpacity onPress={this.onClose.bind(this)}>
            <Icon type="ionicon" name="close-circle-outline" color="#fff" size={28} />
          </TouchableOpacity>   
        }
      />
    )
  }

  onClose(){

    this._goBack();
  }
  
}, (state)=>{
  return {};
}, (dispatch)=>{
  return {
    set_qrcode(json){
      dispatch(userAction.setQrcode(json));
    }
  };
})
