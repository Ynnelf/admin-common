<template>
  <div class="app-container">

    <el-tabs
      v-model="currentAppCode"
      type="card"
      @tab-click="toggleTab"
    >
      <el-tab-pane
        v-for="app in appList"
        :key="app.appCode"
        :label="app.appName"
        :name="app.appCode"
      />
    </el-tabs>

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.condition.name"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入角色名称"
      />
      <el-button
        :loading="listLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
      <el-button
        v-permission="['PUT /upas/role/add']"
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
      <el-table-column
        align="center"
        label="角色名称"
        prop="name"
      />

      <el-table-column
        align="center"
        label="说明"
        prop="memo"
      />

      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /upas/role/update']"
            :loading="isNetBlocking"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['DELETE /upas/role/{id}']"
            :loading="isNetBlocking"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            v-permission="['GET /upas/auth-tree/project/getTreeByAppCode']"
            :loading="isNetBlocking"
            type="primary"
            size="mini"
            @click="handlePermission(scope.row)"
          >菜单配置</el-button>
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
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input
            v-model.trim="dataForm.name"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="说明"
          prop="memo"
        >
          <el-input
            v-model.trim="dataForm.memo"
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus === 'create'"
          v-permission="['PUT /upas/role/add']"
          :loading="isNetBlocking"
          type="primary"
          @click="onCreateData"
        >添加</el-button>
        <span v-else>
          <el-button
            v-permission="['POST /upas/role/update']"
            :loading="isNetBlocking"
            type="primary"
            @click="onUpdateData"
          >更新</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      :visible.sync="permissionDialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="菜单配置"
    >
      <el-tree
        ref="tree"
        :data="systemPermissions"
        :default-checked-keys="assignedPermissions"
        :expand-on-click-node="true"
        default-expand-all
        show-checkbox
        highlight-current
        node-key="id"
      >
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node"
        >
          <span>{{ data.name }}</span>
          <el-tag
            v-if="data.way"
            :type="getLabelType(data.way)"
          >{{ data.way }}</el-tag>
          <el-tag
            v-if="data.path"
            type="warning"
          >{{ data.path }}</el-tag>
        </span>
      </el-tree>
      <el-button
        size="small"
        style="margin-top:20px;"
        @click="onSelectAll"
      >全选</el-button>
      <el-button
        size="small"
        style="margin-top:20px;"
        @click="onCancelAll"
      >清空</el-button>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="permissionDialogFormVisible = false">取消</el-button>
        <el-button
          v-permission="['POST /upas/role/permission/update']"
          :loading="isNetBlocking"
          type="primary"
          @click="onUpdatePermission"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { apiRoleList, apiCreateRole, apiUpdateRole, apiDeleteRole } from '@/api'
import {
  apiRoleMenus,
  apiAllProjectRoles,
  apiAppAuthTrees,
  apiUpdateRoleMenu
} from '@/api/auth'
import Pagination from '@/components/Pagination'
import refreshDataMixin from '@/mixins/refreshDataMixin'
export default {
  name: 'Role',
  components: { Pagination },
  mixins: [refreshDataMixin],
  data() {
    return {
      mainList: [],
      total: 0,
      listQuery: {
        current: 1,
        limit: 10,
        condition: {
          appId: '',
          name: null
        }
      },
      dataForm: {
        id: null,
        name: null,
        memo: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '创建角色'
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      permissionDialogFormVisible: false,
      systemPermissions: [],
      assignedPermissions: [],
      permissionForm: {
        roleId: null,
        checkedIds: []
      },
      listLoading: false,
      isNetBlocking: false,
      currentAppCode: '',
      currentAppId: '',
      appList: [] // 项目列表
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refreshData() {
      this.listQuery = {
        current: 1,
        limit: 10,
        condition: {
          appId: '',
          name: null
        }
      }
      this.refresh()
    },
    refresh() {
      this.currentAppCode = this.$cookies.get('__ROLE_TAB__') || ''
      this.getAllRoleList()
    },
    async getMainList() {
      this.listLoading = true
      this.listQuery.condition.appId = this.currentAppId
      try {
        const {
          data: { entity = {} }
        } = await apiRoleList(this.listQuery)
        this.mainList = entity.rows
        this.total = entity.total
        this.listLoading = false
      } catch (error) {
        this.mainList = []
        this.total = 0
        this.listLoading = false
        this.$commonFunc.alertError(error)
      }
    },
    getLabelType(method) {
      let type = ''
      switch (method) {
        case 'GET':
          type = ''
          break
        case 'POST':
          type = 'success'
          break
        case 'PUT':
          type = 'success'
          break
        case 'DELETE':
          type = 'danger'
          break
        default:
          type = 'info'
      }
      return type
    },
    async getAllRoleList() {
      try {
        const { data } = await apiAllProjectRoles()
        this.appList = data.entity || []
        if (!this.currentAppCode || this.currentAppCode === '0') {
          // 页面第一次进来或者浏览器刷新
          this.mainList = this.appList[0] && this.appList[0].roleInfoDtoList
          this.currentAppCode = this.appList[0] && this.appList[0].appCode
          this.currentAppId = this.appList[0] && this.appList[0].id
        } else {
          // 通过添加角色或者修改角色  更新数据
          this.toggleTab()
        }
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getMainList()
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除此权限角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.isNetBlocking = true
          try {
            await apiDeleteRole({ id: row.id })
            this.$notify.success({
              title: '成功',
              message: '删除角色成功'
            })
            this.isNetBlocking = false
            this.refresh()
          } catch (error) {
            this.$commonFunc.alertError(error)
            this.isNetBlocking = false
          }
        })
        .catch(() => {})
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handlePermission(row) {
      this.permissionForm.roleId = row.id
      this.assignedPermissions = [] // 先清空
      try {
        const {
          data: { entity = [] }
        } = await apiAppAuthTrees({ appId: this.currentAppId })
        this.systemPermissions = entity.menuInfoDtos || []
        this.permissionDialogFormVisible = true
        console.log(this.systemPermissions)
        this.getAssignedPermissions(row.id)
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    toggleTab(e) {
      this.$set(this.listQuery, 'condition', { name: '' })
      const app = this.appList.find(item => {
        return item.appCode === this.currentAppCode
      })
      this.currentAppId = (app && app.id) || []
      this.mainList = (app && app.roleInfoDtoList) || []
      this.$cookies.set('__ROLE_TAB__', this.currentAppCode)
    },
    async getAssignedPermissions(id) {
      try {
        let {
          data: { entity = [] }
        } = await apiRoleMenus({ id })
        entity = entity || []
        console.log('assigned', entity)
        const assignedIds = []
        this.getFlattArrayIds(entity, assignedIds)
        this.assignedPermissions = assignedIds
        this.$forceUpdate()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    getFlattArrayIds(assignedList, assignedIds) {
      assignedList.forEach(item => {
        // checked属性  1 是勾选
        item.checked && assignedIds.push(item.id)
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length
        ) {
          this.getFlattArrayIds(item.children, assignedIds)
        }
      })
      return assignedIds
    },
    getInfiniteIds(list, idArr) {
      list.forEach(item => {
        if (item.children && item.children.length) {
          this.getInfiniteIds(item.children, idArr)
        } else {
          idArr.push(item.id)
        }
      })
    },
    onCreateData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          try {
            this.isNetBlocking = true
            const { name, memo } = this.dataForm
            await apiCreateRole({ name, memo, appId: this.currentAppId })
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '添加角色成功'
            })
            setTimeout(() => {
              this.isNetBlocking = false
              this.refresh()
            }, 500)
          } catch (error) {
            this.dialogFormVisible = false
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        }
      })
    },
    onUpdateData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          this.isNetBlocking = true
          try {
            await apiUpdateRole(this.dataForm)
            this.dialogFormVisible = false
            this.refresh()
            this.$notify.success({
              title: '成功',
              message: '更新角色成功'
            })
            setTimeout(() => {
              this.isNetBlocking = false
            }, 1000)
          } catch (error) {
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        }
      })
    },
    async onUpdatePermission() {
      this.permissionForm.checkedIds = this.$refs.tree.getCheckedKeys(true)
      const data = {
        id: this.permissionForm.roleId,
        menuIds: this.permissionForm.checkedIds
      }
      try {
        this.isNetBlocking = true
        await apiUpdateRoleMenu(data)
        this.$notify.success({
          title: '成功',
          message: '授权成功'
        })
        this.permissionDialogFormVisible = false
        setTimeout(() => {
          this.isNetBlocking = false
        }, 1000)
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    onSelectAll() {
      const keys = []
      this.getInfiniteIds(this.systemPermissions, keys)
      this.$refs.tree.setCheckedKeys(keys)
    },
    onCancelAll() {
      this.$refs.tree.setCheckedKeys([])
    },
    resetForm() {
      this.dataForm = {
        id: null,
        name: null,
        memo: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs {
  margin-bottom: 30px;
  .el-tabs__item {
    &.is-active {
      background: #1890ff;
      border-color: #1890ff;
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
    &:hover {
      color: #1890ff;
    }
  }
}
/deep/ .el-tree {
  .el-tree-node__content {
    margin-top: 6px;
    .el-tag {
      height: 26px;
      line-height: 24px;
      margin-left: 4px;
    }
  }
}
</style>
