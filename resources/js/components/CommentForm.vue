<template>
  <div class="comment-form">
    <h3>{{ isEditing ? 'Редактировать комментарий' : 'Добавить комментарий' }}</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'error': errors.name }"
          placeholder="Введите ваше имя"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="text">Комментарий:</label>
        <textarea
          id="text"
          v-model="form.text"
          class="form-control"
          :class="{ 'error': errors.text }"
          rows="4"
          placeholder="Введите текст комментария"
        ></textarea>
        <span v-if="errors.text" class="error-message">{{ errors.text }}</span>
      </div>

      <div class="form-group">
        <label for="date">Дата:</label>
        <date-picker
          v-model="form.date"
          :class="{ 'error': errors.date }"
          format="YYYY-MM-DD"
          value-type="format"
          placeholder="Выберите дату"
        ></date-picker>
        <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ isEditing ? 'Сохранить' : 'Добавить' }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          class="btn btn-secondary"
          @click="cancelEdit"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'CommentForm',
  components: {
    DatePicker
  },
  props: {
    editComment: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        text: '',
        date: ''
      },
      errors: {},
      loading: false
    };
  },
  computed: {
    isEditing() {
      return !!this.editComment;
    }
  },
  watch: {
    editComment: {
      immediate: true,
      handler(comment) {
        if (comment) {
          this.form = {
            name: comment.name,
            text: comment.text,
            date: comment.date
          };
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.name || this.form.name.trim().length === 0) {
        this.errors.name = 'Имя обязательно для заполнения';
      } else if (this.form.name.trim().length < 2) {
        this.errors.name = 'Имя должно содержать минимум 2 символа';
      }

      if (!this.form.text || this.form.text.trim().length === 0) {
        this.errors.text = 'Комментарий обязателен для заполнения';
      } else if (this.form.text.trim().length < 5) {
        this.errors.text = 'Комментарий должен содержать минимум 5 символов';
      }

      if (!this.form.date) {
        this.errors.date = 'Дата обязательна для заполнения';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const commentData = {
          name: this.form.name.trim(),
          text: this.form.text.trim(),
          date: this.form.date
        };

        if (this.isEditing) {
          await this.$store.dispatch('updateComment', {
            id: this.editComment.id,
            commentData
          });
          this.$emit('updated');
        } else {
          await this.$store.dispatch('createComment', commentData);
          this.resetForm();
        }
      } catch (error) {
        alert('Произошла ошибка при сохранении комментария');
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        name: '',
        text: '',
        date: ''
      };
      this.errors = {};
    },

    cancelEdit() {
      this.$emit('cancel');
    }
  }
};
</script>
