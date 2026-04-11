import React from 'react';
import { IonProgressBar, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { wallet } from 'ionicons/icons';

interface CategoryBarProps {
  category: string;
  amount: number;
  monthlyBudget: number;
  icon?: string;
  color?: string;
}


const CategoryBar: React.FC<CategoryBarProps> = ({
  category,
  amount,
  monthlyBudget,
  icon,
  color = '#3498db',
}) => {
  // Category icons mapping
  const categoryIcons: Record<string, string> = {
    'Food & Dining': 'restaurant',
    'Shopping': 'cart',
    'Transport': 'car',
    'Health': 'medical',
  };

  const iconToUse = icon || categoryIcons[category] || wallet;

  return (
    <IonItem lines="none">
      <IonIcon 
        icon={iconToUse} 
        slot="start"
        style={{ 
          color: color,
          marginRight: '10px',
          fontSize: '20px'
        }}
      />
      <IonLabel>{category}</IonLabel>
      <div style={{ flex: 1, margin: '0 10px' }}>
        <IonProgressBar 
          value={amount / monthlyBudget} 
          style={{ 
            '--background': '#ecf0f1',
            '--progress-background': color,
            height: '8px',
            borderRadius: '4px'
          }}
        />
      </div>
      <IonLabel style={{ 
        textAlign: 'right', 
        fontWeight: 'bold',
        minWidth: '70px',
        color: '#333'
      }}>
        €{amount.toFixed(2)}
      </IonLabel>
    </IonItem>
  );
};

export default CategoryBar;