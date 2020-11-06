<template>
  <div class="page-container">
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
        label="协议内容"
        prop="protocolContent"
      >
        <tinymce
          v-model="dataForm.protocolContent"
          :height="600"
          :renew-flag="renewFlag"
        />
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
      currentType: 0,
      renewFlag: 0,
      isNetBlocking: false
    }
  },
  created() {
    this.refreshData()
  },
  methods: {
    refreshData() {
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
        } = await apiProtocolInfo({ protocolType: this.currentType })
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
      // console.log(val)
      // if (val === 1) {
      //   this.protocolContent = '床前明月光，疑是地上霜'
      //   this.refreshRichTextEditor()
      // } else if (val === 2) {
      //   this.protocolContent = '葡萄美酒月光，欲饮琵琶马上催'
      //   this.refreshRichTextEditor()
      // } else {
      //   this.protocolContent = '我寄愁心与明月，随风直到夜郎西'
      //   this.refreshRichTextEditor()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  .editor-protocolContent {
    margin-top: 20px;
  }
  /deep/ .el-select {
    margin-bottom: 20px;
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

