

import { Route } from "wouter-preact";

import Home from './pages/HomePage'
import ItemList from './pages/ItemListPage';
import About from './pages/AboutPage';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import Profile from './pages/ProfilePage';
import TradeList from './pages/TradeListPage';


export function App() {

  return (
    <>
    <Route path="/"><Home /></Route>
    <Route path="/itemlist"><ItemList /></Route>
    <Route path="/about"><About /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/signup"><SignUp /></Route>
    <Route path="/profile"><Profile /></Route>
    <Route path="/tradelist"><TradeList /></Route>
    </>
  )
}
