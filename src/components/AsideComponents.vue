<script setup>

</script>

<template>
  <el-menu style="height:100vh"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           default-active="/Home"
           :collapse="isCollapse"
           :collapse-transition="false"
           router
  >
    <el-menu-item index="/Home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item :index="'/'+item.menuClick" v-for="(item,i) in menu" :key="i">
      <i :class="item.menuIcon"></i>
      <span slot="title">{{item.menuName}}</span>
    </el-menu-item>


  </el-menu>
</template>

<script>
export default {
  name:"AsideComponents",
  data(){
    return{
      //isCollapse:false

      /*menu:[
        {
          menuClick:'Admin',
          menuName:'管理员管理',
          menuIcon:'el-icon-s-custom'
        },{
          menuClick:'User',
          menuName:'用户管理',
          menuIcon:'el-icon-user-solid'
        }
      ]*/
    };
  },

  computed:{
    "menu":{
      get(){
        return this.$store.state.menu
      }
    }
  },

  props:{
    isCollapse:Boolean
  }
}
</script>

<style scoped>

</style>