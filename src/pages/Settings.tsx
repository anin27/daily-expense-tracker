import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonLabel,
  IonInput,
  IonButton,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem, 
} from '@ionic/react';
import { useBudget } from '../context/BudgetContext';
import { 
  cash, 
  notifications, 
  moon, 
  language,
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Handle budget update
  const handleUpdateBudget = () => {
    const newBudget = parseFloat(budgetInput);
    
    if (isNaN(newBudget) || newBudget <= 0) {
      alert('Please enter a valid budget amount greater than 0');
      return;
    }

    updateBudget(newBudget);
  };

  // Handle currency change
  const handleCurrencyChange = (event: CustomEvent) => {
    const newCurrency = event.detail.value;
    setCurrency(newCurrency);
  };

  // Handle notifications toggle
  const handleNotificationsToggle = (event: CustomEvent) => {
    setNotificationsEnabled(event.detail.checked);
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
        <IonToolbar color="tertiary">
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/*  BUDGET SETTINGS  */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <IonIcon icon={cash} slot="start" style={{ marginRight: '12px', fontSize: '24px', color: '#27ae60' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>Monthly Budget</h2>
            </div>
            
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
              Set your monthly spending limit
            </p>
            
            {/* Input and Button on Same Row */}
            <IonGrid>
              <IonRow className="ion-align-items-end">
                <IonCol size="8">
                  <IonLabel position="stacked" style={{ fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: '500' }}>
                    Budget Amount ({getCurrencySymbol(currency)})
                  </IonLabel>
                  <IonInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetInput}
                    onIonInput={(e: CustomEvent) => setBudgetInput(e.detail.value)}
                    placeholder="Enter amount"
                    style={{ 
                      '--background': '#f8f9fa',
                      '--border-radius': '8px',
                      '--padding-top': '12px',
                      '--padding-bottom': '12px',
                      '--padding-start': '14px',
                      fontSize: '16px',
                    }}
                  />
                </IonCol>
                <IonCol size="4">
                  <IonButton 
                    size="small"
                    onClick={handleUpdateBudget}
                    color="primary"
                    style={{ 
                      '--border-radius': '8px',
                      height: '42px',
                      fontSize: '15px',
                      fontWeight: '600',
                    }}
                  >
                    Update
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            
            <p style={{ fontSize: '14px', color: '#888', marginTop: '12px' }}>
              Current: <strong style={{ color: '#27ae60', fontSize: '16px' }}>{getCurrencySymbol(currency)}{monthlyBudget.toFixed(2)}</strong>
            </p>
          </IonCardContent>
        </IonCard>

        {/* CURRENCY SETTINGS */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <IonIcon icon={language} slot="start" style={{ marginRight: '12px', fontSize: '24px', color: '#3498db' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>Currency</h2>
            </div>
            
            <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0', '--padding-end': '0' }}>
              <IonLabel style={{ fontSize: '16px', color: '#555', fontWeight: '500' }}>Display Currency</IonLabel>
              <IonSelect
                value={currency}
                onIonChange={handleCurrencyChange}
                interface="popover"
                style={{ maxWidth: '140px', textAlign: 'right', fontSize: '16px' }}
              >
                <IonSelectOption value="EUR">EUR (€)</IonSelectOption>
                <IonSelectOption value="USD">USD ($)</IonSelectOption>
                <IonSelectOption value="GBP">GBP (£)</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/*  NOTIFICATION SETTINGS  */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <IonIcon icon={notifications} slot="start" style={{ marginRight: '12px', fontSize: '24px', color: '#f39c12' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>Notifications</h2>
                  <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#666' }}>
                    Budget alerts
                  </p>
                </div>
              </div>
              <IonToggle
                checked={notificationsEnabled}
                onIonChange={handleNotificationsToggle}
                style={{ marginLeft: '15px', transform: 'scale(1.1)' }}
              />
            </div>
          </IonCardContent>
        </IonCard>

        {/*  APPEARANCE SETTINGS  */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <IonIcon icon={moon} slot="start" style={{ marginRight: '12px', fontSize: '24px', color: '#9b59b6' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#333' }}>Dark Mode</h2>
                  <p style={{ margin: '5px 0 0 0', fontSize: '15px', color: '#666' }}>
                    Toggle theme
                  </p>
                </div>
              </div>
              <IonToggle
                checked={darkMode}
                onIonChange={handleDarkModeToggle}
                style={{ marginLeft: '15px', transform: 'scale(1.1)' }}
              />
            </div>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Settings;