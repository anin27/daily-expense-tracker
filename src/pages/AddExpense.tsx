
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { useBudget } from '../context/BudgetContext';
import { 
  restaurant, 
  cart, 
  car, 
  medical, 
  sparkles 
} from 'ionicons/icons';

const categories = [
  { name: 'Food & Dining', icon: restaurant, color: '#FF6B6B' },
  { name: 'Shopping', icon: cart, color: '#9B59B6' },
  { name: 'Transport', icon: car, color: '#3498DB' },
  { name: 'Health', icon: medical, color: '#2ECC71' },
  { name: 'Others', icon: sparkles, color: '#95A5A6' },
];

const AddExpense: React.FC = () => {
  const { addExpense } = useBudget();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setAlertMessage('Please enter a valid amount greater than 0');
      setShowAlert(true);
      return false;
    }
    if (!category) {
      setAlertMessage('Please select a category');
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    addExpense({
      amount: parseFloat(amount),
      category,
      date,
      note,
    });

    setAlertMessage('Expense added successfully!');
    setShowAlert(true);

    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  };

  const handleQuickCategory = (catName: string) => {
    setCategory(catName);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Add Expense</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/* Amount Input */}
        <IonItem>
          <IonLabel position="floating">Amount (€)</IonLabel>
          <IonInput
            type="number"
            step="0.01"
            min="0"
            value={amount}
            // onIonInput={(e: any) => setAmount(e.detail.value)}
            onIonInput={(e) => setAmount(e.detail.value ?? '')}
            required
          />
        </IonItem>

        {/* Category Selector */}
        <IonItem>
          <IonLabel>Category</IonLabel>
          <IonSelect
            value={category}
            // onIonChange={(e: any) => setCategory(e.detail.value)}
            onIonChange={(e) => setCategory(e.detail.value ?? '')}
            placeholder="Select category"
            required
            interface="popover"
          >
            {categories.map((cat) => (
              <IonSelectOption key={cat.name} value={cat.name}>
                {cat.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Date Input - FIXED ✅ */}
        <IonItem>
          <IonLabel position="floating">Date</IonLabel>
          <IonInput
            type="date"
            value={date}
            // onIonInput={(e: any) => setDate(e.detail.value)}
            onIonInput={(e) => setDate(e.detail.value ?? '')}
            required
          />
        </IonItem>

        {/* Note (Optional) */}
        <IonItem>
          <IonLabel position="floating">Note (optional)</IonLabel>
          <IonInput
            type="text"
            placeholder="e.g., Lunch at café..."
            value={note}
            // onIonInput={(e: any) => setNote(e.detail.value)}
            onIonInput={(e) => setNote(e.detail.value ?? '')}
          />
        </IonItem>

        {/* Submit Button */}
        <IonButton
          expand="block"
          onClick={handleSubmit}
          style={{ margin: '30px 0' }}
        >
          Save Expense
        </IonButton>

        {/* Quick Category Buttons */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>
            Quick Categories
          </h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            marginBottom: '20px'
          }}>
            {categories.map((cat) => (
              <IonButton
                key={cat.name}
                fill={category === cat.name ? 'solid' : 'outline'}
                size="small"
                onClick={() => handleQuickCategory(cat.name)}
                style={{
                  '--background': category === cat.name ? cat.color : 'transparent',
                  '--color': category === cat.name ? '#fff' : cat.color,
                  borderColor: cat.color,
                }}
              >
                <IonIcon icon={cat.icon} slot="start" style={{ marginRight: '5px' }} />
                {cat.name}
              </IonButton>
            ))}
          </div>
        </div>

        {/* Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertMessage.includes('successfully') ? 'Success ✓' : 'Error ⚠'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;