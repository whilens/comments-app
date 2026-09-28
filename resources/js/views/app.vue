<template>
  <div id="comments-app">
    <div class="container">
      <h1>Комментарии</h1>
      
      <comments-list @edit="handleEdit" />
      
      <comment-form
        :edit-comment="editingComment"
        @updated="handleUpdated"
        @cancel="handleCancelEdit"
      />
    </div>
  </div>
</template>

<script>
import CommentsList from '../components/CommentsList.vue';
import CommentForm from '../components/CommentForm.vue';

export default {
  components: {
    CommentsList,
    CommentForm
  },
  
  data() {
    return {
      editingComment: null
    };
  },

  mounted() {
    this.$store.dispatch('fetchComments');
  },

  methods: {
    handleEdit(comment) {
      this.editingComment = comment;
      this.scrollToForm();
    },

    handleUpdated() {
      this.editingComment = null;
    },

    handleCancelEdit() {
      this.editingComment = null;
    },

    scrollToForm() {
      this.$nextTick(() => {
        const formElement = document.querySelector('.comment-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
};
</script>

<style scoped>
#comments-app {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }
}
</style>
