import { comments } from './comments.js'
import { renderComments } from './renderComments.js'

// ПОСЛЕ КАЖДОГО ЛАЙКА ВЫПОЛНЯЕТСЯ РЕНДЕР
export function toggleLike(index) {
  const comment = comments[index]
  // состояние лайка
  comment.isLiked = !comment.isLiked
  // изменение счётчика
  comment.likes += comment.isLiked ? 1 : -1
  renderComments()
}
