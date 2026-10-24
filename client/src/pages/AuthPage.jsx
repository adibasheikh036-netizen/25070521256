import {
  ArrowRight, CalendarDays, CircleAlert, GraduationCap, KeyRound, LoaderCircle, Lock, Mail,
  ShieldCheck, Sparkles, TrendingUp, User, Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PasswordField, SelectField, TextField } from '../components/FormFields.jsx';
import Logo from '../components/Logo.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import ServerStatus from '../components/ServerStatus.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';

const COURSES = [
  'B.Tech – Computer Science',
  'B.Tech – Electronics',
  'BCA',
  'MCA',
  'B.Sc – Information Technology',
  'BBA',
  'MBA',
  'B.Com',
  'Other',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Same rules as the server, so most mistakes are caught before sending
function validate(form, isSignup) {
  const errors = {};
  if (isSignup && form.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';

  if (!isSignup) {
    if (!form.password) errors.password = 'Please enter your password.';
    return errors;
  }

  if (!form.course) errors.course = 'Please choose your course.';
  if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (!form.confirm) errors.confirm = 'Please confirm your password.';
  else if (form.confirm !== form.password) errors.confirm = 'Passwords do not match.';
  return errors;
}

function Showcase() {
  return (
    <aside className="showcase">
      <Logo light />

      <div className="showcase-body">
        <span className="eyebrow">
          <Sparkles size={14} /> Student Portal
        </span>
        <h1>
          Your campus life,
          <br />
          <span className="warm-text">beautifully organised.</span>
        </h1>
        <p>Classes, courses and progress, all in one calm space made for students.</p>

        <div className="float-stage" aria-hidden="true">
          <div className="float-card fc-1">
            <span className="fc-icon"><TrendingUp size={18} /></span>
            <span>
              <small>Attendance</small>
              <strong>92%</strong>
            </span>
            <span className="fc-badge">+4%</span>
          </div>

          <div className="float-card fc-2">
            <span className="fc-icon"><CalendarDays size={18} /></span>
            <span>
              <small>Next class · 10:30 AM</small>
              <strong>Data Structures</strong>
            </span>
          </div>

          <div className="float-card fc-3">
            <span className="avatars">
              <i style={{ '--c': '#f59e0b' }}>A</i>
              <i style={{ '--c': '#10b981' }}>R</i>
              <i style={{ '--c': '#06b6d4' }}>S</i>
              <i style={{ '--c': '#f43f5e' }}>+</i>
            </span>
            <span>
              <small>Your classmates</small>
              <strong>are already here</strong>
            </span>
          </div>
        </div>
      </div>

      <ul className="showcase-points">
        <li><ShieldCheck size={18} /> Passwords encrypted with bcrypt</li>
        <li><Zap size={18} /> Instant access to your dashboard</li>
      </ul>
    </aside>
  );
}

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', course: '', password: '', confirm: '' });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    document.title = `${isSignup ? 'Create account' : 'Sign in'} · Adiba Sheikh Portal`;
    // The email is kept when switching tabs, the passwords are not
    setForm((current) => ({ ...current, password: '', confirm: '' }));
    setErrors({});
    setFormError('');
  }, [isSignup]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors(({ [field]: _removed, ...rest }) => rest);
  };

  function fail(fieldErrors, message = '') {
    setErrors(fieldErrors);
    setFormError(message);
    setShake(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form, isSignup);
    if (Object.keys(found).length) return fail(found);

    setSubmitting(true);
    setFormError('');
    try {
      if (isSignup) {
        await signup({ name: form.name, email: form.email, course: form.course, password: form.password });
      } else {
        await login(form.email, form.password, remember);
      }
      // Success: the router moves to the dashboard by itself
    } catch (err) {
      fail(err.fields || {}, err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="aurora" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="grid-lines" />
      </div>

      <div className="auth-shell">
        <Showcase />

        <main
          className={`auth-panel ${shake ? 'shake' : ''}`}
          onAnimationEnd={(e) => e.target === e.currentTarget && setShake(false)}
        >
          <div className="mobile-brand">
            <Logo />
          </div>

          <div className={`segmented ${isSignup ? 'is-right' : ''}`} role="tablist">
            <span className="segmented-thumb" />
            <Link to="/login" role="tab" aria-selected={!isSignup} className={!isSignup ? 'active' : ''}>
              Sign in
            </Link>
            <Link to="/signup" role="tab" aria-selected={isSignup} className={isSignup ? 'active' : ''}>
              Sign up
            </Link>
          </div>

          <header className="auth-header" key={`header-${mode}`}>
            <h2>
              {isSignup ? 'Create your account' : 'Welcome back'}{' '}
              <span className="wave">{isSignup ? '✨' : '👋'}</span>
            </h2>
            <p>
              {isSignup
                ? 'Join the student portal in less than a minute.'
                : 'Sign in to continue to your student dashboard.'}
            </p>
          </header>

          {formError && (
            <div className="alert" role="alert">
              <CircleAlert size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate key={`form-${mode}`}>
            {isSignup && (
              <TextField
                id="name"
                label="Full name"
                icon={User}
                placeholder="e.g. Adiba Sheikh"
                autoComplete="name"
                value={form.name}
                onChange={update('name')}
                error={errors.name}
              />
            )}

            <TextField
              id="email"
              label="Email address"
              icon={Mail}
              type="email"
              placeholder="e.g. adiba.sheikh@gmail.com"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
            />

            {isSignup && (
              <SelectField
                id="course"
                label="Course"
                icon={GraduationCap}
                placeholder="Select your course"
                options={COURSES}
                value={form.course}
                onChange={update('course')}
                error={errors.course}
              />
            )}

            <div className={isSignup ? 'field-row' : ''}>
              <PasswordField
                id="password"
                label="Password"
                icon={Lock}
                placeholder={isSignup ? '6+ characters' : 'Enter your password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={update('password')}
                error={errors.password}
              />
              {isSignup && (
                <PasswordField
                  id="confirm"
                  label="Confirm password"
                  icon={KeyRound}
                  placeholder="Type it again"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={update('confirm')}
                  error={errors.confirm}
                />
              )}
            </div>

            {isSignup && <PasswordStrength password={form.password} />}

            {!isSignup && (
              <label className="checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="checkbox-box" />
                Keep me signed in
              </label>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="spin" size={20} /> Please wait…
                </>
              ) : (
                <>
                  {isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link>
          </p>

          <ServerStatus />
        </main>
      </div>
    </div>
  );
}
