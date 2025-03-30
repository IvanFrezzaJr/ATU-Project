import ThemeToggle from './ThemeToggle';


const Header = () => {
  return (
    <header>
      <nav class="container-fluid" id="menu">
        <ul>
          <li><strong>Acme Corp</strong></li>
        </ul>
        <ul>
          <li><a href="#" class="secondary">Services</a></li>
          <li><a href="#" class="secondary">Offers</a></li>
          <li><a href="#" class="secondary">About</a></li>
          <li><ThemeToggle /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
