import { loadUserFromLocalStorage, getUser } from './userState.js'
import { renderMainPage } from './renderApp.js'
import { fetchAndRenderMainPage } from './initHandlers.js'

// ТОЧКА ВХОДА
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Загрузка пользователя из LocalStorage
  loadUserFromLocalStorage()

  // 2. Рендеринг основной структуры (Показывает форму или ссылку)
  renderMainPage(!!getUser())

  // 3. Загрузка данных и финальный рендеринг списка
  await fetchAndRenderMainPage()
})
