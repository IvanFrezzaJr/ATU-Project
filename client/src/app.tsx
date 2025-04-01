

import { Route } from "wouter-preact";
import Home from './pages/Home'
import Offers from './pages/Offers';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


export function App() {

  return (
    <>
    <Route path="/"><Home /></Route>
    <Route path="/Offers"><Offers /></Route>
    <Route path="/About"><About /></Route>
    <Route path="/Login"><Login /></Route>
    <Route path="/SignUp"><SignUp /></Route>
    </>
  )
}
