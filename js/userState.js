// Глобальное состояние пользователя
let user = null

export const setUser = (newUser) => {
  user = newUser
  // Сохранение в LocalStorage
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

export const getUser = () => {
  return user
}

// Проверка авторизации на старте
export const loadUserFromLocalStorage = () => {
  const userJson = localStorage.getItem('user')
  if (userJson) {
    try {
      user = JSON.parse(userJson)
    } catch (e) {
      console.error('Ошибка парсинга LocalStorage', e)
      localStorage.removeItem('user')
      user = null
    }
  }
}
