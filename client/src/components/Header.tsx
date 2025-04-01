import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import profilePlaceholder from '../assets/profile-placeholder.png';


import { Link, useLocation } from "wouter-preact";


interface IUser {
  name: string; 
  profilePic: string;
}


const Header = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [, navigate] = useLocation();

  const handleLogin = () => {
    setUser({ name: 'John Doe', profilePic: 'https://placehold.co/40x40' });
    navigate('/Login'); 
  };

  const handleSignUp = () => {
    setUser({ name: 'John Doe', profilePic: 'https://placehold.co/40x40' });
    navigate('/SignUp'); 
  };

  const handleLogout = () => {
    setUser(null);
  };
   


  return (
    <header>
      <nav className="container" id="menu">
        <ul>
          <li><strong>Barter</strong> Exchange platform</li>
        </ul>
        <ul>
       
          <li><Link href="/offers" className="secondary active">Offers</Link></li>
          <li><Link href="/About" className="secondary active">About</Link></li>
          {user ? (
            <>
              <li><button className="outline secondary" onClick={handleLogout}>Logout</button></li>
              <li className="profile"><a href="#"><img src={user.profilePic} alt="User Profile" /></a></li>
            </>
          ) : (
            <>
              <li><button className="secondary" onClick={handleSignUp}>Sign up</button></li>
              <li><button className="outline secondary" onClick={handleLogin}>Sign in</button></li>
              <li className="profile"><a href="#"><img src={profilePlaceholder} alt="Default Profile" /></a></li>
            </>
          )}
          <li><ThemeToggle /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
