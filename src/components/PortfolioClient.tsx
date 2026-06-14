'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IProject, IProfile } from '@/types';

interface PortfolioClientProps {
  initialProfile: IProfile;
  initialProjects: IProject[];
}

export function PortfolioClient({ initialProfile, initialProjects }: PortfolioClientProps) {
  // --- States ---
  const [profile, setProfile] = useState<IProfile>(initialProfile);
  const [projects, setProjects] = useState<IProject[]>(initialProjects);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [projectFilter, setProjectFilter] = useState('all');
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Typewriter States
  const [typedText, setTypedText] = useState('');
  const typewriterIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typewriterWords = ["Software Engineer", "Problem Solver", "Competitive Programmer", "Full-Stack Developer"];

  // --- Theme Toggle Logic ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // --- Dynamic Typewriter Hook ---
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    const typeEffect = () => {
      const currentWord = typewriterWords[typewriterIndex.current];
      
      if (isDeleting.current) {
        setTypedText(currentWord.substring(0, charIndex.current - 1));
        charIndex.current--;
      } else {
        setTypedText(currentWord.substring(0, charIndex.current + 1));
        charIndex.current++;
      }

      let speed = isDeleting.current ? 50 : 150;

      if (!isDeleting.current && charIndex.current === currentWord.length) {
        isDeleting.current = true;
        speed = 2000; // Pause at full word
      } else if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        typewriterIndex.current = (typewriterIndex.current + 1) % typewriterWords.length;
        speed = 500; // Pause before next word
      }

      typingTimer = setTimeout(typeEffect, speed);
    };

    typingTimer = setTimeout(typeEffect, 1000);
    return () => clearTimeout(typingTimer);
  }, []);

  // --- Active Scroll Observer ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'dashboard', 'projects', 'contact'];
      const scrollY = window.pageYOffset;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const sectionHeight = element.offsetHeight;
          const sectionTop = element.offsetTop - 120;
          
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Contact Form Submission ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setFormSubmitting(true);
    setFormStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! I will get back to you soon.',
        });
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      } else {
        setFormStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (err) {
      setFormStatus({
        type: 'error',
        message: 'Unable to send message. Please email me directly.',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // --- Filtering Projects ---
  const filteredProjects = projects.filter(project => {
    if (projectFilter === 'all') return true;
    return project.category === projectFilter;
  });

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-container">
          <a href="#home" className="logo">
            <span>&lt;</span>Abhishek<span>/&gt;</span>
          </a>
          
          <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#dashboard" 
                className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Coding Stats
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="nav-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <i className="fas fa-moon"></i>
              <i className="fas fa-sun"></i>
            </button>
            <div className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
          </div>
        </div>
      </nav>

      {/* BACKGROUND GLOWS */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-sub">
              <i className="fas fa-terminal"></i> hello_world.cpp
            </div>
            <h1 className="hero-title">
              Hi, I'm <br /><span>Abhishek Singh Rawat</span>
            </h1>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1.5rem', height: '50px' }}>
              I am a <span style={{ color: 'var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)', paddingRight: '5px' }}>{typedText}</span>
            </h2>
            <p className="hero-desc">
              I'm a B.Tech student passionate about crafting sleek web applications, solving complex algorithms, and mastering system-level C++ development. Fueled by curiosity and a zest for building solutions that work.
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                View Projects <i className="fas fa-arrow-right"></i>
              </a>
              <a href="#contact" className="btn btn-secondary">
                Let's Talk <i className="far fa-envelope"></i>
              </a>
            </div>
            <div className="hero-socials">
              <span>CONNECT WITH ME:</span>
              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/abhishek-singh-rawat-dev" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://x.com/abhishek1111si?s=11" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="mailto:abhishekpersona1402@gmail.com" className="social-icon"><i className="fas fa-envelope"></i></a>
            </div>
          </div>
          
          <div className="hero-art-container">
            <div className="tech-sphere-wrapper">
              <div className="tech-sphere">
                <div className="sphere-core"></div>
              </div>
              <div className="floating-icon fi-1"><i className="devicon-cplusplus-line"></i></div>
              <div className="floating-icon fi-2"><i className="fas fa-brain"></i></div>
              <div className="floating-icon fi-3"><i className="devicon-javascript-plain"></i></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">&lt;about_me&gt;</span>
            <h2 className="section-title">About My Journey</h2>
          </div>
          
          <div className="about-grid">
            <div className="about-img-wrapper">
              <div className="about-terminal">
                <div className="terminal-header">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                  <span className="terminal-title">profile.sh</span>
                </div>
                <div className="terminal-body">
                  <div className="term-line">
                    <span className="term-prompt">visitor@abhishek:~$</span> <span className="term-cmd">whoami</span>
                  </div>
                  <div className="term-out">
                    Abhishek Singh Rawat<br />
                    B.Tech Student & {profile.title}<br />
                    Based in India
                  </div>
                  <div className="term-line" style={{ marginTop: '1rem' }}>
                    <span className="term-prompt">visitor@abhishek:~$</span> <span className="term-cmd">cat skills.txt</span>
                  </div>
                  <div className="term-out">
                    - C++ System & Algorithms<br />
                    - Web Application Architecture<br />
                    - Data Structures & OOPs
                  </div>
                  <div className="term-line" style={{ marginTop: '1rem' }}>
                    <span className="term-prompt">visitor@abhishek:~$</span> <span className="term-cmd">cat preferences.json</span>
                  </div>
                  <div className="term-out">
                    {"{"}<br />
                    &nbsp;&nbsp;&quot;editor&quot;: &quot;VS Code / CLion&quot;,<br />
                    &nbsp;&nbsp;&quot;motto&quot;: &quot;Write clean algorithms&quot;,<br />
                    &nbsp;&nbsp;&quot;shows&quot;: [&quot;Drama Twist Series&quot;]<br />
                    {"}"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-details">
              <h3>{profile.title} | Solvers & Developers</h3>
              <p>{profile.bio}</p>
              {profile.subBio && <p>{profile.subBio}</p>}
              
              <div className="about-stats">
                <div className="glass-card stat-item">
                  <div className="stat-num">{profile.projectsCount}</div>
                  <div className="stat-label">Projects Built</div>
                </div>
                <div className="glass-card stat-item">
                  <div className="stat-num">{profile.solvedCount}</div>
                  <div className="stat-label">DSA Solved</div>
                </div>
                <div className="glass-card stat-item">
                  <div className="stat-num">{profile.educationYear}</div>
                  <div className="stat-label">Year B.Tech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className="section" id="skills" style={{ background: 'var(--bg-secondary)', transition: 'background var(--transition-speed)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">&lt;skills_toolkit&gt;</span>
            <h2 className="section-title">My Tech Stack</h2>
          </div>
          
          <div className="skills-grid">
            {/* Languages */}
            <div className="glass-card skills-category">
              <h3><i className="fas fa-code"></i> Languages</h3>
              <div className="skills-list">
                <div className="skill-tag"><i className="devicon-cplusplus-plain colored"></i> C++</div>
                <div className="skill-tag"><i className="devicon-python-plain colored"></i> Python</div>
                <div className="skill-tag"><i className="devicon-javascript-plain colored"></i> JavaScript</div>
                <div className="skill-tag"><i className="devicon-typescript-plain colored"></i> TypeScript</div>
                <div className="skill-tag"><i className="devicon-c-plain colored"></i> C Language</div>
              </div>
            </div>
            
            {/* Web Development */}
            <div className="glass-card skills-category">
              <h3><i className="fas fa-laptop-code"></i> Web Dev</h3>
              <div className="skills-list">
                <div className="skill-tag"><i className="devicon-react-original colored"></i> React.js</div>
                <div className="skill-tag"><i className="devicon-nextjs-plain colored"></i> Next.js</div>
                <div className="skill-tag"><i className="devicon-nodejs-plain colored"></i> Node.js</div>
                <div className="skill-tag"><i className="devicon-express-original colored"></i> Express</div>
                <div className="skill-tag"><i className="devicon-html5-plain colored"></i> HTML5 & CSS3</div>
              </div>
            </div>
            
            {/* Tools & Databases */}
            <div className="glass-card skills-category">
              <h3><i className="fas fa-cubes"></i> DB & Tools</h3>
              <div className="skills-list">
                <div className="skill-tag"><i className="devicon-mongodb-plain colored"></i> MongoDB</div>
                <div className="skill-tag"><i className="devicon-postgresql-plain colored"></i> PostgreSQL</div>
                <div className="skill-tag"><i className="devicon-git-plain colored"></i> Git & GitHub</div>
                <div className="skill-tag"><i className="devicon-docker-plain colored"></i> Docker</div>
                <div className="skill-tag"><i className="fas fa-toolbox"></i> VS Code / CLion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CODING STATS */}
      <section className="section" id="dashboard">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">&lt;metrics_dashboard&gt;</span>
            <h2 className="section-title">Competitive Programming Profile</h2>
          </div>
          
          <div className="dashboard-grid">
            {/* LeetCode */}
            <div className="glass-card profile-card">
              <div className="profile-card-header">
                <div className="profile-info">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f89c1e' }}>LEETCODE</span>
                  <h3>{profile.leetcodeUsername}</h3>
                </div>
                <div className="profile-logo logo-leetcode">
                  <i className="fas fa-code"></i>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="p-stat">
                  <div className="p-stat-val">{profile.leetcodeSolved}</div>
                  <div className="p-stat-lbl">Solved</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.leetcodeRating}</div>
                  <div className="p-stat-lbl">Rating</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.leetcodeMaxDifficulty}</div>
                  <div className="p-stat-lbl">Difficulty</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.leetcodeStreak}</div>
                  <div className="p-stat-lbl">Streak</div>
                </div>
              </div>
              <a href={`https://leetcode.com/u/${profile.leetcodeUsername}/`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary profile-link">
                LeetCode Profile <i className="fas fa-external-link-alt"></i>
              </a>
            </div>

            {/* GeeksForGeeks */}
            <div className="glass-card profile-card">
              <div className="profile-card-header">
                <div className="profile-info">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#2f8e46' }}>GEEKSFORGEEKS</span>
                  <h3>{profile.gfgUsername}</h3>
                </div>
                <div className="profile-logo logo-gfg">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="p-stat">
                  <div className="p-stat-val">{profile.gfgSolved}</div>
                  <div className="p-stat-lbl">Solved</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.gfgScore}</div>
                  <div className="p-stat-lbl">Score</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.gfgSkills}</div>
                  <div className="p-stat-lbl">Focus</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.gfgRank}</div>
                  <div className="p-stat-lbl">Standing</div>
                </div>
              </div>
              <a href={`https://www.geeksforgeeks.org/profile/${profile.gfgUsername}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary profile-link">
                GFG Profile <i className="fas fa-external-link-alt"></i>
              </a>
            </div>

            {/* GitHub */}
            <div className="glass-card profile-card">
              <div className="profile-card-header">
                <div className="profile-info">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>GITHUB</span>
                  <h3>{profile.githubUsername}</h3>
                </div>
                <div className="profile-logo logo-github">
                  <i className="fab fa-github"></i>
                </div>
              </div>
              <div className="profile-stats-grid">
                <div className="p-stat">
                  <div className="p-stat-val">{profile.githubRepos}</div>
                  <div className="p-stat-lbl">Repos</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.githubCommits}</div>
                  <div className="p-stat-lbl">Commits</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.githubForks}</div>
                  <div className="p-stat-lbl">Forks</div>
                </div>
                <div className="p-stat">
                  <div className="p-stat-val">{profile.githubContributions}</div>
                  <div className="p-stat-lbl">Contributions</div>
                </div>
              </div>
              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary profile-link">
                GitHub Profile <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="section" id="projects" style={{ background: 'var(--bg-secondary)', transition: 'background var(--transition-speed)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">&lt;projects_showcase&gt;</span>
            <h2 className="section-title">Portfolio Projects</h2>
          </div>
          
          <div className="projects-filter">
            <button className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All</button>
            <button className={`filter-btn ${projectFilter === 'cpp' ? 'active' : ''}`} onClick={() => setProjectFilter('cpp')}>C++</button>
            <button className={`filter-btn ${projectFilter === 'web' ? 'active' : ''}`} onClick={() => setProjectFilter('web')}>Web Dev</button>
            <button className={`filter-btn ${projectFilter === 'python' ? 'active' : ''}`} onClick={() => setProjectFilter('python')}>Python / ML</button>
          </div>
          
          <div className="projects-grid">
            {filteredProjects.map((project, idx) => (
              <div key={idx} className="project-card-wrapper">
                <div className="glass-card project-card">
                  <div className="project-icon"><i className={project.icon}></i></div>
                  <h3>{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="project-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="project-links">
                    <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                      <i className="fab fa-github"></i> Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">&lt;contact_inbox&gt;</span>
            <h2 className="section-title">Let's Connect</h2>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="glass-card contact-method">
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-details">
                  <h4>Email Direct</h4>
                  <p><a href="mailto:abhishekpersona1402@gmail.com">abhishekpersona1402@gmail.com</a></p>
                </div>
              </div>
              
              <div className="glass-card contact-method">
                <div className="contact-icon"><i className="fab fa-linkedin-in"></i></div>
                <div className="contact-details">
                  <h4>LinkedIn Connection</h4>
                  <p><a href="https://www.linkedin.com/in/abhishek-singh-rawat-dev" target="_blank" rel="noopener noreferrer">abhishek-singh-rawat-dev</a></p>
                </div>
              </div>
              
              <div className="glass-card contact-method">
                <div className="contact-icon"><i className="fab fa-twitter"></i></div>
                <div className="contact-details">
                  <h4>Twitter / X Profile</h4>
                  <p><a href="https://x.com/abhishek1111si?s=11" target="_blank" rel="noopener noreferrer">@abhishek1111si</a></p>
                </div>
              </div>
            </div>
            
            <div className="glass-card contact-form-container">
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      placeholder="John Doe" 
                      className="form-input"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      placeholder="john@example.com" 
                      className="form-input"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    required 
                    placeholder="Hi Abhishek, I would love to collaborate..." 
                    className="form-input"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  ></textarea>
                </div>
                {formStatus && (
                  <div className={`form-status ${formStatus.type}`}>
                    <i className={formStatus.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}></i> {formStatus.message}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      Send Message <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-container">
          <div className="footer-logo">
            <a href="#home" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
              &lt;Abhishek/&gt;
            </a>
          </div>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Abhishek Singh Rawat. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
export default PortfolioClient;
