import { comments } from './comments.js'
import { toggleLike } from './likeHandler.js'

export function renderComments() {
  const commentsList = document.querySelector('.comments')
  const nameInput = document.querySelector('.add-form-name')
  const commentInput = document.querySelector('.add-form-text')

  commentsList.innerHTML = comments
    .map(
      (comment, index) => `
        <li class="comment" data-index="${index}">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">${comment.text}</div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="like-button ${comment.isLiked ? '-active-like' : ''}" type="button"></button>
            </div>
          </div>
        </li>
      `,
    )
    .join('')

  // ДОБАВЛЯЕМ ОБРАБОТЧИКИ ЛАЙКОВ
  document.querySelectorAll('.like-button').forEach((button, index) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      toggleLike(index)
    })
  })

  // ДОБАВЛЯЕМ ОБРАБОТЧИКИ ДЛЯ ОТВЕТА НА КОММЕНТАРИЙ
  document.querySelectorAll('.comment').forEach((commentEl) => {
    commentEl.addEventListener('click', () => {
      const i = commentEl.dataset.index
      const clicked = comments[i]
      commentInput.value = `> ${clicked.text}\n${clicked.name}, `
      nameInput.focus()
    })
  })
}
