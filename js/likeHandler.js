import { comments } from './comments.js'
import { renderComments } from './renderComments.js'
import { toggleLikeAPI } from './api.js'
import { getUser } from './userState.js'

export async function toggleLike(index) {
  const comment = comments[index]
  const user = getUser()

  if (!user) {
    alert('Для того чтобы поставить лайк, необходимо авторизоваться!')
    return
  }

  if (comment.isLikeLoading) return

  // Добавляем ID (API V2 нужен для лайка)
  const commentId = comment.id
  if (!commentId) {
    console.error('Комментарий не имеет ID, невозможно отправить лайк на сервер.')
    return
  }

  comment.isLikeLoading = true
  renderComments()

  try {
    const data = await toggleLikeAPI(commentId)
    comment.isLiked = data.result.isLiked
    comment.likes = data.result.likes
  } catch (error) {
    console.error('Ошибка при переключении лайка:', error)
    if (error.message === 'UNAUTHORIZED') {
      alert('Сессия истекла. Пожалуйста, войдите снова.')
    } else {
      alert('Не удалось поставить лайк. Попробуйте снова.')
    }
  } finally {
    comment.isLikeLoading = false
    renderComments()
  }
}
