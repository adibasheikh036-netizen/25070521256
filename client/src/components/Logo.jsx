export default function Logo({ light = false, showName = true }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <span className="logo-mark" aria-hidden="true">
        AS
        <i className="logo-spark" />
      </span>
      {showName && (
        <span className="logo-text">
          <span className="logo-name">
            Adiba <b>Sheikh</b>
          </span>
          <small>Student Portal</small>
        </span>
      )}
    </span>
  );
}
