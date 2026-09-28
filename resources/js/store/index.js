import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    comments: [],
    currentPage: 1,
    itemsPerPage: 3,
    sortBy: 'id',
    sortDirection: 'asc',
    loading: false,
    error: null
  },

  getters: {
    sortedComments(state) {
      const comments = [...state.comments];
      
      return comments.sort((a, b) => {
        let aVal, bVal;
        
        if (state.sortBy === 'id') {
          aVal = a.id;
          bVal = b.id;
        } else if (state.sortBy === 'date') {
          aVal = new Date(a.date);
          bVal = new Date(b.date);
        }
        
        if (state.sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    },

    paginatedComments(state, getters) {
      const sorted = getters.sortedComments;
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return sorted.slice(start, end);
    },

    totalPages(state, getters) {
      return Math.ceil(getters.sortedComments.length / state.itemsPerPage);
    }
  },

  mutations: {
    SET_COMMENTS(state, comments) {
      state.comments = comments;
    },

    ADD_COMMENT(state, comment) {
      state.comments.push(comment);
    },

    UPDATE_COMMENT(state, updatedComment) {
      const index = state.comments.findIndex(c => c.id === updatedComment.id);
      if (index !== -1) {
        Vue.set(state.comments, index, updatedComment);
      }
    },

    DELETE_COMMENT(state, commentId) {
      state.comments = state.comments.filter(c => c.id !== commentId);
    },

    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },

    SET_SORT(state, { sortBy, sortDirection }) {
      state.sortBy = sortBy;
      state.sortDirection = sortDirection;
    },

    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchComments({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await axios.get('/api/comments');
        commit('SET_COMMENTS', response.data);
      } catch (error) {
        commit('SET_ERROR', 'Ошибка загрузки комментариев');
        console.error('Error fetching comments:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createComment({ commit, dispatch }, commentData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await axios.post('/api/comments', commentData);
        commit('ADD_COMMENT', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', 'Ошибка создания комментария');
        console.error('Error creating comment:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateComment({ commit }, { id, commentData }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await axios.patch(`/api/comments/${id}`, commentData);
        commit('UPDATE_COMMENT', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', 'Ошибка обновления комментария');
        console.error('Error updating comment:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteComment({ commit, state, getters }, commentId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        await axios.delete(`/api/comments/${commentId}`);
        commit('DELETE_COMMENT', commentId);
        
        if (state.currentPage > getters.totalPages && state.currentPage > 1) {
          commit('SET_CURRENT_PAGE', state.currentPage - 1);
        }
      } catch (error) {
        commit('SET_ERROR', 'Ошибка удаления комментария');
        console.error('Error deleting comment:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    setPage({ commit }, page) {
      commit('SET_CURRENT_PAGE', page);
    },

    setSort({ commit, state }, sortBy) {
      let sortDirection = 'asc';
      
      if (state.sortBy === sortBy) {
        sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      }
      
      commit('SET_SORT', { sortBy, sortDirection });
    }
  }
});
