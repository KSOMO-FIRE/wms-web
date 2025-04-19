<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入物品名" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-select v-model="storage" placeholder="请选择仓库" style="margin-left: 5px;">
        <el-option
            v-for="item in storageData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="goodstype" placeholder="请选择分类" style="margin-left: 5px;">
        <el-option
            v-for="item in goodstypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>

      <el-button type="primary" style="margin-left: 5px;" @click="add" v-if="user.roleId!=2">新增</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="inGoods" v-if="user.roleId!=2">入库</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="outGoods" v-if="user.roleId!=2">出库</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
              highlight-current-row
              @current-change="selectCurrentChange"
    >
      <el-table-column  fixed prop="id" label="ID" width="60">
      </el-table-column>
      <!-- 临期提醒列 -->
      <el-table-column label="临期提醒" width="100">
        <template slot-scope="scope">
          <i v-if="scope.row.isNearExpiry" class="el-icon-warning" style="color: red;"></i>
          <i v-else class="el-icon-success" style="color: green;"></i>
        </template>
      </el-table-column>
      <!-- 库存告警列 -->
      <el-table-column label="库存告警" width="100">
        <template slot-scope="scope">
          <i v-if="scope.row.isLowStock" class="el-icon-warning" style="color: red;"></i>
          <i v-else class="el-icon-success" style="color: green;"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物品名" width="180">
      </el-table-column>
      <el-table-column prop="imageUrl" label="商品图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="商品图片"
               style="width: 100px; height: 100px; object-fit: contain;"
               @click="showPreview(scope.row.imageUrl)"
               >
          </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="180">
      </el-table-column>
      <el-table-column prop="specification" label="规格" width="180">
      </el-table-column>
      <el-table-column prop="productionDate" label="生产日期" width="180" >
        <template slot-scope="scope">
          {{ scope.row.productionDate.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column prop="shelfDate" label="保质期" width="180" >
      </el-table-column>
      <el-table-column prop="storage" label="仓库" width="180" :formatter="formatStorage">
      </el-table-column>
      <el-table-column prop="goodstype" label="分类" width="180" :formatter="formatGoodstype">
      </el-table-column>
      <el-table-column prop="count" label="数量" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column fixed="right" prop="operate" label="操作" width="150" v-if="user.roleId!=2">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger" >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <!--新增商品对话框-->
    <el-dialog
        title="物品维护"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="物品名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="商品图片" prop="imageUrl">
          <el-upload
              class="upload-demo"
              action="http://localhost:8090/file/upload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过100MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-col :span="20">
            <el-input v-model="form.price" placeholder="请输入价格"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-col :span="20">
            <el-input v-model="form.specification" placeholder="请输入规格"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="生产日期" prop="productionDate">
          <el-col :span="20">
            <el-date-picker
                v-model="form.productionDate"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="保质期" prop="shelfDays">
          <el-input
              v-model.number="form.shelfDate"
              placeholder="请输入保质期天数"
              type="number"
              min="0">
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="storage">
          <el-col :span="20">
            <el-select v-model="form.storage" placeholder="请选择仓库" style="margin-left: 5px;">
              <el-option
                  v-for="item in storageData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="goodstype">
          <el-col :span="20">
            <el-select v-model="form.goodstype" placeholder="请选择分类" style="margin-left: 5px;">
              <el-option
                  v-for="item in goodstypeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="form.count"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>

    <!--出入库对话框-->
    <el-dialog
        title="出入库"
        :visible.sync="inDialogVisible"
        width="30%"
        center>

      <el-dialog
          width="75%"
          title="用户选择"
          :visible.sync="innerVisible"
          append-to-body>
        <SelectUser @doSelectUser="doSelectUser"></SelectUser>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmUser">确 定</el-button>
                  </span>
      </el-dialog>

      <el-form ref="form1" :rules="rules1" :model="form1" label-width="80px">
        <el-form-item label="物品名">
          <el-col :span="20">
            <el-input v-model="form1.goodsname" readonly></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-col :span="20">
            <el-input v-model="addNum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="20">
            <el-input type="textarea" v-model="form1.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="inDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doInGoods">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: "GoodsManage",
  data() {
    let checkCount = (rule, value, callback) => {
      if(value>9999){
        callback(new Error('数量输入过大'));
      }else{
        callback();
      }
    };

    return {
      user : JSON.parse(sessionStorage.getItem('CurUser')),
      storageData:[],
      goodstypeData:[],
      tableData: [],
      pageSize:4,
      pageNum:1,
      total:0,
      name:'',
      storage:'',
      goodstype:'',
      centerDialogVisible:false,
      inDialogVisible:false,
      innerVisible:false,
      currentRow:{},
      tempUser:{},
      addNum:"",
      fileList:[],


      form:{
        id:'',
        name:'',
        specification:'',
        price:'',
        productionDate:'',
        shelfDate:'',
        imageUrl:'',
        storage:'',
        goodstype:'',
        count:'',
        remark:''
      },


      form1:{
        goods:'',
        goodsname:'',
        count:'',
        username:'',
        userid:'',
        adminId:'',
        remark:'',
        action:'1',
        addNum:""
      },


      rules1: {

      },


      rules: {
        name: [
          {required: true, message: '请输入物品名', trigger: 'blur'}
        ],
        imageUrl: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        specification: [
          { required: true, message: '请输入规格', trigger: 'blur' }
        ],
        shelfDate: [
          { required: true, message: '请输入保质期天数', trigger: 'blur' },
          { type: 'number', min: 0, message: '保质期天数必须为正整数', trigger: 'blur' }
        ],
        storage:[
          {required: true, message: '请选择仓库', trigger: 'blur'}
        ],
        goodstype:[
          {required: true, message: '请选择分类', trigger: 'blur'}
        ],
        count: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {pattern: /^([1-9][0-9]*){1,4}$/,message: '数量必须为正整数字',trigger: "blur"},
          {validator:checkCount,trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    showPreview(url) {
      if (!url) {
        this.$message.warning('暂无商品图片');
        return;
      }

      this.$alert(`<img src="${url}" style="max-width: 100%;">`, '图片预览', {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        closeOnClickModal: true
      })
          .then(() => {
            // 确认操作（本示例未使用确认按钮）
          })
          .catch((err) => {
            if (err === 'cancel' || err === 'close') {
              // 正常关闭行为
              console.log('用户主动关闭预览');
            } else {
              console.error('预览异常:', err);
            }
          });
    },

    handleRemove(file, fileList) {
      console.log('文件已移除:', file);
      this.fileList = fileList; // 更新文件列表
    },

    handlePreview(file) {
      this.showPreview(file.url);
    },

    doSelectUser(val){
      console.log(val)
      this.tempUser = val
    },

    confirmUser(){
      this.form1.username = this.tempUser.name
      this.form1.userid = this.tempUser.id

      this.innerVisible = false
    },

    selectCurrentChange(val) {
      this.currentRow = val;
    },

    formatStorage(row){
      let temp =  this.storageData.find(item=>{
        return item.id == row.storage
      })

      return temp && temp.name
    },

    formatGoodstype(row){
      let temp =  this.goodstypeData.find(item=>{
        return item.id == row.goodstype
      })

      return temp && temp.name
    },

    resetForm() {
      this.$refs.form.resetFields();
    },

    resetInForm(){
      this.$refs.form1.resetFields();
    },

    del(id){
      console.log(id)

      this.$axios.get(this.$httpUrl+'/goods/del?id='+id).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.loadPost()
        }else{
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }
      })
    },

    mod(row){
      this.centerDialogVisible = true
      this.$nextTick(()=>{
        //赋值到表单
        this.form.id = row.id
        this.form.name = row.name
        this.form.storage = row.storage
        this.form.goodstype = row.goodstype
        this.form.count = row.count
        this.form.remark = row.remark
        this.form.imageUrl =row.imageUrl
        this.form.price =row.price
        this.form.specification =row.specification
        this.form.productionDate =row.productionDate
        this.form.shelfDate =row.shelfDate
        this.form.isNearExpiry =row.isNearExpiry
        this.form.isLowStock =row.isLowStock
      })
    },

    add(){
      this.centerDialogVisible = true
      this.$nextTick(()=>{
        this.resetForm()

        this.form.id = '';
        this.form.imageUrl='';//清空图片URL
      })
    },

    inGoods(){
      if(!this.currentRow.id){
        alert('请选择记录');
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(()=>{
        this.resetInForm()
      })
      this.form1.count=this.currentRow.count
      this.form1.goodsname = this.currentRow.name
      this.form1.goods = this.currentRow.id
      this.form1.adminId=this.user.id
      this.form1.action='1'
    },

    outGoods(){
      if(!this.currentRow.id){
        alert('请选择记录');
        return;
      }
      this.inDialogVisible = true
      this.$nextTick(()=>{
        this.resetInForm()
      })
      this.form1.count=this.currentRow.count
      this.form1.goodsname = this.currentRow.name
      this.form1.goods = this.currentRow.id
      this.form1.adminId=this.user.id
      this.form1.action='2'
      console.log(this.form1)
    },

    doSave(){
      this.$axios.post(this.$httpUrl+'/goods/save',this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this. resetForm()
        }else{
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }
      })
    },

    doMod(){
      this.$axios.post(this.$httpUrl+'/goods/update',this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this. resetForm()
        }else{
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },

    save(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.form.id){
            this.doMod();
          }else{
            this.doSave();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    doInGoods(){
      this.form1.addNum=this.addNum;
      console.log(this.addNum);
      console.log(this.form1.count);
      if(this.form1.add<0){
        this.$message({
          message: '数量不能小于0！',
          type: 'error'
        })
        this.addNum="";
        return
      }
      console.log(this.addNum);
      console.log(this.form1.count);
      if(this.form1.action==='2'&&this.addNum>this.form1.count){
        this.$message({
          message: '出库数量不能大于库存数量！',
          type: 'error'
        })
        this.addNum="";
        return
      }
      this.$axios.post(this.$httpUrl+'/record/save',this.form1).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.inDialogVisible = false;
          this.addNum="";
          this.loadPost()
          this. resetInForm()
        }else{
          this.addNum="";
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }
      })
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum=1
      this.pageSize=val
      this.loadPost()
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum=val
      this.loadPost()
    },

    resetParam(){
      this.name=''
      this.storage=''
      this.goodstype=''
    },

    loadPost(){
      this.$axios.post(this.$httpUrl+'/goods/listPage',{
        pageSize:this.pageSize,
        pageNum:this.pageNum,
        param:{
          name:this.name,
          goodstype:this.goodstype+'',
          storage:this.storage+''
        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.tableData=res.data
          this.total= res.total
        }else{
          alert('获取数据失败')
        }

      })
    },

    loadStorage(){
      this.$axios.get(this.$httpUrl+'/storage/list').then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.storageData=res.data
        }else{
          alert('获取数据失败')
        }

      })
    },

    loadGoodstype(){
      this.$axios.get(this.$httpUrl+'/goodstype/list').then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code==200){
          this.goodstypeData=res.data
        }else{
          alert('获取数据失败')
        }
      });
    },

    handleAvatarSuccess(response, file) {
      // 假设你的返回数据格式是 {"code": 200, "message": "成功", "data": "文件上传成功，URL: https://ljx-wms.oss-cn-chengdu.aliyuncs.com/1b340602-efba-476e-a4c8-8de85158721f.png"}
      if (response.code === 200) {
        // 提取图片 URL
        const imageUrl = response.data.split('URL: ')[1];

        // 更新 form 中的 imageUrl
        this.form.imageUrl = imageUrl;

        // 清除该字段的验证错误（如果有的话）
        this.$refs['form'].clearValidate('imageUrl');

        // 可选：显示一个成功的提示信息
        this.$message({
          message: '图片上传成功',
          type: 'success'
        });
        //更新文件列表
        this.fileList.push({
          name: file.name,
          url: imageUrl,
        });
      } else {
        // 如果上传失败，给出错误提示
        this.$message.error('图片上传失败，请重试');
      }
    },

    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt100M = file.size / 1024 /1024< 100;

      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt100M) {
        this.$message.error('上传头像图片大小不能超过 100MB!');
      }
      return isJPGorPNG && isLt100M;
    }
  },

  formatDate(dateString) {
    if (!dateString) return ''; // 如果日期为空，返回空字符串
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  beforeMount() {
    this.loadStorage()
    this.loadGoodstype()
    this.loadPost()
  },

}
</script>

<style scoped>

.upload-demo {
  width: 100%;
}

.el-upload__tip {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}


</style>