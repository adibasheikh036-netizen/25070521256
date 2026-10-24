import Logo from './Logo.jsx';

export default function SplashScreen() {
  return (
    <div className="splash" role="status" aria-label="Loading">
      <div className="splash-logo">
        <Logo showName={false} />
      </div>
      <div className="splash-bar" />
    </div>
  );
}
