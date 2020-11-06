<template>
  <div class="dashboard-container">
    <el-row
      :gutter="40"
      class="panel-group"
    >
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <el-card>
          <p>
            <svg-icon
              icon-class="album"
              class-name="card-panel-icon"
            />
          </p>
          <el-button
            type="primary"
            plain
          >资讯后台</el-button>
        </el-card>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <el-card>
          <p>
            <svg-icon
              icon-class="users"
              class-name="card-panel-icon"
            />
          </p>
          <el-button
            type="primary"
            plain
          >CRM后台</el-button>
        </el-card>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <el-card>
          <p>
            <svg-icon
              icon-class="money"
              class-name="card-panel-icon"
            />
          </p>
          <el-button
            type="primary"
            plain
          >交易后台</el-button>
        </el-card>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <el-card>
          <p>
            <svg-icon
              icon-class="trend"
              class-name="card-panel-icon"
            />
          </p>
          <el-button
            type="primary"
            plain
          >行情后台</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userTotal: 0,
      goodsTotal: 0,
      productTotal: 0,
      orderTotal: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getData() {
      setTimeout(() => {
        this.userTotal = 200
        this.goodsTotal = 300
        this.productTotal = 400
        this.orderTotal = 500
      }, 500)
    },
    toPageArticlePublish() {
      this.$router.push('/article/ArticlePublish')
    },
    toPageNewsPublish() {
      this.$router.push('/news/NewsPublish')
    },
    toPageVideoPublish() {
      this.$router.push('/video/VideoPublish')
    },
    toPageVlogPublish() {
      this.$router.push('/video/VlogPublish')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  /deep/.el-row {
    text-align: center;
    .svg-icon {
      color: #409eff;
      font-size: 90px;
    }
  }
}
</style>
