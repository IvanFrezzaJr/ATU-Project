import ThemeToggle from './ThemeToggle';
import profilePlaceholder from '../assets/profile-placeholder.png';
import { Link, useLocation } from 'wouter-preact';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleSignUp = () => {
    navigate('/SignUp');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav className="container" id="menu">
        <ul>
          <li><Link href="/"><strong>Barter</strong> Exchange platform</Link></li>
        </ul>
        <ul>
          <li><Link href="/items" className="secondary active">Items</Link></li>
          <li><Link href="/About" className="secondary active">About</Link></li>
          
          {user ? (
            <>
              <li>
                <button className="outline secondary" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li className="profile">
                <Link href="/admin">
                  <img src={user.profilePic || profilePlaceholder} alt="User admin" />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button className="secondary" onClick={handleSignUp}>
                  Sign up
                </button>
              </li>
              <li>
                <button className="outline secondary" onClick={handleLogin}>
                  Sign in
                </button>
              </li>
              <li className="profile">
                <Link href="/admin">
                  <img src={profilePlaceholder} alt="Default admin" />
                </Link>
              </li>
            </>
          )}

          <li><ThemeToggle /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
