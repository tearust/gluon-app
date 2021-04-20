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

const initState = ()=>{
  return {
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

    // rescuer lost account
    // {
    //   config: null, 
    //   info: null,
    //   lost_address: null,
    // }, 
    recovery_rescuer: [],
  }
};

const store = new Vuex.Store({
  state: initState(),

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

    reset_state(state){
      const init_state = initState();
      Object.keys(init_state).forEach(key => {
        state[key] = init_state[key]
      })
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
      console.log('recovery_current', info);
      state.recovery_current = info;
    },
    set_recovery_rescuer(state, data){
      const {lost_address, info, config, proxy} = data;
      console.log('recovery_rescuer', lost_address, info, config, proxy);

      if(!lost_address){
        return;
      }

      let state_data = {
        lost_address, info, config
      };

      if(config){
        if(info){
          const process = [];
          _.each(config.friends, (friend)=>{
            process.push([
              friend, 
              _.includes(info.friends, friend),
            ])
          });
          const canClaim = _.size(info.friends) >= config.threshold;

          state_data.process = process;
          state_data.canClaim = canClaim;
          state_data.threshold = config.threshold;

          state_data.status = proxy===lost_address ? 'success' : 'started';
        }
        else{
          if(proxy){
            state_data.process = null;
            state_data.canClaim = false;
            state_data.threshold = 0;
            state_data.status = 'completed';
          }
          else{

            return;
          }
        }
      }
      else{
        if(proxy && proxy === lost_address){
          state_data.process = null;
          state_data.canClaim = false;
          state_data.threshold = 0;
          state_data.status = 'proxy';
        }
      }
      
      const index = _.findIndex(state.recovery_rescuer, (item)=>item.lost_address===lost_address);

      if(state_data.status){
        if(index !== -1){
          state.recovery_rescuer[index] = state_data;
        }
        else{
          state.recovery_rescuer.push(state_data);
        }
      }
      
    },
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
      const layer1_instance = layer1.getLayer1Instance();
      const gluon_pallet = layer1_instance.getGluonPallet();

      const asset = await gluon_pallet.getAccountAssets(layer1_account.address);

      store.commit('set_layer1_asset', asset);
    },
    async set_recovery_current(store){
      const layer1_account = store.getters.layer1_account;
      if(!layer1_account){
        throw 'Invalid layer1 account';
      }

      const layer1 = await F.getLayer1();
      const layer1_instance = layer1.getLayer1Instance();
      const recovery_pallet = layer1_instance.getRecoveryPallet();

      const recoverable = await recovery_pallet.getRecoveryInfo(layer1_account.address);

      store.commit('set_recovery_current', recoverable);
    },
    async set_recovery_rescuer(store, lost_address){
      const layer1_account = store.getters.layer1_account;
      if(!layer1_account){
        throw 'Invalid layer1 account';
      }

      if(!lost_address) return;

      const layer1 = await F.getLayer1();
      const layer1_instance = layer1.getLayer1Instance();
      const recovery_pallet = layer1_instance.getRecoveryPallet();

      const config = await recovery_pallet.getRecoveryInfo(lost_address);
      const info = await recovery_pallet.getActiveRecoveriesInfo(lost_address, layer1_account.address);
      const proxy = await recovery_pallet.getProxy(layer1_account.address);

      store.commit('set_recovery_rescuer', {
        lost_address, 
        info, 
        config,
        proxy,
      });
      
    }
  }
})

export default store;