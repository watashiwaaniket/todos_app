import { useState } from 'react'

export function TodoItem({ todo, onToggle, onDelete, index = 0 }) {
  const [exiting, setExiting] = useState(false)

  const handleDelete = () => {
    setExiting(true)
    window.setTimeout(() => {
      onDelete(todo._id)
    }, 150)
  }

  const stagger = Math.min(index, 8)

  return (
    <li
      className={`todo-item${todo.completed ? ' todo-item--completed' : ''}${exiting ? ' todo-item--exiting' : ''}`}
      style={{ animationDelay: `${40 + stagger * 40}ms` }}
    >
      <button
        type="button"
        className={`checkbox${todo.completed ? ' checkbox--checked' : ''}`}
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? `Mark “${todo.title}” incomplete` : `Complete “${todo.title}”`}
        aria-pressed={todo.completed}
      >
        <span className="checkbox__box">
          {todo.completed && (
            <svg className="checkbox__icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 6.2L4.8 8.5L9.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>

      <div className="todo-item__body">
        <span className="todo-item__title">{todo.title}</span>
      </div>

      <button
        type="button"
        className="delete-btn"
        onClick={handleDelete}
        aria-label={`Delete “${todo.title}”`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3.5 3.5l7 7M10.5 3.5l-7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  )
}
