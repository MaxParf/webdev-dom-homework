import { getUser } from './userState.js'

// --- API CONFIG V2
const commentsHost = 'https://wedev-api.sky.pro/api/v2'
const userHost = 'https://wedev-api.sky.pro/api/user'
const personalKey = 'max-parf'
export const COMMENTS_URL = `${commentsHost}/${personalKey}/comments`

// --- КОНСТАНТЫ ОШИБОК
export const OFFLINE_ERROR = 'OFFLINE_ERROR'
export const VALIDATION_ERROR = 'VALIDATION_ERROR'
export const BAD_REQUEST = 'BAD_REQUEST'
export const SERVER_ERROR = 'SERVER_ERROR'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
export const UNAUTHORIZED = 'UNAUTHORIZED' // 401 ошибка

// Хелпер для авторизованных запросов
const getAuthHeaders = () => {
  const token = getUser()?.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// УТИЛИТА RETRY ТОЛЬКО ДЛЯ 500
async function requestWithRetry(requestFn, retries = 3) {
  try {
    return await requestFn()
  } catch (error) {
    // Повторяем только при ошибке сервера
    if (error.message === SERVER_ERROR && retries > 0) {
      return await requestWithRetry(requestFn, retries - 1)
    }
    throw error
  }
}

// --- АВТОРИЗАЦИЯ И РЕГИСТРАЦИЯ ---

// POST — Логин
export async function login({ login, password }) {
  const response = await fetch(`${userHost}/login`, {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  })

  // Если 400, ищем причину
  if (response.status === 400) {
    const errorBody = await response.json()
    // Выбрасываем точный текст ошибки, если он есть
    throw new Error(errorBody.error || BAD_REQUEST)
  }
  if (!response.ok) {
    throw new Error(UNKNOWN_ERROR)
  }
  return response.json()
}

// POST — Регистрация
export async function register({ login, name, password }) {
  const response = await fetch(`${userHost}`, {
    method: 'POST',
    body: JSON.stringify({ login, name, password }),
  })

  // Если 400, ищем причину
  if (response.status === 400) {
    const errorBody = await response.json()
    // Выбрасываем точный текст ошибки, если он есть
    throw new Error(errorBody.error || BAD_REQUEST)
  }
  if (!response.ok) {
    throw new Error(UNKNOWN_ERROR)
  }
  return response.json()
}

// --- КОММЕНТАРИИ ---

// GET — загрузка комментариев (v2)
export async function loadComments() {
  const response = await fetch(COMMENTS_URL)

  if (!navigator.onLine) throw new Error(OFFLINE_ERROR)
  if (response.status === 500) throw new Error(SERVER_ERROR)
  if (!response.ok) throw new Error(UNKNOWN_ERROR)

  const data = await response.json()
  return data.comments
}

// POST — добавление комментария (v2, нужен токен, принимаем только text)
export async function sendComment({ text }) {
  return requestWithRetry(async () => {
    try {
      const response = await fetch(COMMENTS_URL, {
        method: 'POST',
        headers: {
          // ВОТ ОНО!!! ЗЛО - Content-Type, API его отклоняет
          // 'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text }),
      })

      if (response.status === 401) throw new Error(UNAUTHORIZED)

      if (response.status === 400) {
        // Читаем тело ответа, ищем точную причину
        const errorBody = await response.json()
        throw new Error(errorBody.error || VALIDATION_ERROR)
      }

      if (response.status === 500) throw new Error(SERVER_ERROR)

      if (!response.ok) throw new Error(UNKNOWN_ERROR)

      return { result: 'ok' }
    } catch (e) {
      if (e.message.startsWith('Failed to fetch') || e instanceof TypeError) {
        console.warn('Network error:', e)
        throw new Error(OFFLINE_ERROR)
      }
      throw e
    }
  })
}
// POST — Переключить лайк (v2, нужен токен)
export async function toggleLikeAPI(commentId) {
  const response = await fetch(`${COMMENTS_URL}/${commentId}/toggle-like`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (response.status === 401) throw new Error(UNAUTHORIZED)
  if (!response.ok) throw new Error(UNKNOWN_ERROR)

  return response.json()
}
