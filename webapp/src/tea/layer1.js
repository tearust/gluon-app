import utils from './utils';
const LAYER1_URL = utils.get_env('layer1_url') || 'ws://127.0.0.1:9944';
const LAYER1_HTTP = utils.get_env('layer1_http') || 'http://127.0.0.1:9933';

import {
  _,
} from 'tearust_utils';
import {
  Layer1 as TeaLayer1,
} from 'tearust_layer1';

class Layer1 {
  constructor(){
    this.layer1_instance = null;
    this.callback = {};

    this.gluon = null;

    this.connected = 0;
  }

  async init(){
    if(this.connected > 0) return;

    this.connected = 1;
    const _layer1 = new TeaLayer1({
      ws_url: LAYER1_URL,
      http_url: LAYER1_HTTP,
    });

    await _layer1.init();
    this.layer1_instance = _layer1;

    // // Subscribe to system events via storage
    // this.api.query.system.events((events) => {
    //   this.handle_events(events)
    // });

    // this.gluon = new gluon(this.api, this, this.extension, 'browser', {
    //   layer1_http: LAYER1_HTTP
    // });

    this.connected = 2;
  }

  getLayer1Instance(){
    return this.layer1_instance;
  }

  isConnected(){
    return this.connected;
  }

 

  // handle_events(events){

  //   _.each(events, (record) => {
  //     // console.log(123, record);
  //     const { event, phase } = record;
  //     const types = event.typeDef;

  //     if (event.section == 'tea') {
  //       // console.log(`Received tea events:`);
  
  //       let eventData = {}
  //       // Loop through each of the parameters, displaying the type and data
  //       event.data.forEach((data, index) => {
  //         // console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
  //         eventData[types[index].type] = data
  //       });

  //       // console.log('eventData:', eventData);

  //       switch (event.method) {
  //         case 'CompleteTask':
  //           console.log('CompleteTask:', this.callback, eventData.Result.toString());
  //           if(this.callback['CompleteTask']){

  //             this.callback['CompleteTask'](eventData.Result.toString());
  //           }
  //           break

  //         case 'SettleAccounts':
  //           console.log('SettleAccounts:', this.callback, eventData.Bill);
  //           if(this.callback['SettleAccounts']){
  //             this.callback['SettleAccounts'](eventData.Bill);
  //           }
  //           break;
  //         default:
  //       }
  //     }
  //   });
  // }

  
}


export default Layer1;

