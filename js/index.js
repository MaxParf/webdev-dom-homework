import { initHandlers } from './initHandlers.js'

// ТОЧКА ВХОДА
document.addEventListener('DOMContentLoaded', async () => {
  const loadingEl = document.querySelector('.comments-loading')
  loadingEl.textContent = 'Пожалуйста подождите комментарии загружаются...'
  loadingEl.classList.remove('hidden')

  try {
    await initHandlers() // загружаем и рендерим комментарии
  } finally {
    loadingEl.classList.add('hidden')
  }
})
