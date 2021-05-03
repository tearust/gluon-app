<template>
<div class="tea-page">

  <div class="tea-card" style="margin-bottom: 12px;" v-for="(address, i) in layer1_asset.dot" :key="i">
    <i class="x-icon el-icon-grape"></i>
    <div class="x-list">
      <div class="x-item">
        <b>TYPE</b>
        <span>XYZ</span>
      </div>
      <div class="x-item">
        <b>ADDRESS</b>
        <span>{{address}}</span>
      </div>

    </div>

    <div class="x-right">
      <el-button class="gray" @click="$alert('coming soon')">REMOVE</el-button>
    </div>
  </div>

  <el-divider />
  <div class="tea-card flex-center">
    <el-button @click="addTestDotAsset()" class="x-only-btn">Add Test Asset</el-button>
  </div>

  <el-divider />
  <div class="tea-card flex-center">
    <el-button @click="testTransferToOthers()" class="x-only-btn">Test Transfer to Others</el-button>
  </div>

</div>
</template>
<script>

import Home from '../workflow/Home';
import {_, sleep} from 'tearust_utils';
import utils from '../tea/utils';
import {stringToHex} from  'tearust_layer1';
import { mapGetters, mapState } from 'vuex';
export default {
  components: {
    
  },
  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'layer1_asset'
    ])
  },
  async mounted(){
    this.obj = new Home();
    await this.obj.init();

    await this.refreshAsset();

    
  },
  methods: {
    async refreshAsset(){
      await this.$store.dispatch('set_layer1_asset');
    },
    async addTestDotAsset(){
      const test_address = prompt('Please input the test asset address');
      if(!test_address) return false;

      this.$root.loading(true);
      try{
        const layer1_instance = this.obj.getLayer1Instance();
        // const gluon_pallet = layer1_instance.getGluonPallet(); 
        const api = layer1_instance.getApi();
        const tx = api.tx.gluon.testAddAccountAsset(stringToHex('dot'), stringToHex('XYZ_'+test_address));
        await layer1_instance.sendTx(this.layer1_account.address, tx);
        await sleep(1000);
 
        await this.refreshAsset();
      }catch(e){
        this.$alert(e, 'Layer1 Error', {
          type: 'error'
        });
      }
      this.$root.loading(false);
    },
    async testTransferToOthers(){
      const test_address = prompt('Please input the target layer1 address');
      if(!test_address) return false;

      this.$root.loading(true);
      try{
        const layer1_instance = this.obj.getLayer1Instance();
        // const gluon_pallet = layer1_instance.getGluonPallet(); 
        const api = layer1_instance.getApi();
        const tx = api.tx.gluon.testTransferAllAsset(test_address);
        await layer1_instance.sendTx(this.layer1_account.address, tx);
        await sleep(1000);
 
        await this.refreshAsset();
      }catch(e){
        this.$alert(e, 'Layer1 Error', {
          type: 'error'
        });
      }
      this.$root.loading(false);
    }
  }
}
</script>
<style lang="scss">

</style>