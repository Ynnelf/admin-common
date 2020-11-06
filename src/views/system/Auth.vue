<template>
  <div class="page-container">

    <div class="btn-head-wrap clearfix">
      <el-button
        v-permission="['PUT /upas/auth-tree/project/add']"
        class="btn-project-add fr"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="showProjectDialog('create')"
      >添加应用</el-button>
    </div>

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

    <el-row
      :gutter="40"
      class="tree-group"
    >
      <el-col
        :xs="24"
        :sm="24"
        :lg="12"
        class="tree-wrap"
      >
        <el-tag>{{ currentAppItem.appName }} / {{ currentAppItem.appCode }}</el-tag>
        <el-button
          style="color:#999;margin-left:12px;"
          type="text"
          @click="showProjectDialog('update',currentAppItem)"
        >修改应用名称</el-button>
        <el-button
          v-if="currentAppItem.apiTree.length === 0"
          v-permission="['DELETE /upas/auth-tree/project/{id}']"
          style="color:#ff4949;margin-left:12px;"
          type="text"
          @click="handleDeleteProject(currentAppItem)"
        >删除应用</el-button>
        <br>
        <el-button
          class="btn-api-group-add"
          @click="showGroupDialog('create',currentAppItem)"
        >添加模块</el-button>
        <el-switch
          v-model="isPathShow"
          style="margin-left:40px;"
          active-color="#42b983"
          inactive-color="#ccc"
        />
        <el-tree
          :ref="currentAppItem.appId"
          :data="currentAppItem.apiTree"
          :props="defaultProps"
          :expand-on-click-node="true"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          default-expand-all
          show-checkbox
          node-key="id"
          draggable
          @node-drag-end="(draggingNode, dropNode, dropType, ev)=>{handleDragEnd(draggingNode, dropNode, dropType, ev,currentAppItem)}"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span>{{ node.label }}</span>
            <span v-if="data.apiAddress && isPathShow">
              <el-tag
                v-if="data.apiAddress"
                :type="getLabelType(data.apiMethod)"
              >{{ data.apiMethod }}</el-tag>
              <el-tag type="warning">{{ data.apiAddress }}</el-tag>
            </span>
            <el-tooltip
              v-if="data.apiAddress && !isPathShow"
              :content=" data.apiMethod +' ' + data.apiAddress"
              class="item"
              effect="dark"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
            <span v-if="!data.apiAddress">
              <el-button
                v-permission="['POST /upas/auth-tree/api-group/update']"
                type="text"
                size="mini"
                @click="showGroupDialog('update',currentAppItem,data)"
              >
                修改模块名称
              </el-button>
              <el-button
                v-permission="['PUT /upas/permission/add']"
                type="text"
                size="mini"
                @click="() => handleAppendNode(data,currentAppItem)"
              >
                添加接口
              </el-button>
              <el-button
                v-if="!(node.data.children&&node.data.children.length)"
                v-permission="['DELETE /upas/auth-tree/api-group/{id}']"
                type="text"
                size="mini"
                style="color:#ffa620"
                @click="() => handleRemoveGroup(data,node)"
              >
                删除模块
              </el-button>
            </span>
            <span v-else>
              <el-button
                v-permission="['POST /upas/permission/update']"
                type="text"
                size="mini"
                style="margin-left:10px;"
                @click="() => handleEditNode(data,node,currentAppItem)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['DELETE /upas/permission/{id}']"
                type="text"
                size="mini"
                style="color:#ff4949"
                @click="() => handleRemoveNode(data,node)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
        <el-button @click="handleResetChecked(currentAppItem.appId)">清空选择</el-button>
        <el-button
          v-permission="['DELETE /upas/permission/{id}']"
          style="margin-top:20px;"
          @click="handleMultiRemoveNode(currentAppItem.appId)"
        >批量删除</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogProjectTitle"
      :visible.sync="dialogProjectVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="projectForm"
        :model="projectForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="应用名称"
          prop="appName"
        >
          <el-input
            v-model.trim="projectForm.appName"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="应用代号"
          prop="appCode"
        >
          <el-input
            v-model.trim="projectForm.appCode"
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogProjectVisible = false">取 消</el-button>
        <el-button
          v-if="dialogProjectStatus==='create'"
          type="primary"
          @click="confirmProjectAdd"
        >确 定</el-button>
        <el-button
          v-else
          type="primary"
          @click="confirmProjectUpdate"
        >更 新</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogGroupTitle"
      :visible.sync="dialogGroupVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="groupForm"
        :model="groupForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="所属应用"
          label-width="100px"
          prop="appName"
        >
          <el-input
            v-model.trim="groupForm.appName"
            readonly
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="模块名称"
          label-width="100px"
          prop="apiGroupName"
        >
          <el-input
            v-model.trim="groupForm.apiGroupName"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogGroupVisible = false">取 消</el-button>
        <el-button
          v-if="dialogGroupStatus === 'create'"
          type="primary"
          @click="confirmApiGroupAdd"
        >确 定</el-button>
        <el-button
          v-else
          type="primary"
          @click="confirmApiGroupUpdate"
        >更 新</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogApiTitle"
      :visible.sync="dialogApiVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="apiForm"
        :model="apiForm"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item
          label="接口所属组"
          prop="apiGroupName"
        >
          <el-input
            v-model.trim="apiForm.apiGroupName"
            readonly
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="接口名称"
          prop="apiName"
        >
          <el-input
            v-model.trim="apiForm.apiName"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="接口地址"
          prop="apiAddress"
        >
          <el-input
            v-model.trim="apiForm.apiAddress"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="接口请求方式"
          prop="apiMethod"
        >
          <el-select
            v-model="apiForm.apiMethod"
            placeholder="请选择"
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogApiVisible = false">取 消</el-button>
        <el-button
          v-if="dialogApiStatus === 'create'"
          type="primary"
          @click="confirmApiAdd"
        >确 定</el-button>
        <el-button
          v-else
          type="primary"
          @click="confirmApiUpdate"
        >更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiProjectList,
  apiCreateProject,
  apiUpdateProject,
  apiDeleteProject,
  apiCreateApiGroup,
  apiUpdateApiGroup,
  apiDeleteApiGroup,
  apiCreateAuthApi,
  apiUpdateAuthApi,
  apiDeleteAuthApi,
  apiMultiDelAuthApi,
  apiSortApiGroup
} from '@/api/auth'
import refreshDataMixin from '@/mixins/refreshDataMixin'
export default {
  name: 'Auth',
  components: {},
  mixins: [refreshDataMixin],
  data() {
    return {
      dialogProjectVisible: false,
      dialogGroupVisible: false,
      dialogApiVisible: false,
      dialogApiStatus: 'create', // create    update
      dialogProjectStatus: 'create', // create    update
      dialogGroupStatus: 'create', // create    update
      projectForm: {
        id: null, // 应用id
        appName: '', // 应用名
        appCode: '' // 应用代号
      },
      groupForm: {
        appId: null,
        apiGroupId: null,
        apiGroupName: '' // api组名
      },
      apiForm: {
        appId: null,
        apiGroupId: null,
        apiGroupName: '',
        apiAddress: '',
        apiMethod: '',
        apiName: '' // api名
      },
      methodOptions: [
        { value: 'GET' },
        { value: 'POST' },
        { value: 'PUT' },
        { value: 'DELETE' },
        { value: 'PATCH' }
      ],
      appList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        appId: {
          required: true,
          message: '请选择接口所属应用',
          trigger: 'change'
        },
        appName: {
          required: true,
          message: '请输入应用名',
          trigger: 'blur'
        },
        appCode: {
          required: true,
          message: '请输入应用代号',
          trigger: 'blur'
        },
        apiGroupId: {
          required: true,
          message: '请选择接口所属分组',
          trigger: 'change'
        },
        apiGroupName: {
          required: true,
          message: '请输入接口分组名',
          trigger: 'change'
        },
        apiName: {
          required: true,
          message: '请输入接口名称',
          trigger: 'blur'
        },
        apiAddress: {
          required: true,
          message: '请输入接口地址',
          trigger: 'blur'
        },
        apiMethod: {
          required: true,
          message: '请选择接口请求方式',
          trigger: 'change'
        }
      },
      currentAppCode: '',
      isPathShow: false
    }
  },
  computed: {
    dialogApiTitle() {
      return this.dialogApiStatus === 'create' ? '添加接口' : '更新接口'
    },
    dialogProjectTitle() {
      return this.dialogProjectStatus === 'create' ? '添加应用' : '更新应用'
    },
    dialogGroupTitle() {
      return this.dialogGroupStatus === 'create' ? '添加模块' : '更新模块'
    },
    currentAppItem() {
      return (
        this.appList.find(item => item.appCode === this.currentAppCode) || {
          appName: '',
          appCode: '',
          apiTree: []
        }
      )
    }
  },
  created() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      this.getAppList()
    },
    allowDrag(draggingNode) {
      return !draggingNode.data.apiAddress
    },
    allowDrop(draggingNode, dropNode, type) {
      return !dropNode.data.apiAddress && type !== 'inner'
    },
    async confirmProjectAdd() {
      const isValid = await this.$commonFunc.formValidate(
        this.$refs.projectForm
      )
      if (!isValid) {
        return
      }
      try {
        await apiCreateProject(this.projectForm)
        this.dialogProjectVisible = false
        this.$notify.success({
          title: '成功',
          message: '添加应用成功'
        })
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async confirmProjectUpdate() {
      const isValid = await this.$commonFunc.formValidate(
        this.$refs.projectForm
      )
      if (!isValid) {
        return
      }
      try {
        const data = {
          id: this.projectForm.appId,
          appCode: this.projectForm.appCode,
          appName: this.projectForm.appName
        }
        await apiUpdateProject(data)
        this.dialogProjectVisible = false
        this.$cookies.set('__AUTH_TAB__', '')
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async confirmApiGroupAdd() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.groupForm)
      if (!isValid) {
        return
      }
      try {
        await apiCreateApiGroup(this.groupForm)
        this.$notify.success({
          title: '成功',
          message: '添加模块成功'
        })
        this.dialogGroupVisible = false
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async confirmApiGroupUpdate() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.groupForm)
      if (!isValid) {
        return
      }
      try {
        const { apiGroupId: id, appId, apiGroupName } = this.groupForm
        await apiUpdateApiGroup({ id, appId, apiGroupName })
        this.$notify.success({
          title: '成功',
          message: '修改模块成功'
        })
        this.dialogGroupVisible = false
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async confirmApiAdd() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.apiForm)
      if (!isValid) {
        return
      }
      try {
        const data = {
          appId: this.apiForm.appId,
          apiGroupId: this.apiForm.apiGroupId,
          label: this.apiForm.apiName,
          way: this.apiForm.apiMethod,
          path: this.apiForm.apiAddress
        }
        await apiCreateAuthApi(data)
        this.dialogApiVisible = false
        this.$notify.success({
          title: '成功',
          message: '添加成功'
        })
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async confirmApiUpdate() {
      console.log(this.apiForm)
      const isValid = await this.$commonFunc.formValidate(this.$refs.apiForm)
      if (!isValid) {
        return
      }
      try {
        const data = {
          appId: this.apiForm.appId,
          apiGroupId: this.apiForm.apiGroupId,
          id: this.apiForm.apiId,
          label: this.apiForm.apiName,
          way: this.apiForm.apiMethod,
          path: this.apiForm.apiAddress
        }
        await apiUpdateAuthApi(data)
        this.dialogApiVisible = false
        this.$notify.success({
          title: '成功',
          message: '更新成功'
        })
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    async getAppList() {
      try {
        const {
          data: { entity = [] }
        } = await apiProjectList()
        const proList = []
        entity.forEach(project => {
          const apiTree = []
          const { id, appCode, appName, apiGroupDtoList } = project
          const proItem = { appId: id, appCode, appName, apiTree }
          apiGroupDtoList.forEach(group => {
            const { apiGroupName, id } = group
            const groupItem = { label: apiGroupName, id }
            if (Array.isArray(group.permissionInfoDtoList)) {
              const children = []
              group.permissionInfoDtoList.forEach(apiItem => {
                const { id, label, path, way } = apiItem
                children.push({ id, label, apiAddress: path, apiMethod: way })
              })
              groupItem.children = children
            }
            apiTree.push(groupItem)
          })
          proList.push(proItem)
        })
        this.appList = proList
        console.log('appList', proList)
        this.currentAppCode =
          this.$cookies.get('__AUTH_TAB__') || this.appList[0].appCode
      } catch (error) {
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
    async handleDragEnd(draggingNode, dropNode, dropType, ev, project) {
      if (!dropNode) {
        return
      }
      const groupIds = project.apiTree.map(item => item.id)
      const data = {
        appId: project.appId,
        groupIds
      }
      console.log(data)
      try {
        await apiSortApiGroup(data)
        this.$notify.success({
          title: '成功',
          message: '顺序修改成功'
        })
        this.getAppList()
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    handleAppendNode(data, project) {
      this.resetApiForm()
      this.dialogApiVisible = true
      this.$nextTick(() => {
        this.$refs.apiForm.clearValidate()
      })
      this.dialogApiStatus = 'create'
      this.apiForm.apiGroupName = data.label
      this.apiForm.apiGroupId = data.id
      this.apiForm.appId = project.appId
    },
    handleEditNode(data, node, project) {
      this.dialogApiVisible = true
      this.dialogApiStatus = 'edit'
      const { apiAddress, apiMethod, id: apiId, label: apiName } = data
      const { id: apiGroupId } = node.parent.data
      const { appId } = project
      // console.log(apiAddress, apiMethod, apiId, apiName, apiGroupId, appId)
      this.apiForm = Object.assign(
        {},
        { apiAddress, apiMethod, apiId, apiName, apiGroupId, appId }
      )
      this.apiForm.apiName = data.label
      this.apiForm.apiGroupName = node.parent.data.label
    },
    handleRemoveNode(data, node) {
      this.$confirm(`此操作删除接口【${data.label}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await apiDeleteAuthApi(data.id)
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
            this.getAppList()
          } catch (error) {
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    handleMultiRemoveNode(refId) {
      const keys = []
      const labels = []
      this.$refs[refId].getCheckedNodes().forEach(item => {
        if (!item.apiAddress) {
          return
        }
        keys.push(item.id)
        labels.push(item.label)
      })
      if (!(keys && keys.length)) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个接口'
        })
        return
      }
      const nameStr = labels.join(',')
      this.$confirm(`此操作将批量删除接口【${nameStr}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.isNetBlocking = true
          try {
            await apiMultiDelAuthApi({ appId: refId, permissionIdes: keys })
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getAppList()
            this.isNetBlocking = false
          } catch (error) {
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    handleResetChecked(refId) {
      this.$refs[refId].setCheckedKeys([])
    },
    handleRemoveGroup(data, node) {
      this.$confirm(`此操作删除模块【${data.label}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await apiDeleteApiGroup(data.id)
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
            this.getAppList()
          } catch (error) {
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    handleDeleteProject(project) {
      this.$confirm(`此操作删除应用【${project.appName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await apiDeleteProject(project.appId)
            this.$notify.success({
              title: '成功',
              message: '删除应用成功'
            })
            this.$cookies.set('__AUTH_TAB__', '')
            this.getAppList()
          } catch (error) {
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    showProjectDialog(status, item) {
      this.dialogProjectVisible = true
      this.dialogProjectStatus = status
      if (status === 'update') {
        this.projectForm = Object.assign({}, item)
      } else {
        this.resetProjectForm()
      }
    },
    showGroupDialog(status, project, data) {
      if (status === 'update') {
        this.groupForm.apiGroupName = data.label
        this.groupForm.apiGroupId = data.id
      } else {
        this.resetGroupForm()
      }
      this.dialogGroupStatus = status
      this.groupForm.appName = project.appName
      this.groupForm.appId = project.appId
      this.dialogGroupVisible = true
      this.$nextTick(() => {
        this.$refs.groupForm.clearValidate()
      })
    },
    toggleTab(e) {
      this.$cookies.set('__AUTH_TAB__', this.currentAppCode)
    },
    resetProjectForm() {
      this.projectForm = {
        id: null, // 应用id
        appName: '', // 应用名
        appCode: '' // 应用代号
      }
    },
    resetApiForm() {
      this.apiForm = {
        appId: null,
        apiGroupId: null,
        apiGroupName: '',
        apiAddress: '',
        apiMethod: '',
        apiName: '' // api名
      }
    },
    resetGroupForm() {
      this.groupForm = {
        appId: null,
        apiGroupId: null,
        apiGroupName: '' // api组名
      }
    }
  }
}
</script>
<style lang='scss' scoped>
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
.page-container {
  .btn-head-wrap {
    margin-bottom: 20px;
    .btn-project-add {
      margin-right: 40px;
    }
  }
  .btn-api-group-add {
    margin-top: 20px;
    margin-bottom: 20px;
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
