import { comments } from './comments.js'
import { safeSymbol } from './safeSymbol.js'
import { renderComments } from './renderComments.js'
import { sendComment } from './api.js'

export async function addComment(nameInput, commentInput) {
  const name = safeSymbol(nameInput.value.trim())
  const comment = safeSymbol(commentInput.value.trim())
  let hasError = false

  if (!name) {
    nameInput.value = ''
    nameInput.placeholder = 'Введите имя!'
    nameInput.classList.add('error')
    hasError = true
  } else {
    nameInput.classList.remove('error')
    nameInput.placeholder = 'Введите ваше имя'
  }

  if (!comment) {
    commentInput.value = ''
    commentInput.placeholder = 'Введите комментарий!'
    commentInput.classList.add('error')
    hasError = true
  } else {
    commentInput.classList.remove('error')
    commentInput.placeholder = 'Введите ваш комментарий'
  }

  if (hasError) return

  const formEl = document.querySelector('.add-form')
  const sendingEl = document.querySelector('.comments-loading')

  formEl.style.display = 'none'
  sendingEl.textContent = 'Комментарий добавляется...'
  sendingEl.classList.remove('hidden')

  try {
    const newComment = await sendComment({ name, text: comment })
    comments.push({
      ...newComment,
      isLiked: false,
      isLikeLoading: false,
    })
    renderComments()
  } catch (error) {
    console.error(error)
    alert(error.message)
  } finally {
    formEl.style.display = 'block'
    sendingEl.classList.add('hidden')
    nameInput.value = ''
    commentInput.value = ''
    nameInput.classList.remove('error')
    commentInput.classList.remove('error')
  }
}
