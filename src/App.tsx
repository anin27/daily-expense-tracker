import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, add, time, settings } from 'ionicons/icons';

// Import the NEW pages (not Tab1, Tab2, Tab3)
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Settings from './pages/Settings';

// Import Context Provider for state management
import { BudgetProvider } from './context/BudgetContext';

// Core CSS required for Ionic components
import '@ionic/react/css/core.css';

// Basic CSS for apps built with Ionic
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// Optional CSS utils
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Your custom theme
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <BudgetProvider>
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Route for Home/Dashboard page */}
            <Route exact path="/home">
              <Home />
            </Route>
            
            {/* Route for Add Expense page */}
            <Route exact path="/add">
              <AddExpense />
            </Route>
            
            {/* Route for History page */}
            <Route exact path="/history">
              <History />
            </Route>
            
            {/* Route for Settings page */}
            <Route exact path="/settings">
              <Settings />
            </Route>
            
            {/* Default route - redirect to home */}
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          
          {/* Bottom Tab Bar */}
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            
            <IonTabButton tab="add" href="/add">
              <IonIcon icon={add} />
              <IonLabel>Add</IonLabel>
            </IonTabButton>
            
            <IonTabButton tab="history" href="/history">
              <IonIcon icon={time} />
              <IonLabel>History</IonLabel>
            </IonTabButton>
            
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </BudgetProvider>
);

export default App;