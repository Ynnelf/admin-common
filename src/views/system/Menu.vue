<template>
  <div class="menu-container">
    <div class="clearfix">
      <el-button
        type="primary fr"
        @click="showAppDialog('create')"
      >添加项目</el-button>
    </div>

    <el-tabs
      v-model="currentAppCode"
      type="card"
      @tab-click="toggleTab"
    >
      <el-tab-pane
        v-for="item in appList"
        :key="item.appId"
        :label="item.appName"
        :name="item.appCode"
      />
    </el-tabs>
    <div class="app-info-container">
      <el-tag>{{ currentAppItem.appName }} / {{ currentAppItem.appCode }}</el-tag>
      <el-button
        style="color:#999;margin-left:12px;"
        type="text"
        @click="showAppDialog('update',currentAppItem)"
      >修改应用名称</el-button>
      <el-button
        v-if="currentAppItem.treeList && currentAppItem.treeList.length === 0"
        style="color:#ff4949;margin-left:12px;"
        type="text"
        @click="deleteApp(currentAppItem)"
      >删除应用</el-button>
      <el-switch
        v-model="isDetailShow"
        style="margin-left:40px;"
        active-color="#42b983"
        inactive-color="#ccc"
      />
    </div>
    <el-button
      size="small"
      style="margin-bottom:20px;"
      @click="hanldeCreateMenu"
    >添加菜单</el-button>
    <el-tree
      :ref="currentAppItem.appId"
      :data="currentAppTree"
      :expand-on-click-node="false"
      :props="defaultProps"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      :default-checked-keys="defaultCheckedKeys"
      show-checkbox
      node-key="id"
      default-expand-all
      draggable
      @node-drag-end="onDragEnd"
    >
      <span
        slot-scope="{ node, data }"
        class="custom-tree-node"
      >
        <span>{{ data.name }}</span>
        <span v-if="data.type === 2 && isDetailShow">
          <el-tag :type="getLabelType(data.way)">{{ data.way }}</el-tag>
          <el-tag type="warning">{{ data.path }}</el-tag>
        </span>
        <el-tooltip
          v-if="data.type === 2 && !isDetailShow"
          :content="data.way +':' + data.path"
          class="item"
          effect="dark"
          placement="top"
        >
          <i class="el-icon-info" />
        </el-tooltip>
        <el-tooltip
          v-if="data.type === 1 && !isDetailShow"
          :content="data.path"
          class="item"
          effect="dark"
          placement="top"
        >
          <svg-icon icon-class="list" />
        </el-tooltip>
        <el-tag v-if="data.type === 1 && isDetailShow">
          {{ data.path }}
        </el-tag>
        <span>
          <el-button
            v-if="data.type === 1"
            type="text"
            size="mini"
            @click="() => handleAppend(node,data)"
          >
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleUpdate(node,data)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleRemove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-button
      style="margin-top:20px;"
      @click="handleMultiRemoveNode(currentAppItem.appId)"
    >批量删除</el-button>
    <el-dialog
      :title="dialogAppTitle"
      :visible.sync="dialogAppVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="appForm"
        :model="appForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="应用名称"
          prop="appName"
        >
          <el-input
            v-model.trim="appForm.appName"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="应用代号"
          prop="appCode"
        >
          <el-input
            v-model.trim="appForm.appCode"
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAppVisible = false">取 消</el-button>
        <el-button
          v-if="dialogAppStatus==='create'"
          :loading="isNetBlocking"
          type="primary"
          @click="createApp"
        >确 定</el-button>
        <el-button
          v-else
          :loading="isNetBlocking"
          type="primary"
          @click="updateApp"
        >更 新</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="mainForm"
        :model="mainForm"
        :label-width="formLabelWidth"
        :rules="rules"
      >
        <el-form-item
          label="节点类型"
          prop="type"
        >
          <el-radio
            v-model="mainForm.type"
            :disabled="typeRadioDisabled"
            :label="2"
          >接口</el-radio>
          <el-radio
            v-model="mainForm.type"
            :label="1"
          >菜单</el-radio>
        </el-form-item>
        <el-form-item
          :label="nameLabel"
          prop="name"
        >
          <el-input
            v-model.trim="mainForm.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="mainForm.type === 2"
          label="接口请求方式"
          prop="way"
        >
          <el-select
            v-model="mainForm.way"
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
        <el-form-item
          v-if="mainForm.type === 1"
          label="页面地址"
          prop="path"
        >
          <el-input
            v-model.trim="mainForm.path"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="mainForm.type === 2"
          label="接口地址"
          prop="path"
        >
          <el-input
            v-model.trim="mainForm.path"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <span v-if="dialogStatus === 'create'">
          <el-button
            :loading="isNetBlocking"
            type="primary"
            @click="onCreateData"
          >确 定</el-button>
        </span>
        <span v-else>
          <el-button
            :loading="isNetBlocking"
            type="primary"
            @click="onUpdateData"
          >更 新</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiAppAuthTrees,
  apiCreateMenuOrApi,
  apiDeleteMenuOrApi,
  apiUpdateMenuOrApi,
  apiCreateProject,
  apiUpdateProject,
  apiDeleteProject,
  apiSortMenu
} from '@/api/auth'
import { deepClone } from '@/utils'
export default {
  name: 'Menu',
  components: {},
  data() {
    return {
      appList: [],
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogStatus: 'create', // create  update
      type: 'menu',
      mainForm: {
        appId: '',
        name: '',
        type: '',
        parentId: '',
        rank: '',
        path: '',
        way: ''
      },
      methodOptions: [
        { value: 'GET' },
        { value: 'POST' },
        { value: 'PUT' },
        { value: 'DELETE' },
        { value: 'PATCH' }
      ],
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
        type: {
          required: true,
          message: '请选择节点类型',
          trigger: 'change'
        },
        name: {
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        path: {
          required: true,
          message: '请输入接口地址',
          trigger: 'blur'
        },
        way: {
          required: true,
          message: '请选择接口请求方式',
          trigger: 'change'
        }
      },
      currentData: {},
      currentAppCode: '',
      isDetailShow: true,
      defaultCheckedKeys: [],
      dialogAppVisible: false,
      dialogAppStatus: '', // create  update
      appForm: {
        id: null, // 应用id
        appName: '', // 应用名
        appCode: '' // 应用代号
      },
      typeRadioDisabled: false,
      isNetBlocking: false
    }
  },
  computed: {
    dialogAppTitle() {
      return this.dialogAppStatus === 'create' ? '添加应用' : '更新应用'
    },
    dialogTitle() {
      const prefixMap = {
        create: '新建',
        update: '修改'
      }
      const nameMap = {
        api: '接口',
        menu: '菜单'
      }
      return (
        prefixMap[this.dialogStatus] + (nameMap[this.mainForm.type] || '节点')
      )
    },
    nameLabel() {
      const nodeMap = {
        api: '接口名称',
        menu: '菜单名称'
      }
      return nodeMap[this.mainForm.type] || '节点名称'
    },
    currentAppItem() {
      const target = this.appList.find(
        app => app.appCode === this.currentAppCode
      )
      return target || {}
    },
    currentAppTree() {
      const target = this.appList.find(
        app => app.appCode === this.currentAppCode
      )
      return (target && target.treeList) || []
    }
  },
  created() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      this.getAppTrees()
    },
    allowDrag(draggingNode) {
      // return !draggingNode.data.type === 2
      return true
    },
    allowDrop(draggingNode, dropNode, type) {
      // return !dropNode.data.type === 2 && type !== 'inner'
      return true
    },
    async createApp() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.appForm)
      if (!isValid) {
        return
      }
      try {
        this.isNetBlocking = true
        await apiCreateProject(this.appForm)
        this.dialogAppVisible = false
        this.$notify.success({
          title: '成功',
          message: '添加应用成功'
        })
        this.isNetBlocking = false
        this.refreshData()
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    deleteApp(project) {
      this.$confirm(`此操作删除应用【${project.appName}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            this.isNetBlocking = true
            await apiDeleteProject(project.appId)
            this.$notify.success({
              title: '成功',
              message: '删除应用成功'
            })
            this.isNetBlocking = false
            this.$cookies.set('__MENU_EDIT_TAB__', '')
            this.refreshData()
          } catch (error) {
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    async updateApp() {
      console.log('update-app')
      const isValid = await this.$commonFunc.formValidate(this.$refs.appForm)
      if (!isValid) {
        return
      }
      try {
        const data = {
          id: this.appForm.appId,
          appCode: this.appForm.appCode,
          appName: this.appForm.appName
        }
        console.log('update-app-data', data)
        this.isNetBlocking = true
        await apiUpdateProject(data)
        this.dialogAppVisible = false
        this.isNetBlocking = false
        this.$cookies.set('__MENU_EDIT_TAB__', '')
        this.refreshData()
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    async getAppTrees() {
      try {
        const {
          data: { entity = [] }
        } = await apiAppAuthTrees()
        const appItems = entity || []
        const appList = []
        appItems.forEach(singleApp => {
          appList.push({
            appId: singleApp.id,
            appCode: singleApp.appCode,
            appName: singleApp.appName,
            treeList: singleApp.menuInfoDtos
          })
        })
        this.appList = appList
        console.log('this.appList ', this.appList)
        this.currentAppCode =
          this.$cookies.get('__MENU_EDIT_TAB__') || this.appList[0].appCode
      } catch (error) {
        this.$commonFunc.alertError()
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
    getCurrentAppId() {
      const target = this.appList.find(
        item => item.appCode === this.currentAppCode
      )
      return (target && target.appId) || null
    },
    handleAppend(node, data) {
      this.resetMainForm()
      this.typeRadioDisabled = false
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.currentData = data
      console.log('data', data)
      console.log('node', node)
    },
    handleUpdate(node, data) {
      this.resetMainForm()
      this.mainForm = Object.assign({}, data)
      this.typeRadioDisabled = false
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.currentData = data
    },
    async handleRemove(node, data) {
      console.log(node, data)
      if (data.children && data.children.length) {
        this.$message.error('当前节点含有子节点，不可删除')
        return
      }
      this.$confirm(`此操作删除节点【${data.name}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const query = {
              appId: data.appId,
              menuIdes: [data.id]
            }
            await apiDeleteMenuOrApi(query)
            this.refreshData()
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
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
        keys.push(item.id)
        labels.push(item.name)
      })
      if (!(keys && keys.length)) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个菜单或接口'
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
            await apiDeleteMenuOrApi({ appId: refId, menuIdes: keys })
            this.$notify.success({
              title: '成功',
              message: '删除成功'
            })
            this.refreshData()
            this.isNetBlocking = false
          } catch (error) {
            this.isNetBlocking = false
            this.$commonFunc.alertError(error)
          }
        })
        .catch(() => {})
    },
    hanldeCreateMenu() {
      this.resetMainForm()
      this.mainForm.type = 1
      this.dialogFormVisible = true
      this.typeRadioDisabled = true
      this.currentData = {
        children: this.currentAppTree
      }
    },
    async onDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('draggingNode', draggingNode)
      console.log('dropNode', dropNode)
      console.log('dropType', dropType)
      console.log('ev', ev)
      const app = this.appList.find(app => app.appCode === this.currentAppCode)
      const data = deepClone(app)
      data.id = data.appId
      data.menuInfoDtos = data.treeList
      delete data.appId
      delete data.treeList
      console.log(app, 2020)
      try {
        await apiSortMenu(data)
        this.$notify({
          title: '成功',
          type: 'success',
          message: '排序成功'
        })
        this.refreshData()
      } catch (error) {
        this.$commonFunca.alertError(error)
      }
    },
    async onCreateData() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.mainForm)
      if (!isValid) {
        return
      }
      console.log(this.mainForm)
      const appId = this.getCurrentAppId()
      let rank = 1
      try {
        rank =
          this.currentData.children[this.currentData.children.length - 1].rank +
          1
      } catch (error) {
        rank = 1
      }
      const query = Object.assign({}, this.mainForm, {
        appId,
        parentId: this.currentData.id,
        rank
      })
      try {
        this.isNetBlocking = true
        await apiCreateMenuOrApi(query)
        this.refreshData()
        this.dialogFormVisible = false
        this.isNetBlocking = false
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    async onUpdateData() {
      const isValid = await this.$commonFunc.formValidate(this.$refs.mainForm)
      if (!isValid) {
        return
      }
      const data = Object.assign({}, this.mainForm)
      try {
        this.isNetBlocking = true
        await apiUpdateMenuOrApi(data)
        this.refreshData()
        this.dialogFormVisible = false
        this.isNetBlocking = false
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    showAppDialog(status, item) {
      this.dialogAppVisible = true
      this.dialogAppStatus = status
      if (status === 'update') {
        this.appForm = Object.assign({}, item)
      } else {
        this.resetAppForm()
      }
    },
    resetAppForm() {
      this.appForm = {
        id: null, // 应用id
        appName: '', // 应用名
        appCode: '' // 应用代号
      }
    },
    resetMainForm() {
      this.mainForm = {
        appId: '',
        name: '',
        type: '',
        parentId: '',
        rank: '',
        path: '',
        way: ''
      }
    },
    toggleTab(e) {
      this.$cookies.set('__MENU_EDIT_TAB__', this.currentAppCode)
      console.log(this.currentAppTree)
    }
  }
}
</script>
<style lang='scss' scoped>
.menu-container {
  padding-bottom: 120px;
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
  .app-info-container {
    margin-bottom: 30px;
  }
  /deep/.el-tree {
    .el-tree-node {
      margin-top: 10px;
    }
  }
}
</style>
