import axios from 'axios'

const client = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  if (config.requiresAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
  }
  delete config.requiresAuth
  return config
})

function toError(err) {
  const status = err.response?.status
  const data = err.response?.data
  const message =
    data?.message || err.message || `Request failed${status ? ` (${status})` : ''}`
  const error = new Error(message)
  error.status = status
  error.data = data
  return error
}

async function request(config) {
  try {
    const res = await client.request(config)
    if (res.status === 204) return null
    return res.data
  } catch (err) {
    throw toError(err)
  }
}

export const api = {
  signup: ({ username, email, password }) =>
    request({
      method: 'POST',
      url: '/api/auth/signup',
      data: { username, email, password },
    }),

  login: ({ username, password }) =>
    request({
      method: 'POST',
      url: '/api/auth/login',
      data: { username, password },
    }),

  getTodos: () =>
    request({
      method: 'GET',
      url: '/api/todos/todos',
      requiresAuth: true,
    }),

  createTodo: (title) =>
    request({
      method: 'POST',
      url: '/api/todos/todos',
      data: { title },
      requiresAuth: true,
    }),

  updateTodo: (id, completed) =>
    request({
      method: 'PATCH',
      url: `/api/todos/todos/${id}`,
      data: { completed },
      requiresAuth: true,
    }),

  deleteTodo: (id) =>
    request({
      method: 'DELETE',
      url: `/api/todos/todos/${id}`,
      requiresAuth: true,
    }),
}
