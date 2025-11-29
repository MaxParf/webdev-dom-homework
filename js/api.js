const API_BASE = 'https://wedev-api.sky.pro/api/v1'
const API_KEY = 'max-parf' // твой персональный ключ
export const COMMENTS_URL = `${API_BASE}/${API_KEY}/comments`

// GET — загрузка комментариев с сервера
export async function loadComments() {
  const response = await fetch(COMMENTS_URL)

  if (!response.ok) {
    throw new Error('Ошибка загрузки комментариев с сервера')
  }

  const data = await response.json()
  return data.comments
}

// POST — добавление нового комментария
export async function sendComment({ name, text }) {
  if (name.length < 3 || text.length < 3) {
    throw new Error('Имя и текст должны быть не менее 3 символов')
  }

  const response = await fetch(COMMENTS_URL, {
    method: 'POST',
    body: JSON.stringify({ name, text }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Ошибка при добавлении комментария на сервер')
  }

  // возвращаем объект в формате фронтенда
  return { name, text, date: new Date().toLocaleString(), likes: 0, isLiked: false }
}
