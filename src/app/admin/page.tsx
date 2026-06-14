'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IProject } from '@/models/Project';
import { IProfile } from '@/models/Profile';
import { IContact } from '@/models/Contact';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Dashboard navigation states
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'messages'>('profile');
  
  // Dynamic collections
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Profile settings state
  const [profileData, setProfileData] = useState<any>({
    title: '',
    bio: '',
    subBio: '',
    projectsCount: '',
    solvedCount: '',
    educationYear: '',
    leetcodeUsername: '',
    leetcodeSolved: '',
    leetcodeRating: '',
    leetcodeMaxDifficulty: '',
    leetcodeStreak: '',
    gfgUsername: '',
    gfgSolved: '',
    gfgScore: '',
    gfgSkills: '',
    gfgRank: '',
    githubUsername: '',
    githubRepos: '',
    githubCommits: '',
    githubForks: '',
    githubContributions: ''
  });

  // Project Editor state (Add/Edit project modal/form)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'cpp',
    tags: '',
    codeLink: '',
    icon: 'fas fa-code',
    order: 0
  });

  // Loading indicator states
  const [profileLoading, setProfileLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Status message states
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Authentication redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch all database records on login success
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
      fetchProjects();
      fetchMessages();
    }
  }, [status]);

  // Show status timer
  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // --- API Requests ---
  
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setProfileData(data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // --- Profile Submit ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        showStatus('success', 'Profile information updated successfully!');
      } else {
        showStatus('error', 'Failed to update profile settings.');
      }
    } catch (err) {
      showStatus('error', 'Error connecting to the update API.');
    }
  };

  // --- Project CRUD Operations ---
  
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      tags: projectForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      let res;
      if (editingProjectId) {
        // Edit Mode
        res = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create Mode
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showStatus('success', editingProjectId ? 'Project updated!' : 'Project created successfully!');
        resetProjectForm();
        fetchProjects();
      } else {
        showStatus('error', 'Failed to submit project data.');
      }
    } catch (err) {
      showStatus('error', 'API error submitting project.');
    }
  };

  const handleEditClick = (project: any) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags.join(', '),
      codeLink: project.codeLink,
      icon: project.icon || 'fas fa-code',
      order: project.order || 0
    });
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showStatus('success', 'Project deleted.');
        fetchProjects();
      } else {
        showStatus('error', 'Failed to delete project.');
      }
    } catch (err) {
      showStatus('error', 'API error deleting project.');
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      description: '',
      category: 'cpp',
      tags: '',
      codeLink: '',
      icon: 'fas fa-code',
      order: 0
    });
  };

  // --- Auth Check Loading ---
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--accent-cyan)' }}>
        <div><i className="fas fa-spinner fa-spin fa-2x"></i><p style={{ marginTop: '1rem' }}>Verifying Admin credentials...</p></div>
      </div>
    );
  }

  // Render view only if authenticated
  if (status !== 'authenticated') return null;

  return (
    <div className="section" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-container">
          <a href="/" className="logo">
            <span>&lt;</span>Abhishek<span>/&gt;</span> <span style={{ fontSize: '0.85rem', background: 'var(--accent-gradient)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#fff', marginLeft: '0.5rem' }}>Admin</span>
          </a>
          <div className="nav-controls">
            <button className="btn btn-secondary" onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* BACKGROUND GLOWS */}
      <div className="bg-glow-1" style={{ opacity: 0.2 }}></div>
      <div className="bg-glow-2" style={{ opacity: 0.2 }}></div>

      <div className="container admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Panel</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Log in email: {session?.user?.email}</p>
          </div>
          {statusMsg && (
            <div className={`form-status ${statusMsg.type}`} style={{ display: 'block', margin: 0 }}>
              {statusMsg.text}
            </div>
          )}
        </div>

        <div className="admin-grid">
          {/* SIDEBAR TABS */}
          <aside className="glass-card admin-sidebar">
            <h3>Management</h3>
            <div className="admin-nav-list">
              <button 
                className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="fas fa-folder-open"></i> CRUD Projects
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                <i className="fas fa-inbox"></i> Messages ({messages.length})
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1.5rem' }}>
              <a href="/" className="project-link-btn" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-external-link-alt"></i> View Live Site
              </a>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="glass-card admin-content-area">
            
            {/* TABS 1: EDIT PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="admin-section-title">Edit Profile Information</h2>
                {profileLoading ? (
                  <p><i className="fas fa-spinner fa-spin"></i> Loading data...</p>
                ) : (
                  <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Professional Title</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.title}
                          onChange={e => setProfileData({...profileData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>B.Tech Education Year</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.educationYear}
                          onChange={e => setProfileData({...profileData, educationYear: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Main Bio</label>
                      <textarea 
                        className="form-input" style={{ minHeight: '100px' }}
                        value={profileData.bio}
                        onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Sub Bio / Focus Statement</label>
                      <input 
                        type="text" className="form-input" 
                        value={profileData.subBio}
                        onChange={e => setProfileData({...profileData, subBio: e.target.value})}
                      />
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Projects Stat Indicator (e.g. 15+)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.projectsCount}
                          onChange={e => setProfileData({...profileData, projectsCount: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Problems Solved Stat Indicator (e.g. 500+)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.solvedCount}
                          onChange={e => setProfileData({...profileData, solvedCount: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Stats details grids */}
                    <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                      LeetCode Metrics
                    </h3>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Username</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.leetcodeUsername}
                          onChange={e => setProfileData({...profileData, leetcodeUsername: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Solved Counts</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.leetcodeSolved}
                          onChange={e => setProfileData({...profileData, leetcodeSolved: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Contest Standing (e.g. Top 15%)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.leetcodeRating}
                          onChange={e => setProfileData({...profileData, leetcodeRating: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Streak (e.g. Active)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.leetcodeStreak}
                          onChange={e => setProfileData({...profileData, leetcodeStreak: e.target.value})}
                        />
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                      GeeksForGeeks Metrics
                    </h3>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Username</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.gfgUsername}
                          onChange={e => setProfileData({...profileData, gfgUsername: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Solved Counts</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.gfgSolved}
                          onChange={e => setProfileData({...profileData, gfgSolved: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Coding Score</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.gfgScore}
                          onChange={e => setProfileData({...profileData, gfgScore: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Rank Status (e.g. Rank #24)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.gfgRank}
                          onChange={e => setProfileData({...profileData, gfgRank: e.target.value})}
                        />
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                      GitHub Metrics
                    </h3>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Username</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.githubUsername}
                          onChange={e => setProfileData({...profileData, githubUsername: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Public Repos count</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.githubRepos}
                          onChange={e => setProfileData({...profileData, githubRepos: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label>Commit Indicators (e.g. 300+)</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.githubCommits}
                          onChange={e => setProfileData({...profileData, githubCommits: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Forks count</label>
                        <input 
                          type="text" className="form-input" 
                          value={profileData.githubForks}
                          onChange={e => setProfileData({...profileData, githubForks: e.target.value})}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                      Save Profile Changes
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TABS 2: PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div>
                <h2 className="admin-section-title">
                  {editingProjectId ? 'Edit Project' : 'Add New Project'}
                  {editingProjectId && (
                    <button className="btn btn-secondary" onClick={resetProjectForm} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                      Cancel Edit
                    </button>
                  )}
                </h2>

                <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem' }}>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Project Title</label>
                      <input 
                        type="text" className="form-input" required placeholder="Mini Compiler"
                        value={projectForm.title}
                        onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        className="form-input" style={{ background: 'var(--bg-primary)' }}
                        value={projectForm.category}
                        onChange={e => setProjectForm({...projectForm, category: e.target.value as any})}
                      >
                        <option value="cpp">C++ Project</option>
                        <option value="web">Web Dev Project</option>
                        <option value="python">Python / ML Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      className="form-input" required placeholder="Short description..." style={{ minHeight: '80px' }}
                      value={projectForm.description}
                      onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>GitHub/Code Link</label>
                      <input 
                        type="url" className="form-input" required placeholder="https://github.com/..."
                        value={projectForm.codeLink}
                        onChange={e => setProjectForm({...projectForm, codeLink: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Display Tags (Comma separated)</label>
                      <input 
                        type="text" className="form-input" placeholder="C++, Compilers, Lex"
                        value={projectForm.tags}
                        onChange={e => setProjectForm({...projectForm, tags: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>FontAwesome Icon Class</label>
                      <input 
                        type="text" className="form-input" placeholder="fas fa-terminal"
                        value={projectForm.icon}
                        onChange={e => setProjectForm({...projectForm, icon: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Sort Order Index</label>
                      <input 
                        type="number" className="form-input"
                        value={projectForm.order}
                        onChange={e => setProjectForm({...projectForm, order: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {editingProjectId ? 'Update Project Info' : 'Create Project'}
                  </button>
                </form>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Existing Projects</h3>
                {projectsLoading ? (
                  <p><i className="fas fa-spinner fa-spin"></i> Syncing projects list...</p>
                ) : projects.length === 0 ? (
                  <p>No projects stored in DB. Seeds will populate on home page visits.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Tags</th>
                          <th>Order</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project: any) => (
                          <tr key={project._id}>
                            <td style={{ fontWeight: 600 }}>{project.title}</td>
                            <td><span className="badge-tag">{project.category}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {project.tags?.map((t: string, idx: number) => (
                                  <span key={idx} style={{ fontSize: '0.7rem', opacity: 0.7 }} className="badge-tag">{t}</span>
                                ))}
                              </div>
                            </td>
                            <td>{project.order}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="action-btn btn-edit" onClick={() => handleEditClick(project)} title="Edit Project">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="action-btn btn-delete" onClick={() => handleDeleteClick(project._id)} title="Delete Project">
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TABS 3: MESSAGES LIST */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="admin-section-title">Submitted Messages</h2>
                {messagesLoading ? (
                  <p><i className="fas fa-spinner fa-spin"></i> Fetching messages...</p>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <i className="fas fa-inbox fa-3x" style={{ marginBottom: '1rem' }}></i>
                    <p>No messages received yet.</p>
                  </div>
                ) : (
                  <div>
                    {messages.map((msg: any) => (
                      <div key={msg._id} className="glass-card message-card">
                        <div className="message-header">
                          <div>
                            <span className="message-sender">{msg.name}</span>
                            <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>•</span>
                            <a href={`mailto:${msg.email}`} className="message-email">{msg.email}</a>
                          </div>
                          <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="message-body">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
