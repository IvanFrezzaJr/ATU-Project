

import { Route } from "wouter-preact";
import Home from './pages/Home'
import Offers from './pages/Offers';
import About from './pages/About';


export function App() {

  return (
    <>
    <Route path="/"><Home /></Route>
    <Route path="/Offers"><Offers /></Route>
    <Route path="/About"><About /></Route>
    </>
  )
}
