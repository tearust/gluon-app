import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';
import {_, UI, Log, cache} from 'helper';
import types from './types';
const rpc = require('./rpc');

import BN from 'bn.js';
import forge from 'node-forge';

import gluon from './gluon';

const LAYER1_URL = 'ws://139.198.187.91:9944';

const tag = 'LAYER1';

let _layer1 = null;
export default class Layer1 {
  static get = async () => {
    if (_layer1) {
      return _layer1;
    }

    _layer1 = new Layer1();
    await _layer1.init();
    return _layer1;
  };

  constructor() {
    this.api = null;
    this.callback = {};

    this.gluon = null;

    this.connected = 0; // 0: disconnected, 1: connecting, 2: connected.
  }
  getDefaultAccount() {
    const keyring = new Keyring({type: 'sr25519'});
    const ac = keyring.addFromUri('//Alice', {name: 'Alice default'});
    return ac;
  }
  async getLayer1Url(){
    let url = await cache.get('layer1_url');
    if(!url){
      url = LAYER1_URL;
    }
    return url;
  }
  async setLayer1Url(url){
    await cache.set('layer1_url', url);
    this.destroy();
  }
  destroy(){
    this.api = null;
    this.callback = {};
    this.gluon = null;
    this.connected = 0;
    _layer1 = null;
  }
  async init() {
    if(this.connected !== 0){
      return;
    }

    const url = await this.getLayer1Url();
    const provider = new WsProvider(url);

    this.connected = 1;
    const api = await ApiPromise.create({
      provider,
      types,
      rpc,
    });
    this.api = api;

    await cryptoWaitReady();

    // Subscribe to system events via storage
    this.api.query.system.events((events) => {
      this.handle_events(events);
    });

    this.gluon = new gluon(this.api, null, 'app');

    Log.i(tag, 'connected');

    this.connected = 2;
  }

  isConnected(){
    return this.connected;
  }

  async mnemonicGenerate() {
    let mn = await cache.get('tea-mnemonic');
    if (!mn) {
      mn = mnemonicGenerate();
      Log.d(tag, 'mnemonicGenerate =>', mn);
      await cache.set('tea-mnemonic', mn);
    }
    return mn;
  }
  generateWithMnemonic(mnemonic) {
    const keyring = new Keyring({type: 'sr25519'});
    const ac = keyring.addFromUri(mnemonic);
    return ac;
  }

  async createNewAccount() {
    await cache.remove('tea-mnemonic');
    Log.d(tag, 'create new account');

    return await this.getCurrentAccount();
  }

  async getCurrentAccount() {
    const mn = await this.mnemonicGenerate();
    Log.d(tag, 'current mnemonic =>', mn);
    const account = this.generateWithMnemonic(mn);
    Log.d(tag, 'current address =>', account.address);
    account.mnemonic = mn;
    account.balance = await this.getAccountBalance(account.address);
    Log.d(tag, 'current balance =>', account.balance);
    account.profile = await this.gluon.getAccountProfile(account.address);
    return account;
  }

  buildCallback(key, cb) {
    this.callback[key] = cb;
  }

  asUnit() {
    const yi = new BN('100000000', 10);
    const million = new BN('10000000', 10);
    const unit = yi.mul(million);

    return unit;
  }

  async getAccountBalance(account) {
    try {
      Log.d('TT', 11);
      let {
        data: {free: previousFree},
        nonce: previousNonce,
      } = await this.api.query.system.account(account);
      Log.d('TT', 22);
      const free = parseInt(previousFree.toString(), 10) / this.asUnit();
      Log.d('TT', 33, ' -- ', free);
      return Math.floor(free * 10000) / 10000;
    } catch (e) {
      Log.d('ERROR', e.toString());
      return 0;
    }
  }

  handle_events(events) {
    _.each(events, (record) => {
      // console.log(123, record);
      const {event, phase} = record;
      const types = event.typeDef;

      if (event.section === 'tea') {
        // console.log(`Received tea events:`);

        let eventData = {};
        // Loop through each of the parameters, displaying the type and data
        event.data.forEach((data, index) => {
          // console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
          eventData[types[index].type] = data;
        });

        // console.log('eventData:', eventData);

        switch (event.method) {
          case 'CompleteTask':
            console.log(
              'CompleteTask:',
              this.callback,
              eventData.Result.toString(),
            );
            if (this.callback.CompleteTask) {
              this.callback.CompleteTask(eventData.Result.toString());
            }
            break;

          case 'SettleAccounts':
            console.log('SettleAccounts:', this.callback, eventData.Bill);
            if (this.callback.SettleAccounts) {
              this.callback.SettleAccounts(eventData.Bill);
            }
            break;
          default:
        }
      }
    });
  }

  async sign(account, text) {
    await this.extension.setSignerForAddress(account, this.api);
    const sig = await this.api.sign(account, {
      data: '0x' + text,
    });
    return sig;
  }

  async addNewTask(
    account,
    {refNum, teaId, modelCid, bodyCid, payment},
    callback,
  ) {
    // const keyring = new Keyring({ type: 'sr25519' });
    // const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });

    await this.extension.setSignerForAddress(account, this.api);
    console.log('send account => ', account);
    await this.api.tx.tea
      .addNewTask(refNum, teaId, modelCid, bodyCid, payment)
      .signAndSend(account, ({events = [], status}) => {
        if (status.isInBlock) {
          console.log('Included at block hash', status.asInBlock.toHex());
          console.log('Events:');
          events.forEach(({event: {data, method, section}, phase}) => {
            console.log(
              '\t',
              phase.toString(),
              `: ${section}.${method}`,
              data.toString(),
            );
          });

          callback(true, status.asInBlock.toHex());
        } else if (status.isFinalized) {
          console.log('Finalized block hash', status.asFinalized.toHex());
        }
      });

    console.log('send add_new_task tx');
  }

  async nodeByEphemeralId(eid_0x, cb) {
    const api = this.api;
    const teaId = await api.query.tea.ephemeralIds(eid_0x);
    if (teaId.isNone) {
      throw 'invalid ephemeral id for method layer1=>nodeByEphemeralId';
    }

    const nodeObj = await api.query.tea.nodes(teaId.unwrap());
    const node = nodeObj.toJSON();

    node.http = node.urls[0] ? forge.util.hexToBytes(node.urls[0]) : '';

    return node;
  }

  async getBootstrapNodes() {
    const nodes = await this.api.query.tea.nodes.entries();
    const teaNodes = _.slice(nodes, 0, 100).map((n) => {
      return n[1];
    });

    return teaNodes;
  }

  async faucet(target_address) {
    const da = this.getDefaultAccount();
    const total = new BN((1000 * this.asUnit()).toString(), 10);
    const transfer = this.api.tx.balances.transfer(target_address, total);

    return new Promise((resolve) => {
      transfer.signAndSend(da, (result) => {
        console.log(`Current status is ${result.status}`);

        if (result.status.isInBlock) {
          console.log(
            `Transaction included at blockHash ${result.status.asInBlock}`,
          );
          result.events.forEach(({event: {data, method, section}, phase}) => {
            console.log(
              '\t',
              phase.toString(),
              `: ${section}.${method}`,
              data.toString(),
            );
          });
        } else if (result.status.isFinalized) {
          console.log(
            `Transaction finalized at blockHash ${result.status.asFinalized}`,
          );
          resolve(true);
        }
      });
    });
  }
}
