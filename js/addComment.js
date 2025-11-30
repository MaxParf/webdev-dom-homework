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

  try {
    const newComment = await sendComment({ name, text: comment })
    comments.push(newComment) // добавляем в локальный массив
    renderComments()
  } catch (error) {
    console.error(error)
    alert(error.message)
  }

  nameInput.value = ''
  commentInput.value = ''
  nameInput.classList.remove('error')
  commentInput.classList.remove('error')
}
