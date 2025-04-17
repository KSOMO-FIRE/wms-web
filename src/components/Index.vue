<script setup>

</script>

<template>
  <el-container style="height: 100%; border: 1px solid #eee;">
    <el-aside :width="aside_width" style="background-color: rgb(238, 241, 246);height:100%; margin-left: -1px">
      <AsideComponents :isCollapse="isCollapse"></AsideComponents>
    </el-aside>

    <el-container style="height: 100%;">
      <el-header style="text-align: right; font-size: 12px;border-bottom:darkgray 1px solid">
        <HeaderComponents @doCollapse="doCollapse" :icon="icon"></HeaderComponents>
      </el-header>

      <el-main style="height: 100%;">
        <!--<MainComponents></MainComponents>-->
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import AsideComponents from "./AsideComponents.vue";
import HeaderComponents from "./HeaderComponents.vue";
//import MainComponents from "./MainComponents.vue";


export default {
  name:"IndexPage",
  components:{AsideComponents,HeaderComponents},
  data(){
    return{
      isCollapse:false,
      aside_width:'200px',
      icon:'el-icon-s-fold'
    }
  },
  methods:{
    doCollapse(){
      console.log(1111)

      this.isCollapse= !this.isCollapse
      if(!this.isCollapse) { //展开
        this.aside_width = '200px'
        this.icon='el-icon-s-fold'
      } else{//收起
          this.aside_width='64px'
          this.icon='el-icon-s-unfold'
      }
    }
  }

};
</script>

<style scoped>
.el-header {
  //background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-main {
  padding: 5px;
}

.el-aside {
  color: #333;
}
</style>