<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入单位名称" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-select v-model="type" placeholder="请选择类型" style="margin-left: 5px;width: 120px;">
        <el-option label="全部" value=""></el-option>
        <el-option label="供应商" value="0"></el-option>
        <el-option label="客户" value="1"></el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>

      <el-button type="primary" style="margin-left: 5px;" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
    >
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="单位名称" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.type === false ? '供应商' : '客户' }}
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系人" width="120"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="operate" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20,30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog
        title="往来单位信息"
        :visible.sync="centerDialogVisible"
        width="40%"
        center>

      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="单位名称" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="false">供应商</el-radio>
            <el-radio :label="true">客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-col :span="20">
            <el-input v-model="form.contact"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-col :span="20">
            <el-input v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="地址">
          <el-col :span="20">
            <el-input v-model="form.address"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="备注">
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
  </div>
</template>

<script>
export default {
  name: "PartnerManage",
  data() {
    // 电话号码验证规则
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系电话不能为空'));
      }
      setTimeout(() => {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('请输入有效的手机号码'));
        } else {
          callback();
        }
      }, 100);
    };

    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      name: '',
      type: '', // 查询类型
      centerDialogVisible: false,
      form: {
        id: '',
        name: '',
        type: false,
        contact: '',
        phone: '',
        address: '',
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入单位名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        contact: [
          {required: true, message: '请输入联系人', trigger: 'blur'}
        ],
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/partner/del?id=' + id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.loadPost();
        } else {
          this.$message.error('删除失败');
        }
      })
    },
    mod(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        // 浅拷贝对象
        this.form = {...row}
      })
    },
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm();
        this.form = {
          id: '',
          name: '',
          type: false,
          contact: '',
          phone: '',
          address: '',
          remark: ''
        }
      })
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/client/save', this.form).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功');
          this.centerDialogVisible = false
          this.loadPost()
        } else {
          this.$message.error('保存失败');
        }
      })
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/client/update', this.form).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
          this.centerDialogVisible = false
          this.loadPost()
        } else {
          this.$message.error('修改失败');
        }
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.id ? this.doMod() : this.doSave();
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadPost()
    },
    resetParam() {
      this.name = ''
      this.type = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/client/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          type: this.type
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error('数据加载失败');
        }
      })
    }
  },
  beforeMount() {
    this.loadPost()
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}
</style>