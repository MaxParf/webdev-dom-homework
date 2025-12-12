// js/addComment.js

import { comments } from './comments.js'
import { safeSymbol } from './safeSymbol.js'
import { renderComments } from './renderComments.js'
import {
  sendComment,
  loadComments,
  OFFLINE_ERROR,
  VALIDATION_ERROR,
  SERVER_ERROR,
  UNAUTHORIZED,
} from './api.js'
import { getUser } from './userState.js'

export async function addComment(commentInput) {
  const user = getUser()
  if (!user) {
    alert('Для добавления комментария требуется авторизация.')
    return
  }

  const commentText = safeSymbol(commentInput.value.trim())

  if (commentText.length < 3) {
    alert('Комментарий должен быть не короче 3 символов')
    return
  }

  const formEl = document.querySelector('#add-comment-form')
  const sendingEl = document.querySelector('.comments-loading')

  // Скрываем форму
  if (formEl) formEl.style.visibility = 'hidden'
  if (formEl) formEl.style.pointerEvents = 'none'

  sendingEl.textContent = 'Комментарий добавляется...'
  sendingEl.classList.remove('hidden')

  try {
    // Отправляем. Передаем только текст, имя берется с сервера.
    await sendComment({ text: commentText })

    // V2 API не возвращает новый комментарий, поэтому перезагружаем весь список!
    const newComments = await loadComments()

    // Удаляем старый массив и загружаем новый
    comments.length = 0
    newComments.forEach((c) => {
      comments.push({
        id: c.id,
        name: c.author?.name || c.name || 'Аноним',
        text: c.text,
        date: new Date(c.date).toLocaleString(),
        likes: c.likes || 0,
        isLiked: c.isLiked || false,
        isLikeLoading: false,
      })
    })

    renderComments()

    // Если ок чистим форму
    commentInput.value = ''
    commentInput.classList.remove('error')
  } catch (error) {
    console.error(error)

    if (error.message === OFFLINE_ERROR) {
      alert('Кажется, у вас отключен интернет, попробуйте позже')
      return
    }

    if (error.message === SERVER_ERROR) {
      alert('Сервер сломался, попробуй позже')
      return
    }

    if (error.message === VALIDATION_ERROR) {
      alert('Текст комментария не прошел валидацию.')
      return
    }

    if (error.message === UNAUTHORIZED) {
      alert('Ошибка авторизации. Войдите снова.')
      return
    }

    alert('Произошла ошибка: ' + error.message)
  } finally {
    // Возврат формы в рабочее состояние
    if (formEl) formEl.style.visibility = 'visible'
    if (formEl) formEl.style.pointerEvents = 'auto'
    sendingEl.classList.add('hidden')
  }
}
