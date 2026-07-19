import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { TodoItem } from '../components/TodoItem'

const QUOTE =
  '“Doing what you love is the cornerstone of having abundance in your life.” — Wayne Dyer'

function SignOutButton({ onClick, className = '' }) {
  return (
    <button type="button" className={`sign-out-btn ${className}`.trim()} onClick={onClick}>
      Sign Out
    </button>
  )
}

export default function Dashboard() {
  const { logout } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState('')

  const boardRef = useRef(null)
  const chromeRef = useRef(null)
  const footerRef = useRef(null)

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }, [])

  const syncPinnedOffsets = useCallback(() => {
    const board = boardRef.current
    const chrome = chromeRef.current
    const footer = footerRef.current
    if (!board || !chrome || !footer) return

    board.style.setProperty('--chrome-height', `${chrome.offsetHeight}px`)
    board.style.setProperty('--footer-height', `${footer.offsetHeight}px`)
  }, [])

  useLayoutEffect(() => {
    if (loading) return

    syncPinnedOffsets()

    const ro = new ResizeObserver(() => syncPinnedOffsets())
    if (chromeRef.current) ro.observe(chromeRef.current)
    if (footerRef.current) ro.observe(footerRef.current)

    window.addEventListener('resize', syncPinnedOffsets)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncPinnedOffsets)
    }
  }, [loading, syncPinnedOffsets, error])

  const loadTodos = useCallback(async () => {
    setError('')
    try {
      const data = await api.getTodos()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err.status === 401) {
        logout()
        return
      }
      setError(err.message || 'Could not load todos. Refresh and try again.')
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const remaining = useMemo(() => todos.filter((t) => !t.completed).length, [todos])

  const handleCreate = async (e) => {
    e.preventDefault()
    const title = draft.trim()
    if (!title || creating) return

    setCreating(true)
    setError('')
    try {
      const todo = await api.createTodo(title)
      setTodos((prev) => [todo, ...prev])
      setDraft('')
      showToast('Task added')
    } catch (err) {
      setError(err.message || 'Could not add task. Try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleToggle = async (todo) => {
    const next = !todo.completed
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, completed: next } : t)),
    )
    try {
      const updated = await api.updateTodo(todo._id, next)
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, ...updated } : t)),
      )
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, completed: todo.completed } : t,
        ),
      )
      setError(err.message || 'Could not update task.')
    }
  }

  const handleDelete = async (id) => {
    const snapshot = todos
    setTodos((prev) => prev.filter((t) => t._id !== id))
    try {
      await api.deleteTodo(id)
      showToast('Task deleted')
    } catch (err) {
      setTodos(snapshot)
      setError(err.message || 'Could not delete task.')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div>
          <div className="spinner" aria-hidden="true" />
          <p>Loading Todos…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard__top dashboard__top--desktop">
        <SignOutButton onClick={logout} />
      </header>

      <main className="dashboard__main">
        <div className="todo-board" ref={boardRef}>
          {/* Single solid chrome: title + input — no seam between them */}
          <div className="todo-board__chrome" ref={chromeRef}>
            <header className="todo-board__head">
              <div className="todo-board__head-bar">
                <SignOutButton onClick={logout} className="sign-out-btn--in-card" />
              </div>
              <h1 className="todo-board__title">Your To Do</h1>
            </header>

            {error && (
              <div className="dashboard-error dashboard-error--pinned" role="alert">
                {error}
              </div>
            )}

            <form className="todo-composer" onSubmit={handleCreate}>
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add new task"
                aria-label="Add new task"
                disabled={creating}
                autoFocus
              />
              <button
                type="submit"
                className="todo-composer__add"
                disabled={creating || !draft.trim()}
                aria-label="Add Task"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M9 3.5v11M3.5 9h11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="todo-board__scroll">
            {todos.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state__title">No Tasks Yet</p>
                <p className="empty-state__copy">
                  Add a task above to start your list.
                </p>
              </div>
            ) : (
              <ul className="todo-list" aria-label="Your tasks">
                {todos.map((todo, i) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    index={i}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}
          </div>

          <footer className="todo-board__footer" ref={footerRef}>
            <p className="todo-board__remaining">
              Your remaining todos :{' '}
              <span className="tabular">{remaining}</span>
            </p>
            <p className="todo-board__quote">{QUOTE}</p>
          </footer>
        </div>
      </main>

      {toast && (
        <div className="toast-region" aria-live="polite">
          <div className="toast">{toast}</div>
        </div>
      )}
    </div>
  )
}
