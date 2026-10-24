import {
  Binary, CalendarCheck, CircleCheck, Clock, CodeXml, Database, GraduationCap, LayoutDashboard, LogIn,
  LogOut, MapPin, Megaphone, Menu, Moon, Sigma, Sparkles, Sun, Users, X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { courses, notices, schedule } from '../data/sample.js';
import {
  clockLabel, dayLabel, daysSince, firstName, formatDate, formatToday, greetingFor, initials, timeLabel,
  toMinutes,
} from '../utils/format.js';
import '../styles/dashboard.css';

const COURSE_ICONS = { binary: Binary, database: Database, code: CodeXml, sigma: Sigma };

const THEME_KEY = 'portal.theme';

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  useEffect(() => localStorage.setItem(THEME_KEY, theme), [theme]);
  return [theme, () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))];
}

// Marks each class as done, live or up next using the current time
function withStatus(items) {
  const now = new Date().getHours() * 60 + new Date().getMinutes();
  let nextFound = false;
  return items.map((item) => {
    const start = toMinutes(item.start);
    const end = toMinutes(item.end);
    if (end <= now) return { ...item, status: 'done' };
    if (start <= now) return { ...item, status: 'live' };
    if (!nextFound) {
      nextFound = true;
      return { ...item, status: 'next' };
    }
    return { ...item, status: 'later' };
  });
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span className="toast-icon"><CircleCheck size={20} /></span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.text}</p>
      </div>
      <button type="button" className="icon-btn ghost" onClick={onClose} aria-label="Close message">
        <X size={16} />
      </button>
      <span className="toast-timer" />
    </div>
  );
}

function Sidebar({ open, onClose, onLogout }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <Logo />
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        <span className="nav-caption">Menu</span>
        <a href="#top" className="active" aria-current="page" onClick={onClose}>
          <LayoutDashboard size={19} />
          Dashboard
        </a>
      </nav>

      <div className="sidebar-card">
        <span className="sidebar-card-icon"><Sparkles size={18} /></span>
        <strong>Exams are coming</strong>
        <p>Mid-terms begin on 10 November. Plan your week from the schedule.</p>
        <a href="#schedule" onClick={onClose}>Open schedule</a>
      </div>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        <LogOut size={19} />
        Sign out
      </button>
    </aside>
  );
}

function StatCard({ label, value, note, icon: Icon, tone }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <span className="stat-icon"><Icon size={22} /></span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-note">{note}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, stats, greeting, clearGreeting, logout } = useAuth();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  const first = firstName(user.name);

  useEffect(() => {
    document.title = 'Dashboard · Adiba Sheikh Portal';
  }, []);

  // A friendly message right after signing up or signing in
  useEffect(() => {
    if (!greeting) return;
    setToast(
      greeting === 'signup'
        ? { title: 'Account created 🎉', text: `Welcome aboard, ${first}! Your portal is ready.` }
        : { title: 'Signed in successfully', text: `Good to see you again, ${first}.` },
    );
    clearGreeting();
  }, [greeting, first, clearGreeting]);

  const todaysClasses = withStatus(schedule);
  const averageProgress = Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

  const statCards = [
    { label: 'Total sign-ins', value: user.loginCount, note: 'Counted by the server', icon: LogIn, tone: 'violet' },
    { label: 'Days with us', value: daysSince(user.createdAt), note: `Joined ${formatDate(user.createdAt)}`, icon: CalendarCheck, tone: 'pink' },
    { label: 'Students joined', value: stats?.totalStudents ?? '…', note: 'Accounts in MongoDB', icon: Users, tone: 'cyan' },
    { label: 'Last sign-in', value: timeLabel(user.lastLoginAt), note: dayLabel(user.lastLoginAt), icon: Clock, tone: 'amber' },
  ];

  const profileRows = [
    ['Full name', user.name],
    ['Email', user.email],
    ['Course', user.course || 'Not set'],
    ['Member since', formatDate(user.createdAt)],
    ['Student ID', `AS-${user.id.slice(-6).toUpperCase()}`],
  ];

  return (
    <div className="dash" data-theme={theme}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={logout} />
      {menuOpen && <button type="button" className="backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <div className="dash-main">
        <header className="topbar">
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <div className="topbar-title">
            <h2>Dashboard</h2>
            <p>{formatToday()}</p>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <div className="user-chip">
              <span className="avatar">{initials(user.name)}</span>
              <span className="user-chip-text">
                <strong>{user.name}</strong>
                <small>{user.course || 'Student'}</small>
              </span>
            </div>
          </div>
        </header>

        <main className="dash-content">
          <section className="hero">
            <div className="hero-text">
              <span className="hero-pill"><Sparkles size={14} /> {greetingFor()}</span>
              <h1>
                Hello, {first}! <span className="wave">👋</span>
              </h1>
              <p>
                You have <b>{schedule.length} classes</b> today and <b>{notices.length} new notices</b>.
                Keep up the great work this week!
              </p>
              <div className="hero-chips">
                <span><GraduationCap size={16} /> {user.course || 'Course not set'}</span>
                <span><CalendarCheck size={16} /> Member since {formatDate(user.createdAt)}</span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <span className="orbit orbit-1"><i /></span>
              <span className="orbit orbit-2"><i /></span>
              <span className="hero-badge"><GraduationCap size={54} strokeWidth={1.6} /></span>
            </div>
          </section>

          <section className="stats" aria-label="Your account in numbers">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </section>

          <div className="grid-2">
            <section className="card">
              <div className="card-head">
                <div>
                  <h3>My courses</h3>
                  <p>Semester progress · {averageProgress}% average</p>
                </div>
                <span className="chip">{courses.length} active</span>
              </div>
              <div className="course-grid">
                {courses.map((course) => {
                  const Icon = COURSE_ICONS[course.icon];
                  return (
                    <article key={course.code} className={`course tone-${course.tone}`}>
                      <div className="course-top">
                        <span className="course-icon"><Icon size={20} /></span>
                        <span className="course-code">{course.code}</span>
                      </div>
                      <h4>{course.title}</h4>
                      <p>{course.teacher}</p>
                      <div className="progress">
                        <span style={{ width: `${course.progress}%` }} />
                      </div>
                      <div className="course-foot">
                        <span>Progress</span>
                        <b>{course.progress}%</b>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="card" id="schedule">
              <div className="card-head">
                <div>
                  <h3>Today&apos;s schedule</h3>
                  <p>{formatToday()}</p>
                </div>
                <span className="chip">{schedule.length} classes</span>
              </div>
              <ol className="timeline">
                {todaysClasses.map((item) => (
                  <li key={item.start} className={`slot is-${item.status}`}>
                    <span className="slot-time">{clockLabel(item.start)}</span>
                    <span className="slot-dot" />
                    <div className="slot-body">
                      <div className="slot-title">
                        <strong>{item.title}</strong>
                        {item.status === 'live' && <span className="badge live">Live now</span>}
                        {item.status === 'next' && <span className="badge next">Up next</span>}
                        {item.status === 'done' && <span className="badge done">Done</span>}
                      </div>
                      <p>
                        <MapPin size={14} /> {item.place} · {item.type} · until {clockLabel(item.end)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="grid-2 grid-2-flip">
            <section className="card profile-card">
              <div className="profile-cover" />
              <div className="profile-main">
                <span className="avatar avatar-lg">{initials(user.name)}</span>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <dl className="profile-list">
                {profileRows.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="btn-soft" onClick={logout}>
                <LogOut size={18} /> Sign out
              </button>
            </section>

            <section className="card">
              <div className="card-head">
                <div>
                  <h3>Notice board</h3>
                  <p>Latest updates from campus</p>
                </div>
                <span className="chip"><Megaphone size={14} /> {notices.length} new</span>
              </div>
              <ul className="notices">
                {notices.map((notice) => (
                  <li key={notice.title} className={`tone-${notice.tone}`}>
                    <span className="notice-mark" />
                    <div>
                      <strong>{notice.title}</strong>
                      <p>
                        <span className="notice-tag">{notice.tag}</span> {notice.meta}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <footer className="dash-footer">
            Adiba Sheikh · Student Portal · React + Node.js + Express + MongoDB
          </footer>
        </main>
      </div>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
