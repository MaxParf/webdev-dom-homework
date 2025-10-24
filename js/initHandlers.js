import { addComment } from './addComment.js'
import { renderComments } from './renderComments.js'

// УСТАНОВКА ОБРАБОТЧИКОВ
export function initHandlers() {
  const nameInput = document.querySelector('.add-form-name')
  const commentInput = document.querySelector('.add-form-text')
  const addButton = document.querySelector('.add-form-button')

  nameInput.addEventListener('input', () => nameInput.classList.remove('error'))
  commentInput.addEventListener('input', () => commentInput.classList.remove('error'))

  addButton.addEventListener('click', () => addComment(nameInput, commentInput))

  // ПЕРВОНАЧАЛЬНЫЙ РЕНДЕР
  renderComments()
}
