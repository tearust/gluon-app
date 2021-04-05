<template>
<div class="tea-page">

  <h4>UTILITY</h4>
  <div class="t-box">
    <el-button type="primary" @click="showQrCode()">SHOW QR CODE</el-button>
    <el-button type="primary" @click="showSelectLayer1()">SELECT LAYER1</el-button>
    <!-- <el-button type="primary" @click="zipJsonSize()">ZIP JSON</el-button> -->
  </div>
  <el-divider />

  <h4>LAYER1 - PAIR</h4>
  <div class="t-box">
    <el-button type="primary" @click="pairWithMobile()">PAIR WITH MOBILE</el-button>
    <el-button type="primary" @click="mobileResponsePair()">MOBILE RESPONSE PAIR</el-button>
  </div>
  <el-divider />

  <el-divider />
  <el-divider />
  <h4>LAYER1 - SYSTEM</h4>
  <div class="t-box">
    <el-button type="primary" size="small" @click="system_rpcInfo()">System RPC</el-button>
    
  </div>

</div>
</template>
<script>
import Test from '../workflow/Test';
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
export default {
  data(){
    return {
      nonce: null,

      generate_account: null,

      delegator: null,
    };
  },

  computed: {
    ...mapGetters([
      'layer1_account'
    ]),
    ...mapState([
      'bind_mobile',
    ]),
  },

  async mounted(){
    this.$root.loading(true);

    this.test = new Test();
    window.test = this.test;
    await this.test.init();

    this.$root.loading(false);
  },

  methods: {
    showQrCode(){
      this.test.showQrCodeModal({
        text: 'jacky.li'
      })
    },
    showSelectLayer1(){
      this.test.showSelectLayer1Modal(true);
    },

    async pairWithMobile(){
      const address = this.layer1_account.address;

      // const ac = this.test.layer1.getDefaultAccount('Alice');
      try{
        const nonce = this.test.gluon.getRandomNonce();
        await this.test.gluon.sendNonceForPairMobileDevice(nonce, address);
        this.nonce = nonce;
        this.$message.success('success');

        // start listening
        this.test.gluon.buildCallback('RegistrationApplicationSucceed', (a, b)=>{
          console.log(12, a, b);
        })

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    },

    async mobileResponsePair(){
      const ac = this.test.layer1.getDefaultAccount('Bob');

      // console.log(ac.address);
      if(!this.nonce){
        return alert('pair first');
      }
      
      try{
        const nonce = this.nonce;
        await this.test.gluon.responePairWithNonce(nonce, ac, this.layer1_account.address, {
          uuid: 'TEST_MOBILE_UUID',
        });

      }catch(e){
        const err = e.message || e.toString();
        this.$alert(err, 'Layer1 Error', {
          type: 'error'
        });
      }
      
    },


    zipJsonSize(){
      const rs = this.test.gluon.zipJsonSize();
      console.log(JSON.stringify(rs));
    },

    async system_rpcInfo(){
      const layer1 = this.test.layer1;
      const rpc = layer1.api.rpc;
      const version = await rpc.system.version();
      console.log('version =>', version.toHuman());

      const name = await rpc.system.name();
      console.log('name =>', name.toHuman());

      const chain = await rpc.system.chain();
      console.log('chain =>', chain.toHuman());

      const chainType = await rpc.system.chainType();
      console.log('chainType =>', chainType.toHuman());

      const health = await rpc.system.health();
      console.log('health =>', health.toHuman());

      const localPeerId = await rpc.system.localPeerId();
      console.log('localPeerId =>', localPeerId.toHuman());

   
    },


    showError(e){
      const err = e.message || e.toString();
      this.$alert(err, 'Layer1 Error', {
        type: 'error'
      });
    },
  },

}
</script>
<style lang="scss">
.t-box{
  display: flex;
  flex-direction: 'row';
}
.x-log{
  position: fixed;
  top: 80px;
  right: 0;
  width: 400px;
  background: #000;
  min-height: 200px;
  padding: 12px 15px;
  color: lime;
  
  p{
    margin: 0;
    margin-bottom: 8px;
  }
}
</style>