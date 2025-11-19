import React, { useEffect, useState } from 'react';
import api from '../services/apiClient.js';

function DashboardPage({ auth, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('pending');

  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadProfile();
    loadTasks();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/profile/me');
      setProfile(response.data.user);
      setProfileName(response.data.user.name);
    } catch (err) {
      // keep dashboard usable even if profile fails
    }
  };

  const loadTasks = async () => {
    setTasksLoading(true);
    setTasksError('');
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchText) params.search = searchText;
      const response = await api.get('/tasks', { params });
      setTasks(response.data.tasks || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Could not load tasks';
      setTasksError(message);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileMessage('');

    if (!profileName) {
      setProfileMessage('Name is required');
      return;
    }

    try {
      const response = await api.put('/profile/me', { name: profileName });
      setProfile(response.data.user);
      setProfileMessage('Profile updated');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update profile';
      setProfileMessage(message);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    if (!newTitle) {
      setTasksError('Task title is required');
      return;
    }

    try {
      const response = await api.post('/tasks', {
        title: newTitle,
        description: newDescription,
        status: newStatus,
      });
      setNewTitle('');
      setNewDescription('');
      setNewStatus('pending');
      setTasks((prev) => [response.data.task, ...prev]);
      setTasksError('');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create task';
      setTasksError(message);
    }
  };

  const handleTaskStatusChange = async (task, status) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? response.data.task : t)));
    } catch (err) {
      // keep UI simple, skip toast here
    }
  };

  const handleTaskDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      // ignore for now
    }
  };

  const handleFiltersSubmit = (event) => {
    event.preventDefault();
    loadTasks();
  };

  const userName = profile?.name || auth?.user?.name || 'User';
  const userEmail = profile?.email || auth?.user?.email || '';

  return (
    <div className="app-shell">
      <div className="card card-wide">
        <div className="dashboard-layout">
          <header className="dashboard-header">
            <div>
              <h1 className="dashboard-title">PrimeTrade dashboard</h1>
              <div className="dashboard-user">
                Signed in as {userName}
                {userEmail ? ` · ${userEmail}` : ''}
              </div>
            </div>
            <button className="button button-ghost" type="button" onClick={onLogout}>
              Log out
            </button>
          </header>

          <div className="dashboard-columns">
            <section className="profile-box">
              <h2 className="dashboard-section-title">Profile</h2>
              <form onSubmit={handleProfileSave}>
                <div className="form-row">
                  <label className="label" htmlFor="profileName">Name</label>
                  <input
                    id="profileName"
                    type="text"
                    className="input"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={userEmail}
                    disabled
                  />
                </div>
                {profileMessage && (
                  <div className={profileMessage === 'Profile updated' ? 'success-text' : 'error-text'}>
                    {profileMessage}
                  </div>
                )}
                <div className="button-row">
                  <button className="button button-muted" type="submit">
                    Save profile
                  </button>
                </div>
              </form>
            </section>

            <section className="tasks-box">
              <h2 className="dashboard-section-title">Tasks</h2>

              <form className="tasks-toolbar" onSubmit={handleFiltersSubmit}>
                <input
                  className="input"
                  placeholder="Search by title or description"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <select
                  className="select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <button className="button button-muted" type="submit" disabled={tasksLoading}>
                  Apply
                </button>
              </form>

              <form onSubmit={handleCreateTask}>
                <div className="form-row">
                  <label className="label" htmlFor="newTitle">Title</label>
                  <input
                    id="newTitle"
                    type="text"
                    className="input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label className="label" htmlFor="newDescription">Description</label>
                  <textarea
                    id="newDescription"
                    className="textarea"
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label className="label" htmlFor="newStatus">Status</label>
                  <select
                    id="newStatus"
                    className="select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                {tasksError && <div className="error-text">{tasksError}</div>}
                <div className="button-row">
                  <button className="button button-primary" type="submit">
                    Add task
                  </button>
                </div>
              </form>

              <div style={{ marginTop: '14px' }}>
                {tasksLoading ? (
                  <div className="empty-state">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="empty-state">No tasks yet. Create your first one above.</div>
                ) : (
                  <table className="tasks-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>
                            <span className="chip">{task.status}</span>
                          </td>
                          <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="button-row">
                              {task.status !== 'pending' && (
                                <button
                                  type="button"
                                  className="button button-muted"
                                  onClick={() => handleTaskStatusChange(task, 'pending')}
                                >
                                  Set pending
                                </button>
                              )}
                              {task.status !== 'in_progress' && (
                                <button
                                  type="button"
                                  className="button button-muted"
                                  onClick={() => handleTaskStatusChange(task, 'in_progress')}
                                >
                                  In progress
                                </button>
                              )}
                              {task.status !== 'done' && (
                                <button
                                  type="button"
                                  className="button button-muted"
                                  onClick={() => handleTaskStatusChange(task, 'done')}
                                >
                                  Done
                                </button>
                              )}
                              <button
                                type="button"
                                className="button button-ghost"
                                onClick={() => handleTaskDelete(task)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
