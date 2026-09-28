<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="comment-author">{{ comment.name }}</span>
      <span class="comment-date">{{ comment.date }}</span>
    </div>
    <div class="comment-text">{{ comment.text }}</div>
    <div class="comment-actions">
      <button @click="$emit('edit', comment)" class="btn btn-edit">Редактировать</button>
      <button @click="$emit('delete', comment.id)" class="btn btn-delete">Удалить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
};
</script>
