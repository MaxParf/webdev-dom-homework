import { addComment } from './addComment.js'
import { renderComments } from './renderComments.js'
import { loadComments } from './api.js'
import { comments } from './comments.js'

// ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ
export async function initHandlers() {
  const nameInput = document.querySelector('.add-form-name')
  const commentInput = document.querySelector('.add-form-text')
  const addButton = document.querySelector('.add-form-button')

  nameInput.addEventListener('input', () => nameInput.classList.remove('error'))
  commentInput.addEventListener('input', () => commentInput.classList.remove('error'))

  addButton.addEventListener('click', () => addComment(nameInput, commentInput))

  // ---- ЗАГРУЗКА КОММЕНТАРИЕВ С СЕРВЕРА ----
  try {
    const serverComments = await loadComments()
    comments.length = 0 // очищаем локальный массив
    serverComments.forEach((c) => {
      comments.push({
        name: c.author.name,
        text: c.text,
        date: new Date(c.date).toLocaleString(),
        likes: c.likes,
        isLiked: c.isLiked || false,
      })
    })
    renderComments()
  } catch (error) {
    console.error(error)
  }
}
