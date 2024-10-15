import api from '@/store/api';
import router from '@/router';
import statsContainer from '@/store/statscontainer';
import { Notify } from 'quasar';
import store from './store';

// TODO consider placeholders
const state = {
  updated: 0,
};

const getters = {};

const mutations = {
  SET_STATS(state, { stats }) {
    // We store all stats in container: there is no need to make all stats observable,
    // size of stats can be quite big and they can be updated frequently
    // In Vuex we store the timestamp of last stats update, so views can watch on it and react
    statsContainer.updateStats(stats);
    document.title = stats.name || 'swagger-stats';
    state.updated = Date.now();
  },
};

const actions = {
  async getStats({ commit }, { fields = null, method = null, path = null, username = null, password = null, swssingle = null }) {
    let stats = null;
    let headers = null;
    if (store.state.sessionId) {
      headers = {
        'sws-session-id': store.state.sessionId,
      };
    }
    let getStatsRes = await api.getStats({ fields: fields, method: method, path: path, username: username, password: password, swssingle: swssingle, headers: headers });
    if (getStatsRes.success) {
      if (getStatsRes.headers && 'sws-session-id' in getStatsRes.headers && getStatsRes.headers['sws-session-id']) {
        store.commit('SET_SESSION_ID', { sessionId: getStatsRes.headers['sws-session-id'] });
      }
      stats = getStatsRes.payload;
      commit('SET_STATS', { stats: stats });
    } else {
      commit('SET_STATS', { stats: {} });
      Notify.create({
        position: 'top',
        type: 'negative',
        message: 'API ERROR',
        caption: `${getStatsRes.message} (${getStatsRes.code})`,
      });
      if (getStatsRes.code === 403) {
        router.push('/login');
      }
    }
    return getStatsRes;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
