<template>
<div class="tea-page">

  <!-- Set recovery -->
  <div v-if="!recovery_current">
    Click button to set social recovery for current layer1 account.
    <ul>
    </ul>
  </div>
  <div class="tea-card flex-center" v-if="!recovery_current">
    <el-button @click="set_current_modal.visible=true" class="x-only-btn">Set Social Recovery</el-button>
  </div>

  <div v-if="recovery_current">
    <div class="tea-card" style="margin-bottom: 12px;">
      <i class="x-icon el-icon-cold-drink"></i>
      <div class="x-list">
        <div class="x-item">
          <b>ADDRESS</b>
          <span>{{layer1_account.address}}</span>
        </div>
        <div class="x-item" v-for="(friend,i) in recovery_current.friends" :key="i">
          <b>FRIEND {{i+1}}</b>
          <span>{{friend}}</span>
        </div>

      </div>

      <div class="x-right">
        <el-button class="gray" @click="removeCurrentRecoveryConfigHandler()">REMOVE</el-button>
      </div>
    </div>
  </div>

  <el-divider />

  <!-- Rescuer -->

  <div v-if="recovery_rescuer.length > 0">

    <div v-for="(item, i) in recovery_rescuer" :key="i" style="margin-top: 15px;">
      <div class="tea-card" style="margin-bottom: 12px;">
        <i class="x-icon el-icon-cold-drink"></i>
        <div class="x-list">

          <div class="x-item" style="">
            <b>STATUS</b>
            <span>{{item.status}}</span>
          </div>
          <div v-if="item.threshold" class="x-item" style="margin-bottom: 5px;">
            <b>THRESHOLD</b>
            <span>{{item.threshold}}</span>
          </div>

          <div class="x-item" v-for="(x, j) in item.process" :key="j">
            <b>{{x[0]}}</b>
            <span>{{x[1]?'Vouched':''}}</span>
          </div>

          <div class="x-item" v-if="item.status === 'started'">
            <b>Claim Account</b>
            <span>
              <el-button class="x-op" size="small" :disabled="!item.canClaim" @click="cliamRecoveryHandler(item.lost_address)">Confirm</el-button>
            </span>
          </div>

          <div class="x-item" v-if="item.status === 'success' || item.status === 'completed'">
            <b>RECOVERY ASSET</b>
            <span>
              <el-button class="x-op" size="small" @click="recoveryAssetToMineHandler(item.lost_address)">Recovery</el-button>
            </span>
          </div>

          <div class="x-item" v-if="item.status === 'proxy'">
            <b>{{item.lost_address}}</b>
            <span>
              <el-button class="x-op" size="small" @click="recoveryAssetToMineHandler(item.lost_address)">Transfer Assets</el-button>
            </span>
          </div>
          

        </div>

        <div class="x-right">
          <el-button @click="refreshForLost()">REFRESH</el-button>
          <el-button v-if="item.status === 'success'" class="gray" @click="closeForRescuerHandler(item)">CLOSE</el-button>
          <el-button v-if="item.status === 'completed'" class="gray" @click="removeForRescuerHandler(item)">REMOVE</el-button>
        </div>
      </div>
    </div>

  </div>

  <div>
    
    <ul></ul>
  </div>
  <div class="tea-card flex-center">
    <el-button @click="rescuer_modal.visible=true" class="x-only-btn">Rescuer Lost Account</el-button>
  </div>

  <el-divider />

  
  <!-- Vouch -->
  <div>
    Vouch for friend.
    <ul></ul>
  </div>
  <div class="tea-card flex-center">
    <el-button @click="vouch_modal.visible=true" class="x-only-btn">Vouch For Friend</el-button>
  </div>

  <el-divider />



  <el-dialog
    title="Set Social Recovery"
    :visible.sync="set_current_modal.visible"
    width="900"
    :close-on-click-modal="false"
    custom-class="tea-modal"
  >

    <p style="margin:0 15px 40px; font-size:15px;">
      Input your 3 friends layer1 address here. when you need to recovery your account, please contact at least 2 friends to vouch for you, Tea Layer1 will recovery the account assets to your new account.
    </p>
    <el-form :model="set_current_modal.form" :rules="set_current_modal.rules" ref="set_current_modal" label-width="80px">
      <el-form-item label="Friend 1" prop="friend_address_1">
        <el-input v-model="set_current_modal.form.friend_address_1"></el-input>
      </el-form-item>
      <el-form-item label="Friend 2" prop="friend_address_2">
        <el-input v-model="set_current_modal.form.friend_address_2"></el-input>
      </el-form-item>
      <el-form-item label="Friend 3" prop="friend_address_3">
        <el-input v-model="set_current_modal.form.friend_address_3"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="set_current_modal.visible = false">Close</el-button>
      <el-button type="primary" @click="setSocialRecoveryForCurrent()">Submit</el-button>
    </span>

  </el-dialog>

  <el-dialog
    title="Vouch For Friend"
    :visible.sync="vouch_modal.visible"
    width="900"
    :close-on-click-modal="false"
    custom-class="tea-modal"
  >

    <p style="margin:0 15px 40px; font-size:15px;">
      Please ensure each item you input are correct.
    </p>
    <el-form :model="vouch_modal.form" :rules="vouch_modal.rules" ref="vouch_modal" label-width="120px">
      <el-form-item label="Lost Address" prop="lost_address">
        <el-input v-model="vouch_modal.form.lost_address"></el-input>
      </el-form-item>
      <el-form-item label="Rescuer Address" prop="rescuer_address">
        <el-input v-model="vouch_modal.form.rescuer_address"></el-input>
      </el-form-item>
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="vouch_modal.visible = false">Close</el-button>
      <el-button type="primary" @click="submit_vouchForFriend()">Submit</el-button>
    </span>

  </el-dialog>

  <el-dialog
    title="Rescuer Lost Account"
    :visible.sync="rescuer_modal.visible"
    width="900"
    :close-on-click-modal="false"
    custom-class="tea-modal"
  >

    <p style="margin:0 15px 40px; font-size:15px;">
      Please ensure each item you input are correct.
    </p>
    <el-form :model="rescuer_modal.form" :rules="rescuer_modal.rules" ref="rescuer_modal" label-width="120px">
      <el-form-item label="Lost Address" prop="lost_address">
        <el-input v-model="rescuer_modal.form.lost_address"></el-input>
      </el-form-item>
      
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="rescuer_modal.visible = false">Close</el-button>
      <el-button type="primary" @click="submit_rescuerAccount()">Submit</el-button>
    </span>

  </el-dialog>

  

</div>
</template>
<script>

import SocialRecovery from '../workflow/SocialRecovery';
import {_} from 'tearust_utils';
import utils from '../tea/utils';
import { mapGetters, mapState } from 'vuex';
export default {
  data(){
    return {
      set_current_modal: {
        visible: false,
        form: {
          friend_address_1: '',
          friend_address_2: '',
          friend_address_3: '',
        },
        rules: {
          friend_address_1: [
            { required: true },
          ],
          friend_address_2: [
            { required: true },
          ],
          friend_address_3: [
            { required: true },
          ],
        }
      },
      vouch_modal: {
        visible: false,
        form: {
          lost_address: '',
          rescuer_address: ''
        },
        rules: {
          lost_address: [
            { required: true },
          ],
          rescuer_address: [
            { required: true },
          ]
        }
      },
      rescuer_modal: {
        visible: false,
        form: {
          lost_address: '',
        },
        rules: {
          lost_address: [
            { required: true },
          ],
        }
      }
    };
  },
  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'recovery_current',
      'recovery_rescuer',
    ])
  },
  async mounted(){
    this.obj = new SocialRecovery();
    await this.obj.init();

    await this.refresh();
    await this.refreshForLost();
  },
  methods: {
    getLostCacheKey(){
      return 'lost_address_list_'+this.layer1_account.address;
    },
    async refresh(){
      await this.$store.dispatch('set_recovery_current');
    },
    async refreshForLost(throw_error=false){
      const key = this.getLostCacheKey();
      const lost_list = utils.cache.get(key);

      if(!lost_list) return false;

      this.$root.loading(true);
      const new_list = [];
      utils.cache.remove(key);
      for(let i=0, len=lost_list.length; i<len; i++){
        try{
          await this.$store.dispatch('set_recovery_rescuer', lost_list[i]);
          new_list.push(lost_list[i]);
          utils.cache.put(key, new_list);
        }catch(e){
          if(throw_error){
            throw e;
          }
        }
      }

      await utils.sleep(500);
      // console.log(11, this.recovery_rescuer);
      this.$root.loading(false);
    },
    async setSocialRecoveryForCurrent(){
      const ref = this.$refs['set_current_modal'];

      this.$root.loading(true);
      try{
        await ref.validate();

        const {friend_address_1, friend_address_2, friend_address_3} = this.set_current_modal.form;
        console.log([friend_address_1, friend_address_2, friend_address_3])

        // create recovery
        const friend_list = [friend_address_1, friend_address_2, friend_address_3];
        
        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        await recovery_pallet.createRecovery(this.layer1_account.address, friend_list, 2, 100);
        await utils.sleep(2000);
        await this.refresh();

        this.$message.success('success');
        ref.resetFields();
        this.set_current_modal.visible = false;


      }catch(e){
        const msg = !e ? 'Invalid Input' : e.toString();
        this.$root.showError(msg);
      }

      this.$root.loading(false);
      
     
    },

    async submit_vouchForFriend(){
      const ref = this.$refs['vouch_modal'];

      this.$root.loading(true);
      try{
        await ref.validate();

        const {lost_address, rescuer_address} = this.vouch_modal.form;
        console.log(11, lost_address, rescuer_address);

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        // vouch recovery
        await recovery_pallet.vouchRecovery(this.layer1_account.address, lost_address, rescuer_address);
        await utils.sleep(2000);

        this.$message.success('success');
        ref.resetFields();
        this.vouch_modal.visible = false;

      }catch(e){
        const msg = !e ? 'Invalid Input' : e.toString();
        this.$root.showError(msg);
      }

      this.$root.loading(false);
    },

    async submit_rescuerAccount(){
      const key = this.getLostCacheKey();
      const ref = this.$refs['rescuer_modal'];

      this.$root.loading(true);
      try{
        await ref.validate();

        const {lost_address} = this.rescuer_modal.form;
        console.log(11, lost_address);

        const lost_list = utils.cache.get(key) || [];
        if(!_.includes(lost_list, lost_address)){
          lost_list.push(lost_address);
          utils.cache.put(key, lost_list);

        }

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        // initiateRecovery
        await recovery_pallet.initiateRecovery(this.layer1_account.address, lost_address);
        await utils.sleep(2000);

        await this.refreshForLost(true);
        this.$message.success('success');

      }catch(e){
        const msg = !e ? 'Invalid Input' : e.toString();
        this.$root.showError(msg);

      }

      ref.resetFields();
      this.rescuer_modal.visible = false;
      this.$root.loading(false);
    },

    async cliamRecoveryHandler(lost_address){
      this.$root.loading(true);
      try{

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        await recovery_pallet.claimRecovery(this.layer1_account.address, lost_address);
        await utils.sleep(3000);

        // await this.refreshForLost(true);
        // await this.refresh(true);
        this.$message.success('success');
        location.reload(true);
      }catch(e){
        this.$root.showError(e);
      }
      this.$root.loading(false);
    },

    async removeCurrentRecoveryConfigHandler(){
      this.$root.loading(true);
      try{

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        const api = layer1_instance.getApi();
        const tx = api.tx.recovery.removeRecovery();
        await layer1_instance.sendTx(this.layer1_account.address, tx);

        // await recovery_pallet.removeRecovery(this.layer1_account.address);
        await utils.sleep(2000);

        await this.refresh(true);
        this.$message.success('success');
      }catch(e){
        this.$root.showError(e);
      }
      this.$root.loading(false);
    },


    async recoveryAssetToMineHandler(lost_address){
      this.$root.loading(true);
      try{

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        await recovery_pallet.transferAssetToRescuer(this.layer1_account.address, lost_address);
        await utils.sleep(2000);

        await this.refreshForLost(true);
        this.$message.success('success');
      }catch(e){
        this.$root.showError(e);
      }
      this.$root.loading(false);
    },

    async closeForRescuerHandler(item){
      this.$root.loading(true);
      try{

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        const api = layer1_instance.getApi();

        const close_tx = api.tx.recovery.closeRecovery(this.layer1_account.address);
        const tx = api.tx.recovery.asRecovered(item.lost_address, close_tx);
        await layer1_instance.sendTx(this.layer1_account.address, tx);

        await utils.sleep(2000);

        await this.refresh(true);
        this.$message.success('success');
        location.reload(true);
      }catch(e){
        this.$root.showError(e);
      }
      this.$root.loading(false);
    },

    async removeForRescuerHandler(item){
      this.$root.loading(true);
      try{

        const layer1_instance = this.obj.getLayer1Instance();
        const recovery_pallet = layer1_instance.getRecoveryPallet();

        await recovery_pallet.removeRecovery(this.layer1_account.address, item.lost_address);
        await utils.sleep(2000);

        await this.refresh(true);
        this.$message.success('success');
        location.reload(true);
      }catch(e){
        this.$root.showError(e);
      }
      this.$root.loading(false);
    }
  }
}
</script>
<style lang="scss">

</style>