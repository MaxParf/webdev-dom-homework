import { comments } from './comments.js'
import { renderComments } from './renderComments.js'
import { delay } from './delay.js'

export function toggleLike(index) {
  const comment = comments[index]
  if (comment.isLikeLoading) return

  comment.isLikeLoading = true
  renderComments()

  delay(700)
    .then(() => {
      comment.isLiked = !comment.isLiked
      comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1
    })
    .finally(() => {
      comment.isLikeLoading = false
      renderComments()
    })
}
