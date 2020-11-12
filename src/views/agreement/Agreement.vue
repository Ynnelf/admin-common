<template>
  <div class="page-container">
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
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-width="80px"
    >
      <el-form-item label="协议类型">
        <el-select
          v-model="currentType"
          placeholder="请选择协议类型"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in protocolOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="协议版本"
        prop="protocolVersion"
      >
        <el-input
          v-model.trim="dataForm.protocolVersion"
          placeholder="请输入版本号"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="协议标题"
        prop="protocolTitle"
      >
        <el-input
          v-model.trim="dataForm.protocolTitle"
          placeholder="请输入标题"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="协议内容"
        prop="protocolContent"
      >
        <tinymce
          v-model="dataForm.protocolContent"
          :height="600"
          :renew-flag="renewFlag"
        />
      </el-form-item>

    </el-form>

    <div class="btns-wrap">
      <el-button
        v-permission="['POST /information/protocol/admin/save']"
        :loading="isNetBlocking"
        type="primary"
        icon="el-icon-folder-add"
        @click="onUpdateData"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { apiProtocolInfo, apiSaveProtocol } from '@/api'
import { apiAppAuthTrees } from '@/api/auth'
import refreshDataMixin from '@/mixins/refreshDataMixin'
export default {
  name: 'AgreementEdit',
  components: { Tinymce },
  mixins: [refreshDataMixin],
  data() {
    return {
      rules: {
        protocolContent: [
          {
            required: true,
            message: '请输入协议内容',
            trigger: 'blur'
          }
        ],
        protocolTitle: [
          {
            required: true,
            message: '请输入协议标题',
            trigger: 'blur'
          }
        ]
      },
      dataForm: {
        id: null,
        appCode: '',
        protocolCode: '',
        protocolContent: '',
        protocolTitle: '',
        protocolVersion: ''
      },
      protocolOptions: [
        { label: '隐私协议', value: 0 },
        { label: '用户注册协议', value: 1 },
        { label: '获取手机号协议', value: 2 }
      ],
      currentType: 0, // 协议类型 0：隐私协议 1：用户注册协议 2：获取手机号协议
      renewFlag: 0,
      isNetBlocking: false,
      currentAppCode: '',
      appList: ''
    }
  },
  created() {
    this.refreshData()
  },
  methods: {
    async refreshData() {
      this.currentAppCode = this.$cookies.get('__PROTOCOL_EDIT_TAB__') || ''
      if (this.currentAppCode) {
        this.getAppList()
      } else {
        await this.getAppList()
      }
      this.getProtocolInfo()
    },
    refreshRichTextEditor() {
      this.renewFlag++
    },
    async getProtocolInfo() {
      this.isNetBlocking = true
      try {
        const {
          data: { entity = {} }
        } = await apiProtocolInfo({
          protocolType: this.currentType,
          selectedAppCode: this.currentAppCode
        })
        const {
          id = null,
          protocolCode = this.currentType,
          protocolContent = '',
          protocolTitle = '',
          protocolVersion = ''
        } = entity
        this.dataForm = {
          id,
          protocolCode,
          protocolContent,
          protocolTitle,
          protocolVersion
        }
        this.isNetBlocking = false
        this.refreshRichTextEditor()
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    async onUpdateData() {
      const valid = await this.$commonFunc.formValidate(this.$refs.dataForm)
      if (!valid) {
        return
      }
      try {
        this.dataForm.appCode = this.currentAppCode
        await apiSaveProtocol(this.dataForm)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    },
    onSelectChange(val) {
      this.getProtocolInfo()
      // if (val === 1) {
      //   this.$set(this.dataForm, 'protocolContent', '床前明月光，疑是地上霜')
      //   this.refreshRichTextEditor()
      // } else if (val === 2) {
      //   this.$set(
      //     this.dataForm,
      //     'protocolContent',
      //     '葡萄美酒月光，欲饮琵琶马上催'
      //   )
      //   this.refreshRichTextEditor()
      // } else {
      //   this.$set(
      //     this.dataForm,
      //     'protocolContent',
      //     '我寄愁心与明月，随风直到夜郎西'
      //   )
      //   this.refreshRichTextEditor()
      // }
    },
    async getAppList() {
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
          this.$cookies.get('__PROTOCOL_EDIT_TAB__') || this.appList[0].appCode
        return appList
      } catch (error) {
        this.$commonFunc.alertError(error)
        return Promise.reject(error)
      }
    },
    toggleTab(e) {
      this.$cookies.set('__PROTOCOL_EDIT_TAB__', this.currentAppCode)
      this.$refs.dataForm.clearValidate()
      this.getProtocolInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
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
  .editor-protocolContent {
    margin-top: 20px;
  }
  /deep/ .el-input {
    width: 400px;
  }
  .btns-wrap {
    padding: 40px 20px;
    text-align: center;
    .el-button {
      width: 180px;
      height: 40px;
    }
  }
}
</style>

