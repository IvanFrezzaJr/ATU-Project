

import { Route } from "wouter-preact";
import Home from './pages/Home'
import Offer from './pages/Offer';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';


export function App() {

  return (
    <>
    <Route path="/"><Home /></Route>
    <Route path="/Offer"><Offer /></Route>
    <Route path="/About"><About /></Route>
    <Route path="/Login"><Login /></Route>
    <Route path="/SignUp"><SignUp /></Route>
    <Route path="/Profile"><Profile /></Route>
    </>
  )
}
