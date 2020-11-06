import { uploadPathAppFile } from '@/api/storage'
import { apiSaveVersion } from '@/api'
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
      fileList: []
    }
  },
  computed: {
    filename() {
      return this.dataForm.appUrl.slice(
        this.dataForm.appUrl.lastIndexOf('/') + 1
      )
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
    beforeFileUpload(file) {
      console.log(file.type)
      this.isUploading = true
    },
    handleFileSuccess(response) {
      const { entity = {} } = response
      this.$set(this.dataForm, 'appUrl', entity && entity.url)
      this.isUploading = false
    },
    handleFileError() {
      this.isUploading = false
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
