<template>
<div class="tea-page">

  
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
        <el-button class="gray" @click="$alert('coming soon')">REMOVE</el-button>
      </div>
    </div>
  </div>

  <el-divider />

  <div v-if="!recovery_rescuer">
    Rescuer lost layer1 account.
    <ul></ul>
  </div>
  <div class="tea-card flex-center" v-if="!recovery_rescuer">
    <el-button @click="set_current_modal.visible=true" class="x-only-btn">Rescuer Lost Account</el-button>
  </div>

  <el-divider />

  
  
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
      Input your 3 friends layer1 address here. when you need to recovery your account, please contact at least 2 friends to vouch for you, Tea Layer1 will recovery the account to your new account.
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

  

</div>
</template>
<script>

import SocialRecovery from '../workflow/SocialRecovery';
import _ from 'lodash';
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
    
  },
  methods: {
    async refresh(){
      await this.$store.dispatch('set_recovery_current');
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
        await this.obj.gluon.recovery_createRecovery(this.layer1_account.address, friend_list, 3, 100);
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

        const {lost_address, rescuer_address} = this.set_current_modal.form;
        console.log(11, lost_address, rescuer_address);

        // vouch recovery
        await this.obj.gluon.recovery_vouchRecovery(this.layer1_account.address, lost_address, rescuer_address);
        await utils.sleep(2000);

        this.$message.success('success');
        ref.resetFields();
        this.vouch_modal.visible = false;

      }catch(e){
        const msg = !e ? 'Invalid Input' : e.toString();
        this.$root.showError(msg);
      }

      this.$root.loading(false);
    }
  }
}
</script>
<style lang="scss">

</style>