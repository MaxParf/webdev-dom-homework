import { comments } from './comments.js'
import { safeSymbol } from './safeSymbol.js'
import { renderComments } from './renderComments.js'
import { sendComment } from './api.js'

export async function addComment(nameInput, commentInput) {
  const name = safeSymbol(nameInput.value.trim())
  const comment = safeSymbol(commentInput.value.trim())

  // Проверка длины
  if (name.length < 3 || comment.length < 3) {
    alert('Имя и комментарий должны быть не короче 3 символов')
    return
  }

  const formEl = document.querySelector('.add-form')
  const sendingEl = document.querySelector('.comments-loading')

  // Скрываем форму
  formEl.style.visibility = 'hidden'
  formEl.style.pointerEvents = 'none'

  sendingEl.textContent = 'Комментарий добавляется...'
  sendingEl.classList.remove('hidden')

  try {
    // Отправляем. sendComment может быть: OFFLINE_ERROR, BAD_REQUEST, VALIDATION_ERROR, SERVER_ERROR
    const newComment = await sendComment({ name, text: comment })

    comments.push({
      ...newComment,
      // гарантия полей, которые рендер ожидает чтобы не схлопнулось
      isLiked: newComment.isLiked || false,
      isLikeLoading: false,
    })

    renderComments()

    // Чистим форму при успешной отправке
    nameInput.value = ''
    commentInput.value = ''
    nameInput.classList.remove('error')
    commentInput.classList.remove('error')
  } catch (error) {
    console.error(error)

    // оффлайн
    if (error.message === 'OFFLINE_ERROR') {
      alert('Кажется, у вас отключен интернет, попробуйте позже')
      return
    }

    // SERVER 500 (после всех retry)
    if (error.message === 'SERVER_ERROR') {
      alert('Сервер сломался, попробуй позже')
      return
    }

    // BAD REQUEST (400)
    if (error.message === 'BAD_REQUEST') {
      alert('Имя и комментарий должны быть не короче 3 символов')
      return
    }

    // VALIDATION_ERROR (локально)
    if (error.message === 'VALIDATION_ERROR') {
      alert('Имя и комментарий должны быть не короче 3 символов')
      return
    }

    // fallback
    alert('Произошла ошибка, попробуйте позже')
  } finally {
    // Возврат форм в рабочее состояние (без очистки — если была ошибка)
    formEl.style.visibility = 'visible'
    formEl.style.pointerEvents = 'auto'
    sendingEl.classList.add('hidden')
  }
}
