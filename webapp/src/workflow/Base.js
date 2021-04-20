import Layer1 from '../tea/layer1';
import utils from '../tea/utils';
import Log from '../shared/utility/Log';
import http from '../tea/http';
import store from '../store';

import {_, forge} from 'tearust_utils';


let _layer1 = null;
export default class {
  constructor() {
    this.layer1 = _layer1;
    this._log = Log.create(this.defineLog());

    this.gluon = null;
  }

  defineLog(){
    return 'Base';
  }

  async init() {
    await this.initLayer1();
    this.gluon = this.layer1.gluon;
  }

  async initLayer1() {
    if (!_layer1) {
      try {
        _layer1 = new Layer1();
        await _layer1.init();

        this.layer1 = _layer1;
      } catch (e) {
        console.error(e);
      }
    }
  }

  getLayer1Instance(){
    if(this.layer1){
      return this.layer1.getLayer1Instance();
    }

    return null;
  }

  showQrCodeModal(opts){
    utils.publish('tea-qrcode-modal', {
      visible: true,
      text: opts.text,
    });
  }
  closeQrCodeModal(){
    utils.publish('tea-qrcode-modal', {
      visible: false,
    });
  }

  encode_b64(str){
    return forge.util.encode64(str);
  }

  showSelectLayer1Modal(){
    utils.publish('tea-select-layer1-modal', true);
  }

  async refreshCurrentAccount(){
    
    const layer1_account = store.getters.layer1_account;
    if(!layer1_account.address){
      return false;
    }

    this._log.i("refresh current layer1_account");
    const layer1_instance = this.getLayer1Instance();
    const balance = await layer1_instance.getAccountBalance(layer1_account.address);
    const gluonPallet = layer1_instance.getGluonPallet();
    const info = await gluonPallet.getAccountProfile(layer1_account.address);

    // reset all state
    store.commit('reset_state');

    store.commit('set_account', {
      balance,
      address: layer1_account.address,
      ori_name: layer1_account.name,
    });

    if(info.pair_address){
      store.commit('set_bind_mobile', {
        address: info.pair_address,
        uuid: info.pair_meta.uuid || ''
      });
    }
    else{
      store.commit('set_bind_mobile', null);
    }
  }

  

  
}