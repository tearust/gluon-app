import Vuex from 'vuex';
import Vue from 'vue';
import _ from 'lodash';

import Base from '../workflow/Base';

Vue.use(Vuex)

const F = {
  async getLayer1(){
    const wf = new Base();
    await wf.init();
    return wf.layer1;
  }
};

const store = new Vuex.Store({
  state: {
    layer1_account: {
      name: null,
      address: null,
      balance: null,
    },

    // address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    // uuid: '29308409284023805283502845038453095803485308503',
    bind_mobile: null,

    btc_list: [],

    latest_meta: {
      delegator_nonce: null,
      delegator_nonce_hash: null,
      delegator_nonce_rsa: null,

    },


    layer1_asset: {
      dot: []
    },

    layer1_recovery: {
      status: 0,
      recoverable: null,
      activeRecoveries: null,
    },
    recovery_current: null,
    // recovery_vouch: null, // vouch for friend
    recovery_rescuer: null, // rescuer lost account
  },

  getters: {
    layer1_account: (state)=>{
      if(state.layer1_account.address){
        return state.layer1_account;
      }
      const ll = localStorage.getItem('tea-layer1-account');
      if(ll){
        
        return JSON.parse(ll);
      }

      return state.layer1_account;
    }
  },

  mutations: {
    set_account(state, account){
      state.layer1_account = {
        name: account.ori_name,
        address: account.address,
        balance: account.balance,
      };
      localStorage.setItem('tea-layer1-account', JSON.stringify(state.layer1_account));
    },

    set_bind_mobile(state, opts){
      if(!opts){
        state.bind_mobile = null;
      }
      else{
        state.bind_mobile = {
          address: opts.address,
          uuid: opts.uuid,
        };
      }
    },

    // add_btc_account_mock(state, opts){
    //   const list = state.btc_list;
    //   list.push({
    //     address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    //     balance: 0.01,
    //     pub: 'public_key',
    //     status: 'normal',
    //     profile: {},
    //   });
    //   state.btc_list = list;
    // },

    set_all_asset(state, asset){
      const list = _.map(asset, (item)=>{
        item.balance = 0;
        item.status = 'normal';
        return item;
      });

      state.btc_list = list;
    },

    set_meta(state, opts){
      state.latest_meta = _.extend(state.latest_meta, opts);
    },
    set_layer1_asset(state, asset){
      if(asset && asset.dot){
        state.layer1_asset.dot = asset.dot;
      }
    },
    set_recovery_current(state, info){
      console.log(11, info);
      state.recovery_current = info;
    }
  },

  actions: {
    // async set_asset(store){
    //   const layer1_account = store.getters.layer1_account;
    //   if(!layer1_account){
    //     throw 'Invalid layer1 account';
    //   }

    //   const address = layer1_account.address;

    //   const layer1 = await F.getLayer1();
    //   const asset = await layer1.gluon.getAssetsByAddress(address);
      
    //   store.commit('set_all_asset', asset);

    // },
    async set_layer1_asset(store){
      const layer1_account = store.getters.layer1_account;
      if(!layer1_account){
        throw 'Invalid layer1 account';
      }

      const layer1 = await F.getLayer1();
      const gluon = layer1.gluon;

      const asset = await gluon.getAccountAssets(layer1_account.address);

      store.commit('set_layer1_asset', asset);
    },
    async set_recovery_current(state){
      const layer1_account = store.getters.layer1_account;
      if(!layer1_account){
        throw 'Invalid layer1 account';
      }

      const layer1 = await F.getLayer1();
      const gluon = layer1.gluon;

      const recoverable = await gluon.recovery_getRecoveryInfo(layer1_account.address);

      store.commit('set_recovery_current', recoverable);
    }
  }
})

export default store;