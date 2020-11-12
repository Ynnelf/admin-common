<template>
  <div class="page-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-width="80px"
    >
      <el-form-item
        label="应用"
        prop="appCode"
      >
        <el-select
          v-model="dataForm.appCode"
          placeholder="请选择应用"
        >
          <el-option
            v-for="item in appOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="版本号"
        prop="version"
      >
        <el-input
          v-model.trim="dataForm.version"
          placeholder="请输入版本号"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="更新描述"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          :rows="6"
          type="textarea"
          placeholder="请输入描述"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="版本状态"
        prop="type"
      >
        <el-select
          v-model="dataForm.type"
          placeholder="请选择版本状态"
        >
          <el-option
            v-for="item in updateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="设备平台"
        prop="terminal"
      >
        <el-select
          v-model="dataForm.terminal"
          placeholder="请选择设备平台"
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="文件包"
        prop="appUrl"
      >
        <el-upload
          class="upload-app"
          :show-file-list="false"
          :before-upload="beforeAppUpload"
          :http-request="handleAppUpload"
          :disabled="isUploading"
          action=""
        >
          <el-button
            v-if="!dataForm.appUrl"
            :loading="isUploading"
            size="small"
            type="primary"
          >{{ isUploading ? '上传中...':'点击上传' }}</el-button>
          <div
            v-else
            class="file-wrap"
          >
            <i class="el-icon-document file-icon" />
            <span class="file-name">{{ filename }}</span>
          </div>
        </el-upload>
        <span
          v-if="dataForm.appUrl"
          class="btn-file-delete"
          @click="handleDeleteFile"
        >删除文件包</span>
      </el-form-item>

    </el-form>

    <div class="btns-wrap">
      <el-button
        :loading="isNetBlocking || isUploading"
        type="primary"
        icon="el-icon-folder-add"
        @click="onSaveData"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { apiVersionInfo } from '@/api'
import { uploadPathAppFile } from '@/api/storage'
import refreshDataMixin from '@/mixins/refreshDataMixin'
import versionMixin from './versionMixin'
export default {
  name: 'VersionEdit',
  mixins: [refreshDataMixin, versionMixin],
  data() {
    return {
      uploadPathAppFile,
      currentType: 0,
      renewFlag: 0,
      isNetBlocking: false,
      fileList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    refreshData() {
      this.getMainData()
    },
    async getMainData() {
      try {
        const {
          data: { entity = {} }
        } = await apiVersionInfo({ id: this.id })
        this.dataForm = entity
        console.log(this.dataForm, 2333)
        this.filename = this.dataForm.appUrl.slice(
          this.dataForm.appUrl.lastIndexOf('/') + 1
        )
      } catch (error) {
        this.$commonFunc.alertError(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  .editor-protocolContent {
    margin-top: 20px;
  }
  /deep/ .el-form {
    .el-input,
    .el-textarea {
      width: 500px;
    }
    .upload-app {
      .file-wrap {
        text-align: left;
        .file-icon {
          font-size: 40px;
          line-height: 40px;
          color: #999;
        }
        .file-name {
          font-size: 16px;
          line-height: 40px;
          color: #999;
        }
      }
    }
    .btn-file-update,
    .btn-file-delete {
      display: inline-block;
      color: #999;
      padding: 0px 20px;
      line-height: 34px;
      border: 1px solid #ddd;
      cursor: pointer;
      margin-top: 14px;
    }
    .btn-file-update {
      &:hover {
        color: #1890ff;
        border-color: #badeff;
        background-color: #e8f4ff;
      }
    }
    .btn-file-delete {
      &:hover {
        background-color: #ffeded;
        border-color: #ffdbdb;
        color: #ff4949;
      }
    }
  }
  .btns-wrap {
    padding: 40px 20px;
    .el-button {
      width: 180px;
      height: 40px;
    }
  }
}
</style>

