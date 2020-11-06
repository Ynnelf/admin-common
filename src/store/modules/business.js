import { apiDictionary } from '@/api'

const state = {
  releaseOptions: [],
  pushOptions: [],
  refreshArticleList: false,
  refreshNewsList: false,
  refreshVideoList: false,
  refreshVlogList: false,
  refreshVersionList: false
}
const mutations = {
  SET_RELEASE_OPTIONS: (state, list) => {
    state.releaseOptions = list
  },
  SET_PUSH_OPTIONS: (state, list) => {
    state.pushOptions = list
  },
  SET_REFRESH_ARTICLE_LIST: (state, isRefresh) => {
    state.refreshArticleList = isRefresh
  },
  SET_REFRESH_NEWS_LIST: (state, isRefresh) => {
    state.refreshNewsList = isRefresh
  },
  SET_REFRESH_VIDEO_LIST: (state, isRefresh) => {
    state.refreshVideoList = isRefresh
  },
  SET_REFRESH_VLOG_LIST: (state, isRefresh) => {
    state.refreshVlogList = isRefresh
  },
  SET_REFRESH_VERSION_LIST: (state, isRefresh) => {
    state.refreshVersionList = isRefresh
  }
}
const actions = {
  async actionDictionary({ commit }) {
    try {
      const { data } = await apiDictionary()
      console.log(data)
    } catch (error) {
      this.$commonFunc.alertError(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
