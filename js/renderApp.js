import { getUser } from './userState.js'
import { handleLogin, handleRegistration } from './initHandlers.js'

// Глобальное состояние 'login' | 'registration'
let authMode = 'login'

// --- Рендер блок регистрации и авторизации
export const renderAuthForm = () => {
  const isAuth = !!getUser()
  const appContainer = document.getElementById('app-container')

  if (!appContainer) return
  const formContainer = appContainer.querySelector('.bottom-form-container')

  if (!formContainer) return
  let formHtml = ''

  if (isAuth) {
    // --- 1. ЕСЛИ ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН
    const user = getUser()
    formHtml = `
            <div class="add-form" id="add-comment-form">
                <input 
                    type="text" 
                    class="add-form-name" 
                    placeholder="Введите ваше имя" 
                    value="${user?.name || ''}" 
                    readonly 
                />
                <textarea
                    type="textarea"
                    class="add-form-text"
                    placeholder="Введите ваш комментарий"
                    rows="4"
                ></textarea>
                <div class="add-form-row">
                    <button class="add-form-button" id="add-comment-button">Написать</button>
                </div>
            </div>
        `
  } else {
    // --- 2. ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕАВТОРИЗОВАН
    const isRegistration = authMode === 'registration'

    formHtml = `
            <div class="add-form auth-page" id="auth-toggle-form">
                <h2 class="auth-header">${isRegistration ? 'Регистрация' : 'Вход в приложение'}</h2>
                <form class="auth-form" id="auth-form">
                    ${
                      isRegistration
                        ? // Это поле ИМЯ только для регистрации
                          `<input type="text" id="auth-name-input" class="add-form-name" placeholder="Имя" required>`
                        : ''
                    }
                    
                    <input type="text" id="auth-login-input" class="add-form-name" placeholder="Логин" required>
                    <input type="password" id="auth-password-input" class="add-form-name" placeholder="Пароль" required>
                    
                    <div id="auth-error-message" class="error-message"></div>
                    
                    <div class="add-form-row">
                        <button type="submit" class="add-form-button">${isRegistration ? 'Зарегистрируйся' : 'Войти'}</button>
                    </div>

                    <div class="auth-toggle-buttons add-form-row"> 
                        ${
                          isRegistration
                            ? `<p>Есть аккаунт? <a href="#" class="add-form-button" id="to-login-link" >Войти</a></p>`
                            : `<p>Нет аккаунта? <a href="#" class="add-form-button" id="to-register-link" >Зарегистрируйся</a></p>`
                        }
                    </div>
                </form>
            </div>
        `
  }

  formContainer.innerHTML = formHtml

  if (!isAuth) {
    document.getElementById('auth-form')?.addEventListener('submit', (e) => {
      e.preventDefault()
      if (authMode === 'login') {
        handleLogin()
      } else {
        handleRegistration()
      }
    })

    document.getElementById('to-register-link')?.addEventListener('click', (e) => {
      e.preventDefault()
      setAuthMode('registration')
    })
    document.getElementById('to-login-link')?.addEventListener('click', (e) => {
      e.preventDefault()
      setAuthMode('login')
    })
  }
}

export const setAuthMode = (mode) => {
  authMode = mode
  renderAuthForm()
}

// --- Разметка главной страницы
const getMainPageHtml = () => {
  return `
        <div class="container">
            <ul class="comments"></ul> 
            
            <div class="comments-loading hidden">Пожалуйста подождите комментарии загружаются...</div>

            <div class="bottom-form-container">
                </div>
        </div>
    `
}

// --- Рендер главной страницы
export const renderMainPage = () => {
  const appContainer = document.getElementById('app-container')
  if (!appContainer) {
    console.error('Fatal Error: app-container element not found in HTML.')
    return
  }

  appContainer.innerHTML = getMainPageHtml()
  renderAuthForm()
}
