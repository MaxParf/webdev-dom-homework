// API CONFIG
const API_BASE = 'https://wedev-api.sky.pro/api/v1'
const API_KEY = 'max-parf'
export const COMMENTS_URL = `${API_BASE}/${API_KEY}/comments`

// КОНСТАНТЫ ОШИБОК
export const OFFLINE_ERROR = 'OFFLINE_ERROR'
export const VALIDATION_ERROR = 'VALIDATION_ERROR'
export const BAD_REQUEST = 'BAD_REQUEST'
export const SERVER_ERROR = 'SERVER_ERROR'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'

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

// GET — загрузка комментариев
export async function loadComments() {
  try {
    const response = await fetch(COMMENTS_URL)

    if (!navigator.onLine) {
      throw new Error(OFFLINE_ERROR)
    }

    if (response.status === 500) {
      throw new Error(SERVER_ERROR)
    }

    if (!response.ok) {
      throw new Error(UNKNOWN_ERROR)
    }

    const data = await response.json()
    return data.comments
  } catch (error) {
    if (error.message === OFFLINE_ERROR) {
      throw error
    }
    if (error.message === SERVER_ERROR) {
      throw error
    }
    throw new Error(UNKNOWN_ERROR)
  }
}

// POST — добавление комментария
export async function sendComment({ name, text }) {
  return requestWithRetry(async () => {
    let response

    try {
      response = await fetch(COMMENTS_URL, {
        method: 'POST',
        body: JSON.stringify({ name, text }),
      })
    } catch (e) {
      console.warn('Network error:', e)
      throw new Error(OFFLINE_ERROR)
    }

    // === Обработка статусов ===
    if (response.status === 400) {
      throw new Error(VALIDATION_ERROR)
    }

    if (response.status === 500) {
      throw new Error(SERVER_ERROR)
    }

    if (!response.ok) {
      throw new Error(UNKNOWN_ERROR)
    }

    // Возвращаем формат, который ожидает рендер
    return {
      name,
      text,
      date: new Date().toLocaleString(),
      likes: 0,
      isLiked: false,
    }
  })
}
