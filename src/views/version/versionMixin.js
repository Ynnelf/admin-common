import { uploadPathAppFile } from '@/api/storage'
import { apiSaveVersion, apiUploadVersion } from '@/api'
import { apiProjectList } from '@/api/auth'

export default {
  data() {
    return {
      uploadPathAppFile,
      rules: {
        appCode: [
          {
            required: true,
            message: '请选择应用',
            trigger: 'change'
          }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入更新描述',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择版本状态',
            trigger: 'change'
          }
        ],
        terminal: [
          {
            required: true,
            message: '请选择设备平台',
            trigger: 'change'
          }
        ]
      },
      dataForm: {
        id: null,
        remark: '',
        version: '',
        type: '',
        terminal: '',
        appUrl: '',
        state: 1
      },
      appOptions: [],
      updateOptions: [
        {
          label: '提示升级',
          value: 0
        },
        {
          label: '强制更新',
          value: 1
        }
      ],
      deviceOptions: [
        {
          label: '安卓',
          value: 'ANDROID'
        },
        {
          label: '苹果',
          value: 'IOS'
        }
      ],
      currentType: 0,
      renewFlag: 0,
      isNetBlocking: false,
      isUploading: false,
      fileList: [],
      filename: ''
    }
  },
  created() {
    this.refreshData()
    this.initAppOptions()
  },
  activated() {},
  deactivated() {},
  methods: {
    async initAppOptions() {
      const {
        data: { entity = [] }
      } = await apiProjectList()
      console.log(entity, 202066)
      const appList = entity || []
      const options = []
      appList.forEach(item => {
        options.push({ label: item.appName, value: item.appCode })
      })
      this.appOptions = options
    },
    // beforeFileUpload(file) {
    //   console.log(file.type)
    //   this.isUploading = true
    // },
    // handleFileSuccess(response) {
    //   const { entity = {} } = response
    //   this.$set(this.dataForm, 'appUrl', entity && entity.url)
    //   this.isUploading = false
    // },
    // handleFileError() {
    //   this.isUploading = false
    // },
    beforeAppUpload(file) {
      if (!this.dataForm.appCode) {
        this.$message({
          message: '请先选择所属应用',
          type: 'warning'
        })
        return false
      }
      return true
    },
    async handleAppUpload(request) {
      const fd = new FormData()
      fd.append('file', request.file)
      const params = { appCode: this.dataForm.appCode }
      this.isUploading = true
      try {
        const {
          data: { entity = {} }
        } = await apiUploadVersion(fd, params)
        console.log(entity, 8888888888)
        this.$set(this.dataForm, 'appUrl', entity.url)
        this.filename = entity.fileName // 注意 接口返回的fileName  N 是大写的
        this.isUploading = false
      } catch (error) {
        this.isUploading = false
        this.$commonFunc.alertError(error)
      }
    },
    handleFileExceed(files, fileList) {
      this.$message.error('只能上传一个文件包，请打包并压缩后上传！')
    },
    handleDeleteFile() {
      this.$set(this.dataForm, 'appUrl', '')
      this.fileList = []
    },
    async onSaveData() {
      const valid = await this.$commonFunc.formValidate(this.$refs.dataForm)
      if (!valid) {
        return
      }
      try {
        this.isNetBlocking = true
        await apiSaveVersion(this.dataForm)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.refreshData()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.updateVersionList()
        this.isNetBlocking = false
      } catch (error) {
        this.isNetBlocking = false
        this.$commonFunc.alertError(error)
      }
    },
    updateVersionList() {
      this.$store.commit('business/SET_REFRESH_VERSION_LIST', true)
    },
    resetForm() {
      this.dataForm = {
        id: null,
        remark: '',
        version: '',
        type: '',
        terminal: '',
        appUrl: '',
        state: 1
      }
    }
  }
}
