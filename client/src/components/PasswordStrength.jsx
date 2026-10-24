const LEVELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function scorePassword(password) {
  if (!password) return 0;
  if (password.length < 6) return 1;

  let score = 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 10) score += 1;
  return Math.min(score, 4);
}

export default function PasswordStrength({ password }) {
  const score = scorePassword(password);

  return (
    <div className={`strength strength-${score}`} aria-live="polite">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={step <= score ? 'on' : ''} />
        ))}
      </div>
      <span className="strength-label">
        {score ? `${LEVELS[score]} password` : 'Use 6+ characters with a number or symbol'}
      </span>
    </div>
  );
}
