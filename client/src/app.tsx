

import { Route, Switch } from "wouter-preact";

import HomePage from './pages/HomePage'
import ItemListPage from './pages/ItemListPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import OfferListPage from "./pages/OfferListPage";
import TradePage from "./pages/TradePage";
import NotFound from "./pages/NotFound";
import ConfirmTradePage from "./pages/ConfirmTradePage";
import ItemPage from "./pages/ItemPage";
import ItemFormPage from "./pages/ItemFormPage";

export function App() {

  return (
      <Switch>
        <Route path="/"><HomePage /></Route>
        <Route path="/items"><ItemListPage /></Route>
        <Route path="/about"><AboutPage /></Route>
        <Route path="/login"><LoginPage /></Route>
        <Route path="/signup"><SignUpPage /></Route>
        <Route path="/profile"><ProfilePage /></Route>
        <Route path="/admin/:section" component={AdminPage} />

        <Route path="/confirm"><ConfirmTradePage /></Route>
        <Route path="/offers/:item_id<number>" component={OfferListPage}><OfferListPage /></Route>
        <Route path="/trade/:item_id<number>/to/:offer_item_id<number>" component={TradePage}><TradePage /></Route>

        <Route path="/items" component={ItemPage} />
        <Route path="/items/new" component={ItemFormPage} />
        <Route path="/items/:id" component={ItemFormPage} />
        
        {/* Fallback 404 */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
  )
}
