import { addComment } from './addComment.js'
import { renderComments } from './renderComments.js'
import { loadComments, login, register, UNKNOWN_ERROR, BAD_REQUEST } from './api.js'
import { comments } from './comments.js'
import { getUser, setUser } from './userState.js'
import { renderMainPage } from './renderApp.js'

// ---- ЗАГРУЗКА КОММЕНТАРИЕВ С СЕРВЕРА ----

export async function fetchAndRenderMainPage() {
  const loadingEl = document.querySelector('.comments-loading')
  loadingEl.textContent = 'Пожалуйста подождите комментарии загружаются...'
  loadingEl.classList.remove('hidden')

  try {
    const serverComments = await loadComments()
    comments.length = 0
    serverComments.forEach((c) => {
      comments.push({
        id: c.id, // Добовляем ID для API V2
        name: c.author?.name || c.name || 'Аноним',
        text: c.text,
        date: new Date(c.date).toLocaleString(),
        likes: c.likes || 0,
        isLiked: c.isLiked || false,
        isLikeLoading: false,
      })
    })

    // 1. Рендер списока комментов и лайков
    renderComments()

    // 2. Запускаем обработчики формы добавления
    initHandlers()
  } catch (error) {
    console.error(error)

    if (error.message === 'OFFLINE_ERROR') {
      alert('Кажется, у вас отключен интернет, попробуйте позже')
      return
    }

    if (error.message === 'SERVER_ERROR') {
      alert('Сервер сломался, попробуй позже')
      return
    }

    alert('Ошибка загрузки комментариев: ' + error.message)
  } finally {
    loadingEl.classList.add('hidden')
  }
}

// --- ФУНКЦИИ АВТОРИЗАЦИИ ---

export async function handleLogin() {
  const loginInput = document.getElementById('auth-login-input')
  const passwordInput = document.getElementById('auth-password-input')
  const errorMessageEl = document.getElementById('auth-error-message')
  errorMessageEl.textContent = ''

  try {
    const response = await login({
      login: loginInput.value,
      password: passwordInput.value,
    })

    setUser(response.user) // Установка токена
    renderMainPage(true)
    await fetchAndRenderMainPage()
  } catch (error) {
    console.error('Ошибка входа:', error.message)
    if (error.message === BAD_REQUEST) {
      errorMessageEl.textContent = 'Неверный логин или пароль.'
    } else {
      errorMessageEl.textContent = `Ошибка: ${error.message || UNKNOWN_ERROR}`
    }
  }
}

export async function handleRegistration() {
  const loginInput = document.getElementById('auth-login-input')
  const nameInput = document.getElementById('auth-name-input')
  const passwordInput = document.getElementById('auth-password-input')
  const errorMessageEl = document.getElementById('auth-error-message')
  errorMessageEl.textContent = ''

  try {
    const response = await register({
      login: loginInput.value,
      name: nameInput.value,
      password: passwordInput.value,
    })

    setUser(response.user) // Установка токена
    renderMainPage(true)
    await fetchAndRenderMainPage()
  } catch (error) {
    console.error('Ошибка регистрации:', error.message)
    if (error.message === BAD_REQUEST) {
      errorMessageEl.textContent = 'Пользователь с таким логином уже существует.'
    } else {
      errorMessageEl.textContent = `Ошибка: ${error.message || UNKNOWN_ERROR}`
    }
  }
}

export function initHandlers() {
  const commentInput = document.querySelector('.add-form-text')
  const addButton = document.querySelector('.add-form-button')
  const user = getUser()

  if (user && addButton) {
    commentInput.addEventListener('input', () => commentInput.classList.remove('error'))

    addButton.addEventListener('click', () => addComment(commentInput))
  }
}
