import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToggle,
  IonAlert,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/react';
import { useBudget } from '../context/BudgetContext';
import { 
  cash, 
  notifications, 
  moon, 
  language,
  save,
} from 'ionicons/icons';

const Settings: React.FC = () => {
  // Get budget context
  const { 
    monthlyBudget, 
    updateBudget, 
    currency, 
    setCurrency 
  } = useBudget();

  // Local state
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Handle budget update
  const handleUpdateBudget = () => {
    const newBudget = parseFloat(budgetInput);
    
    if (isNaN(newBudget) || newBudget <= 0) {
      setAlertMessage('Please enter a valid budget amount greater than 0');
      setShowAlert(true);
      return;
    }

    updateBudget(newBudget);
    setAlertMessage(`Monthly budget updated to €${newBudget.toFixed(2)}!`);
    setShowAlert(true);
  };

  // Handle currency change
  const handleCurrencyChange = (event: CustomEvent) => {
    const newCurrency = event.detail.value;
    setCurrency(newCurrency);
    setAlertMessage(`Currency changed to ${newCurrency}`);
    setShowAlert(true);
  };

  // Handle notifications toggle
  const handleNotificationsToggle = (event: CustomEvent) => {
    setNotificationsEnabled(event.detail.checked);
    setAlertMessage(
      event.detail.checked 
        ? 'Notifications enabled' 
        : 'Notifications disabled'
    );
    setShowAlert(true);
  };

  // Handle dark mode toggle

  const handleDarkModeToggle = (event: CustomEvent) => {
    setDarkMode(event.detail.checked);
    
    // Apply dark mode to document
    if (event.detail.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    setAlertMessage(
      event.detail.checked 
        ? 'Dark mode enabled' 
        : 'Light mode enabled'
    );
    setShowAlert(true);
  };

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
    };
    return symbols[code] || code;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="medium">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/* Budget Settings */}
        <IonList>
          <IonItem>
            <IonIcon icon={cash} slot="start" style={{ marginRight: '10px' }} />
            <IonLabel>
              <h2>Monthly Budget</h2>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Set your monthly spending limit
              </p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonLabel position="stacked">Current Budget</IonLabel>
            <IonInput
              type="number"
              step="0.01"
              min="0"
              value={budgetInput}
              onIonInput={(e: CustomEvent) => setBudgetInput(e.detail.value)}
              placeholder="Enter amount"
              style={{ '--padding-top': '10px' }}
            />
          </IonItem>
          
          <IonItem>
            <IonButton 
              expand="block" 
              onClick={handleUpdateBudget}
              color="primary"
            >
              <IonIcon icon={save} slot="start" style={{ marginRight: '5px' }} />
              Update Budget
            </IonButton>
          </IonItem>
        </IonList>

        {/* Currency Settings */}
        <IonList>
          <IonItem>
            <IonIcon icon={language} slot="start" style={{ marginRight: '10px' }} />
            <IonLabel>
              <h2>Currency</h2>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Choose your preferred currency
              </p>
            </IonLabel>
          </IonItem>
          
          <IonItem>
            <IonLabel>Display Currency</IonLabel>
            <IonSelect
              value={currency}
              onIonChange={handleCurrencyChange}
              interface="popover"
              style={{ maxWidth: '150px' }}
            >
              <IonSelectOption value="EUR">EUR (€)</IonSelectOption>
              <IonSelectOption value="USD">USD ($)</IonSelectOption>
              <IonSelectOption value="GBP">GBP (£)</IonSelectOption>
            </IonSelect>
          </IonItem>
          
          <IonItem>
            <IonLabel style={{ fontSize: '12px', color: '#999' }}>
              Current: {getCurrencySymbol(currency)} {currency}
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Notification Settings */}
        <IonList>
          <IonItem>
            <IonIcon icon={notifications} slot="start" style={{ marginRight: '10px' }} />
            <IonLabel>
              <h2>Notifications</h2>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Enable or disable budget alerts
              </p>
            </IonLabel>
            <IonToggle
              checked={notificationsEnabled}
              onIonChange={handleNotificationsToggle}
              slot="end"
            />
          </IonItem>
          
          <IonItem>
            <IonLabel style={{ fontSize: '13px', color: '#666' }}>
              Get notified when you're close to your budget limit
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Appearance Settings */}
        <IonList>
          <IonItem>
            <IonIcon icon={moon} slot="start" style={{ marginRight: '10px' }} />
            <IonLabel>
              <h2>Appearance</h2>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Toggle dark mode
              </p>
            </IonLabel>
            <IonToggle
              checked={darkMode}
              onIonChange={handleDarkModeToggle}
              slot="end"
            />
          </IonItem>
          
          <IonItem>
            <IonLabel style={{ fontSize: '13px', color: '#666' }}>
              Switch between light and dark theme
            </IonLabel>
          </IonItem>
        </IonList>

        {/* App Info */}
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#999'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            Smart Budget App
          </h3>
          <p style={{ margin: '0', fontSize: '14px' }}>
            Version 1.0.0
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
            Built with Ionic React
          </p>
        </div>

        {/* Alert for feedback */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Settings Updated"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

// IMPORTANT: Default export for the component
export default Settings;