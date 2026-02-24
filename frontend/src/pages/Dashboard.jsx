import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';

/** Returns "Good morning", "Good afternoon", or "Good evening" */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState('all');
  const [modal, setModal]   = useState({ open: false, mode: 'create', task: null });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // ── Fetchers ──────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    const { data } = await api.get('/tasks/stats');
    setStats(data);
  }, []);

  const fetchTasks = useCallback(async (currentFilter) => {
    const params = currentFilter !== 'all' ? { status: currentFilter } : {};
    const { data } = await api.get('/tasks', { params });
    setTasks(data);
  }, []);

  const loadAll = useCallback(async (currentFilter = filter) => {
    setError('');
    try {
      await Promise.all([fetchTasks(currentFilter), fetchStats()]);
    } catch {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, fetchStats, filter]);

  useEffect(() => { loadAll(); }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchTasks(newFilter);
  };

  // ── Task operations ───────────────────────────────────────────

  const handleCreate = async (payload) => {
    const { data } = await api.post('/tasks', payload);
    setTasks((prev) => [data, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
  };

  const handleUpdate = async (payload) => {
    const id = modal.task._id;
    const { data } = await api.patch(`/tasks/${id}`, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const handleToggle = async (id) => {
    const snapshot = tasks;
    const task = tasks.find((t) => t._id === id);

    // Optimistic flip
    setTasks((prev) => prev.map((t) =>
      t._id === id
        ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending',
              completedAt: t.status === 'pending' ? new Date().toISOString() : null }
        : t
    ));
    if (task) {
      setStats((s) => ({
        ...s,
        completed: task.status === 'pending' ? s.completed + 1 : s.completed - 1,
        pending:   task.status === 'pending' ? s.pending   - 1 : s.pending   + 1,
      }));
    }

    try {
      const { data } = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch {
      setTasks(snapshot);
      await fetchStats();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    const deletedTask = tasks.find((t) => t._id === id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setStats((prev) => ({
      ...prev,
      total: prev.total - 1,
      [deletedTask?.status === 'completed' ? 'completed' : 'pending']:
        prev[deletedTask?.status === 'completed' ? 'completed' : 'pending'] - 1,
    }));
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      await loadAll();
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────

  const openCreate = () => setModal({ open: true, mode: 'create', task: null });
  const openEdit   = (task) => setModal({ open: true, mode: 'edit', task });
  const closeModal = () => setModal({ open: false, mode: 'create', task: null });

  const handleModalSubmit = async (payload) => {
    if (modal.mode === 'edit') await handleUpdate(payload);
    else await handleCreate(payload);
  };

  // ── Render ────────────────────────────────────────────────────

  const firstName = user?.name?.split(' ')[0] || 'there';

  const filters = [
    { key: 'all',       label: 'All' },
    { key: 'pending',   label: 'Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {error && <div className="alert-error">{error}</div>}

        {/* Greeting + stats */}
        <div className="greeting">
          <div className="greeting-left">
            <h1 className="greeting-text">
              {getGreeting()},{' '}
              <span className="muted">
                you have {stats.pending} pending {stats.pending === 1 ? 'task' : 'tasks'}.
              </span>
            </h1>

            {/* Stat pills */}
            <div className="stat-pills">
              <div className="stat-pill">
                <span className="stat-pill-dot total" />
                {stats.total} Total
              </div>
              <div className="stat-pill">
                <span className="stat-pill-dot pending" />
                {stats.pending} Pending
              </div>
              <div className="stat-pill">
                <span className="stat-pill-dot completed" />
                {stats.completed} Completed
              </div>
            </div>
          </div>

          {/* Add task button */}
          <button className="btn btn-primary" onClick={openCreate} style={{ flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Task
          </button>
        </div>

        {/* Toolbar: filter tabs */}
        <div className="toolbar">
          <div className="filter-tabs" role="tablist">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                className={`filter-tab ${filter === key ? 'active' : ''}`}
                onClick={() => handleFilterChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '72px 0', color: 'var(--ink-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div className="spinner" style={{ borderColor: 'var(--ink-5)', borderTopColor: 'var(--ink-3)' }} />
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3>No tasks yet</h3>
            <p>
              {filter === 'all'
                ? 'Create your first task to get started.'
                : `No ${filter} tasks found.`}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary btn-sm" onClick={openCreate}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Task
              </button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal.open && (
        <AddTaskModal
          task={modal.task}
          onSubmit={handleModalSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}