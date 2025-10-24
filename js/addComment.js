import { comments } from './comments.js'
import { safeSymbol } from './safeSymbol.js'
import { renderComments } from './renderComments.js'

// ДОБАВЛЕНИЕ НОВЫХ КОММЕНТАРИЕВ
export function addComment(nameInput, commentInput) {
  const name = safeSymbol(nameInput.value.trim())
  const comment = safeSymbol(commentInput.value.trim())
  let hasError = false

  // ВАЛИДАЦИЯ
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

  // ДОБАВЛЕНИЕ НОВОГО КОММЕНТАРИЯ В МАССИВ
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const date = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${String(now.getFullYear()).slice(-2)} ${pad(now.getHours())}:${pad(now.getMinutes())}`

  comments.push({
    name,
    date,
    text: comment,
    likes: 0,
    isLiked: false,
  })

  renderComments()

  nameInput.value = ''
  commentInput.value = ''
  nameInput.classList.remove('error')
  commentInput.classList.remove('error')
}
