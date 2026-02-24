export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const isDone = task.status === 'completed';

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null;

  const isOverdue =
    task.dueDate &&
    task.status === 'pending' &&
    new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${isDone ? 'is-done' : ''}`}>
      {/* Toggle checkbox */}
      <button
        className={`task-checkbox ${isDone ? 'done' : ''}`}
        onClick={() => onToggle(task._id)}
        aria-label={isDone ? 'Mark as pending' : 'Mark as complete'}
        title={isDone ? 'Mark as pending' : 'Mark as complete'}
      >
        {/* Check icon */}
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke="white">
          <path d="M2 6l3 3 5-5" />
        </svg>
      </button>

      {/* Content */}
      <div>
        <p className="task-title">{task.title}</p>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          {/* Date with clock icon */}
          <div className="task-date-row">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {createdDate}
          </div>

          {/* Status badge */}
          <span className={`status-badge ${task.status}`}>{task.status}</span>

          {/* Priority */}
          <span className={`priority-badge ${task.priority}`}>{task.priority}</span>

          {/* Due date */}
          {dueDate && (
            <span className={isOverdue ? 'task-due-overdue' : 'task-date-row'}>
              {isOverdue && '⚠ '}Due {dueDate}
            </span>
          )}

          {/* Completed at */}
          {isDone && task.completedAt && (
            <span className="task-date-row" style={{ color: 'var(--green)' }}>
              ✓ {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Actions — visible on hover */}
      <div className="task-actions">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          title="Delete"
          style={{ borderColor: 'transparent' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}