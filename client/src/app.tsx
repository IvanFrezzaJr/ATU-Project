

import { Route, Switch } from "wouter-preact";

import HomePage from './pages/HomePage'
import ItemListPage from './pages/ItemListPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Profile from './pages/ProfilePage';
import OfferListPage from "./pages/OfferListPage";
import TradePage from "./pages/TradePage";
import NotFound from "./pages/NotFound";
import ConfirmTradePage from "./pages/ConfirmTradePage";

export function App() {

  return (
      <Switch>
        <Route path="/"><HomePage /></Route>
        <Route path="/items"><ItemListPage /></Route>
        <Route path="/about"><AboutPage /></Route>
        <Route path="/login"><LoginPage /></Route>
        <Route path="/signup"><SignUpPage /></Route>
        <Route path="/profile"><Profile /></Route>
        <Route path="/confirm"><ConfirmTradePage /></Route>
        <Route path="/offers/:item_id<number>" component={OfferListPage}><OfferListPage /></Route>
        <Route path="/trade/:item_id<number>/to/:offer_item_id<number>" component={TradePage}><TradePage /></Route>
        {/* Fallback 404 */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
  )
}
