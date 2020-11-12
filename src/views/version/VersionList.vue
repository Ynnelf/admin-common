<template>
  <div class="page-container">

    <div class="head-btn-wrap clearfix">
      <el-button
        :loading="listLoading"
        class="fr"
        icon="el-icon-plus"
        type="primary"
        @click="handleCreate"
      >添加版本</el-button>
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
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition.version"
        clearable
        class="filter-item"
        placeholder="请输入版本号"
      />
      <el-select
        v-model="listQuery.condition.terminalType"
        placeholder="请选择设备"
        class="filter-item"
        @change="getMainList"
      >
        <el-option
          v-for="item in deviceTypeOptions"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.condition.type"
        placeholder="更新等级"
        class="filter-item"
        @change="getMainList"
      >
        <el-option
          v-for="item in updateOptions"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.condition.updatedTimeStart"
        :picker-options="pickerOptions"
        type="datetime"
        value-format="yyyy-MM-dd H:mm:ss"
        placeholder="更新时间—开始"
        class="filter-item"
        align="right"
      />
      <span class="filter-line">—</span>
      <el-date-picker
        v-model="listQuery.condition.updatedTimeEnd"
        :picker-options="pickerOptions"
        type="datetime"
        value-format="yyyy-MM-dd H:mm:ss"
        placeholder="更新时间—截止"
        class="filter-item"
        align="right"
      />
      <el-button
        :loading="listLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="mainList"
      element-loading-text="正在查询中。。。"
      class="main-table"
      border
      fit
      highlight-current-row
    >

      <el-table-column
        align="center"
        label="版本号"
        prop="version"
        sortable
      />

      <el-table-column
        align="center"
        label="设备平台"
        prop="terminal"
      />

      <el-table-column
        align="center"
        label="备注"
        prop="remark"
      />

      <el-table-column
        align="center"
        width="240"
        label="文件包"
        prop="appUrl"
      >
        <template slot-scope="{row}">
          <div
            v-if="row.appUrl"
            class="btns-row"
          >
            <el-button
              v-clipboard:copy="row.appUrl"
              v-clipboard:success="onCopySuccess"
              size="small"
            >复制链接</el-button>
            <a :href="row.appUrl">
              <el-button
                size="small"
                type="success"
              >下载</el-button>
            </a>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        prop="createdTime"
        sortable
      />

      <el-table-column
        align="center"
        label="更新时间"
        prop="updatedTime"
        sortable
      />

      <el-table-column
        align="center"
        width="240"
        label="状态"
        prop="type"
      >
        <template slot-scope="{row}">
          <div class="btns-row">
            <el-tag v-if="row.type===0">提示升级</el-tag>
            <el-tag
              v-if="row.type===1"
              type="danger"
            >强制更新</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="240"
        label="操作"
      >
        <template slot-scope="{row}">
          <div class="btns-row">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(row)"
            >编辑</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button> -->
          </div>
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

    <el-tooltip
      placement="top"
      content="返回顶部"
    >
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import refreshDataMixin from '@/mixins/refreshDataMixin'
import { apiVersionList } from '@/api'
import { apiAppAuthTrees } from '@/api/auth'
import { pickerOptions } from '@/utils'

export default {
  name: 'VersionList',
  components: { BackToTop, Pagination },
  mixins: [refreshDataMixin],
  data() {
    return {
      pickerOptions,
      mainList: [],
      total: 20,
      listLoading: false,
      downloadLoading: false,
      isNetBlocking: false,
      listQuery: {
        current: 1,
        limit: 20,
        condition: {
          appCode: '',
          terminalType: '',
          updatedTimeStart: '',
          updatedTimeEnd: '',
          version: '',
          type: ''
        }
      },
      dataForm: {
        name: '',
        avatarUrl: '',
        gender: '',
        signature: ''
      },
      dataFormVisible: false,
      dialogStatus: 'create',
      appList: [],
      currentAppCode: '',
      rules: {
        name: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }
        ],
        avatarUrl: [
          {
            required: true,
            message: '请上传头像',
            trigger: 'change'
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        signature: [
          {
            required: true,
            message: '请输入简介',
            trigger: 'blur'
          }
        ]
      },
      deviceTypeOptions: [
        {
          label: '全部',
          value: null
        },
        {
          label: '安卓',
          value: 1
        },
        {
          label: '苹果',
          value: 2
        }
      ],
      updateOptions: [
        {
          label: '全部',
          value: null
        },
        {
          label: '提示升级',
          value: 0
        },
        {
          label: '强制更新',
          value: 1
        }
      ]
    }
  },
  created() {
    this.refreshData()
  },
  activated() {
    if (this.$store.state.business.refreshVersionList) {
      this.refreshData()
      this.$store.commit('business/SET_REFRESH_VERSION_LIST', false)
    }
  },
  methods: {
    async refreshData() {
      this.resetListQuery()
      this.currentAppCode = this.$cookies.get('__VERSION_EDIT_TAB__') || ''
      if (this.currentAppCode) {
        this.getAppList()
      } else {
        await this.getAppList()
      }
      this.getMainList()
    },
    async getMainList() {
      this.listLoading = true
      this.listQuery.condition.appCode = this.currentAppCode
      try {
        const {
          data: { entity = {} }
        } = await apiVersionList(this.listQuery)
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
    handleCreate() {
      this.$router.push({
        path: '/version/VersionCreate',
        query: {
          timestamp: Date.now()
        }
      })
    },
    handleEdit(row) {
      this.$router.push({
        path: '/version/VersionEdit',
        query: {
          id: row.id,
          timestamp: Date.now()
        }
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getMainList()
    },
    resetListQuery() {
      this.listQuery = {
        current: 1,
        limit: 20,
        condition: {
          terminalType: '',
          updatedTimeStart: '',
          updatedTimeEnd: '',
          version: '',
          type: ''
        }
      }
    },
    onCopySuccess() {
      this.$message.success('已复制')
    },
    toggleTab(e) {
      this.$cookies.set('__VERSION_EDIT_TAB__', this.currentAppCode)
      console.log(this.currentAppCode)
      this.getMainList()
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
          this.$cookies.get('__VERSION_EDIT_TAB__') || this.appList[0].appCode
        return appList
      } catch (error) {
        this.$commonFunc.alertError(error)
        return Promise.reject(error)
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
/deep/.main-table {
  .img-avatar {
    display: inline-block;
    width: 140px;
    height: 140px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .btns-row {
    .el-button {
      margin: 10px 6px;
      width: 70px;
    }
  }
}
.head-btn-wrap {
  margin-bottom: 20px;
}
</style>
