<template>
<div class="c-pageheader">

<el-menu active-text-color="#35a696" :default-active="activeIndex" class="p-header" @select="handleSelect" mode="horizontal">
  <a href="javascript:void(0)" onClick="location.reload()" style="float:left;">
    <el-image
      style="width: 60px; height: 60px;"
      src="http://gluonwallet.com/img/logo.png"
      fit="fit">
    </el-image>
    
    <b class="lg">GLUON-WALLET</b>
  </a>
  

  
  <el-menu-item style="margin-left: 50px;" index="/login_account">{{layer1_account.name || 'N/A'}}</el-menu-item>

  <el-menu-item index="/social_recovery">{{'Recovery'}}</el-menu-item>
  
  <el-menu-item index="/">{{'Home'}}</el-menu-item>

  <!-- <el-menu-item v-if="$root.isDev()" index="/test">{{'Test'}}</el-menu-item> -->
    
    <!-- <a href="http://tearust.com/" target="_blank">WEBSITE</a> -->
    

  
</el-menu>
<div class="t-state" :class="'x_'+connected"></div>
</div>
  

</template>
<script>
import {mapGetters} from 'vuex';
import Base from '../workflow/Base';
import _ from 'lodash';
export default {
  data() {
    return {
      activeIndex: null,
      connected: 0,
    };
  },
  watch: {
    '$route': {
      immediate: true,
      handler (to, from){
        let name = to.path;

        this.activeIndex = name;
      }
    }
  },
  computed: {
    ...mapGetters(['layer1_account'])
  },
  methods: {
    handleSelect(key, keyPath) {
      if(key === 'lang'){
        this.changeLang();
        return false;
      }
      
      if(this.$route.path !== key){
        this.$router.push(key);
      }
      
    },
    changeLang(){
      if(this.$i18n.locale === 'en'){
        window.changeLanguage('zh');
      }
      else{
        window.changeLanguage('en');
      }

    },
    
  },
  mounted(){

    let time = 500;

    const loop = ()=>{
      try{
        const wf = new Base();
        const connected = wf.layer1.isConnected();
        if(connected !== this.connected){
          this.connected = connected;
        }
        
        if(this.connected > 0){
          time = 2000;
        }

      }catch(e){
        this.connected = 0;
      }
     
      _.delay(()=>{
        loop();
      }, time);
    };

    loop();
  }
}
</script>
<style lang="scss">
.c-pageheader{
  position: sticky;
  top: 0;
  display: block;
  border-bottom: 1px solid #eee;
  background: #fff;
  z-index: 99;
  text-align: center;
}

.p-header{
  padding: 10px 0 0 0;
  margin: 0 auto;
  width: 960px;

  .lg{
    font-size: 20px;
    color: #333;
    position: relative;
    vertical-align: top;
    top: 20px;
    left: 10px;
  }
}
.el-menu--horizontal > .el-menu-item{
  float: right;
  
}
.el-menu--horizontal > .el-submenu{
  float: right;
  
}
.el-menu.el-menu--horizontal{
  border-bottom: none;
}

.t-state{
  height: 2px;
  width: 100%;
  display: block;
  
  &.x_0{
    background: red;
  }
  &.x_1{
    background: yellow;
  }
  &.x_2{
    background: #35a696;
  }

}
</style>