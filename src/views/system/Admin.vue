<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        placeholder="请输入用户姓名"
      />
      <el-button
        v-permission="['GET /upas/user/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['PUT /upas/user/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="mainList"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <!-- <el-table-column
        align="center"
        label="管理员ID"
        prop="id"
      /> -->

      <el-table-column
        align="center"
        label="用户账号"
        prop="account"
      />

      <el-table-column
        align="center"
        label="用户姓名"
        prop="name"
      >
        <template slot-scope="{row}">
          <span>
            {{ row.name }}
          </span>
          <el-tag
            v-if="row.state === 1 "
            type="danger"
          >已禁用</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        align="center"
        label="管理员头像"
        prop="avatar"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.avatar"
            :src="scope.row.avatar"
            width="40"
          >
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        label="用户角色"
        prop="roles"
      >
        <template slot-scope="{row}">
          <div v-if="row.isRoot !== 1 && row.roles">
            <el-tag
              v-for="item in row.roles"
              :key="item.id"
              type="primary"
              style="margin:10px 20px 0 0;"
            > {{ item.appName }} : {{ item.name }}</el-tag>
          </div>
          <el-tag
            v-if="row.isRoot === 1"
            type="success"
          >
            root账号-拥有root权限
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <span v-if="row.isRoot !== 1">
            <el-button
              v-permission="['POST /upas/user/roles/update']"
              type="primary"
              size="mini"
              @click="handleUpdate(row)"
            >编辑</el-button>
            <el-button
              v-if="row.state === 0"
              v-permission="['POST /upas/user/upas/updateState']"
              type="warning"
              size="mini"
              @click="handleForbid(row)"
            >禁用</el-button>
            <el-button
              v-else
              v-permission="['POST /upas/user/upas/updateState']"
              type="success"
              size="mini"
              plain
              @click="handleEnable(row)"
            >启用</el-button>
            <el-button
              v-permission="['DELETE /upas/user/{id}']"
              type="danger"
              size="mini"
              @click="handleDelete(row)"
            >删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.limit"
      class="pagination-main"
      @pagination="getMainList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog-edit"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="right"
        label-width="130px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="用户账号"
          prop="account"
        >
          <el-input
            v-model.trim="dataForm.account"
            :disabled="dialogStatus === 'update'"
          />
        </el-form-item>
        <el-form-item
          label="用户姓名"
          prop="name"
        >
          <el-input v-model.trim="dataForm.name" />
        </el-form-item>
        <el-form-item
          v-if="dialogStatus === 'create'"
          label="管理员密码"
          prop="password"
        >
          <el-input
            v-model.trim="dataForm.password"
            type="password"
            auto-complete="off"
          />
        </el-form-item>
        <!-- <el-form-item
          label="管理员头像"
          prop="avatar"
        >
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.avatar"
              :src="dataForm.avatar"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item> -->
        <el-form-item
          v-for="roleItem in multiRoleList"
          :key="roleItem.id"
          :label="roleItem.name"
          prop="roleIds"
        >
          <el-select
            v-model="currentAccountRoleObj[roleItem.name]"
            placeholder="请选择角色"
            multiple
            @visible-change="onSelectRole"
          >
            <el-option
              v-for="item in roleItem.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus === 'create'"
          type="primary"
          @click="onCreateData"
        >确定</el-button>
        <el-button
          v-else
          type="primary"
          @click="onUpdateData"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  apiListAdmin,
  apiCreateAdmin,
  apiUpdateAdmin,
  apiDeleteAdmin,
  apiForbidUser
} from '@/api'
import { uploadPath } from '@/api/storage'
import { getToken, apiAllProjectRoles } from '@/api/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import refreshDataMixin from '@/mixins/refreshDataMixin'
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码至少6位'))
  } else {
    callback()
  }
}
export default {
  name: 'Admin',
  components: { Pagination },
  mixins: [refreshDataMixin],
  data() {
    return {
      uploadPath,
      mainList: [],
      total: 0,
      roleOptions: [],
      listLoading: true,
      listQuery: {
        current: 1,
        limit: 10,
        name: ''
      },
      dataForm: {
        id: null,
        account: null,
        name: null,
        password: null,
        avatar: null,
        roleIds: []
      },
      currentAccountRoleObj: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        account: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            validator: validatePassword,
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        roleIds: [
          { required: false, message: '管理员的角色不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      multiRoleList: []
    }
  },
  computed: {
    headers() {
      return {
        'ZYL-UPAS-TOKEN': getToken()
      }
    }
  },
  created() {
    this.getMainList()
    this.getRoleOptions()
    this.getAllRoleList()
  },
  methods: {
    refreshData() {
      this.listQuery = {
        current: 1,
        limit: 10,
        name: ''
      }
      this.getMainList()
    },
    async getMainList() {
      console.log('this.listQuery', this.listQuery)
      this.listLoading = true
      try {
        const {
          data: { entity = {} }
        } = await apiListAdmin(this.listQuery)
        this.mainList = entity.list || []
        this.total = entity.total
        this.listLoading = false
      } catch (error) {
        this.mainList = []
        this.total = 0
        this.listLoading = false
        this.$commonFunc.alertError(error)
      }
    },
    async getRoleOptions() {
      // try {
      //   const {
      //     data: { entity = [] }
      //   } = await apiAllRoles()
      //   this.roleOptions = entity || []
      // } catch (error) {
      //   this.$commonFunc.alertError(error)
      // }
      this.getAllRoleList()
    },
    async getAllRoleList() {
      try {
        const { data } = await apiAllProjectRoles()
        this.appList = data.entity || []
        const multiRoleList = []
        this.appList.forEach(item => {
          multiRoleList.push({
            id: item.id,
            name: item.appName,
            list: item.roleInfoDtoList
          })
        })
        this.multiRoleList = multiRoleList
        console.log(this.multiRoleList, 2333)
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    handleCreate() {
      this.resetForm()
      this.currentAccountRoleObj = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      console.log(this.listQuery)
      this.listQuery.current = 1
      this.getMainList()
    },
    handleUpdate(row) {
      console.log(row, 20202020)
      this.dataForm = Object.assign({}, row)
      this.currentAccountRoleObj = {}
      row.roles.forEach(item => {
        const key = item.appName
        if (!this.currentAccountRoleObj[key]) {
          this.$set(this.currentAccountRoleObj, key, [])
        }
        this.currentAccountRoleObj[key].push(item.id)
      })
      this.$set(
        this.dataForm,
        'roleIds',
        row.roles.map(item => item.id)
      )
      this.$delete(this.dataForm, 'roles')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.currentAccountRoleObj, 55666)
    },
    handleDelete(row) {
      this.$confirm('确认删除此管理员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.isNetBlocking = true
          try {
            await apiDeleteAdmin({ id: row.id })
            this.isNetBlocking = false
            this.$notify.success({
              title: '成功',
              message: '删除管理员成功'
            })
            this.getMainList()
          } catch (error) {
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    async handleForbid(row) {
      console.log(row)
      try {
        await apiForbidUser({ userId: row.id, state: 1 })
        this.getMainList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async handleEnable(row) {
      try {
        await apiForbidUser({ userId: row.id, state: 0 })
        this.getMainList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    onCreateData() {
      this.setRoleIds()
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          try {
            const { account, name, password, roleIds } = this.dataForm
            await apiCreateAdmin({ account, name, password, roleIds })
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '添加管理员成功'
            })
            this.getMainList()
          } catch (error) {
            this.$commonFunc.alertError(error)
          }
        }
      })
    },
    onUpdateData() {
      this.setRoleIds()
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          try {
            await apiUpdateAdmin(this.dataForm)
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新管理员成功'
            })
            this.getMainList()
          } catch (error) {
            this.$commonFunc.alertError(error)
          }
        }
      })
    },
    onSelectRole(slideDown) {
      if (slideDown) {
        this.getRoleOptions()
      }
    },
    uploadAvatar(response) {
      this.dataForm.avatar = response.data.url
    },
    setRoleIds() {
      const tempIds = []
      Object.keys(this.currentAccountRoleObj).forEach(key => {
        const ids = this.currentAccountRoleObj[key]
        tempIds.push(...ids)
      })
      this.dataForm.roleIds = tempIds
    },
    resetForm() {
      this.dataForm = {
        id: null,
        account: null,
        name: null,
        password: null,
        avatar: null,
        roleIds: []
      }
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .dialog-edit {
  .el-select {
    width: 300px;
  }
}
</style>

