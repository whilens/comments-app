<template>
  <div class="comments-list">
    <div class="controls">
      <div class="sort-controls">
        <label>Сортировка:</label>
        <button
          @click="changeSort('id')"
          class="sort-btn"
          :class="{ 'active': sortBy === 'id' }"
        >
          ID {{ sortBy === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
        </button>
        <button
          @click="changeSort('date')"
          class="sort-btn"
          :class="{ 'active': sortBy === 'date' }"
        >
          Дата {{ sortBy === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error-box">{{ error }}</div>

    <div v-if="!loading && paginatedComments.length === 0" class="no-comments">
      Комментариев пока нет
    </div>

    <div v-if="!loading && paginatedComments.length > 0" class="comments">
      <comment-item
        v-for="comment in paginatedComments"
        :key="comment.id"
        :comment="comment"
        @edit="editComment"
        @delete="deleteComment"
      />
    </div>

    <pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="changePage"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CommentItem from './CommentItem.vue';
import Pagination from './Pagination.vue';

export default {
  name: 'CommentsList',
  components: {
    CommentItem,
    Pagination
  },
  computed: {
    ...mapState(['currentPage', 'sortBy', 'sortDirection', 'loading', 'error']),
    ...mapGetters(['paginatedComments', 'totalPages'])
  },
  methods: {
    changePage(page) {
      this.$store.dispatch('setPage', page);
    },

    changeSort(sortBy) {
      this.$store.dispatch('setSort', sortBy);
    },

    editComment(comment) {
      this.$emit('edit', comment);
    },

    async deleteComment(commentId) {
      if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
        try {
          await this.$store.dispatch('deleteComment', commentId);
        } catch (error) {
          alert('Ошибка при удалении комментария');
        }
      }
    }
  }
};
</script>
