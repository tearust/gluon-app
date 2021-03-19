import React from 'react';
import {Button, Input, Image, Icon, ListItem} from 'react-native-elements';
import {Base, _, UI, Btc, pubsub, crypto, Log} from 'helper';
import {ScrollPageView} from '../components/Page';
import {View} from 'react-native';
import Text from '../components/Text';
import Header from '../components/Header';
import {Progress, Card, Modal} from '@ant-design/react-native';



export default class extends Base {
  _defineState(){
    return {
      log: [],
    };
  }

  renderMain(p, s){

    return (
      <ScrollPageView header={this.renderHeader()} style={{paddingTop: 10}}>

        {_.map(this.state.log, (item)=>{
          const str = `[${item.level}][${item.tag}] : ${item.log}`;
          // const str = `[${item.tag}] : ${item.log}`;
          return (
            <Text style={{color:'#333',}}>{str}</Text>
          )
        })} 
      </ScrollPageView>
    );
  }

  renderHeader(){
    return (
      <Header 
        title="LOG"
      />
    )
  }


  async componentDidMount(){
    Log.bind((log)=>{
      this.setState({log});
    })
  }
  
}
