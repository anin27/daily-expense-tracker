import React from 'react';
import { IonItem, IonLabel, IonIcon, IonBadge } from '@ionic/react';
import { 
  restaurant, 
  cart, 
  car, 
  medical, 
  sparkles 
} from 'ionicons/icons';

interface ExpenseCardProps {
  category: string;
  amount: number;
  date: string;
  note?: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  category,
  amount,
  date,
  note,
}) => {
  // Category icons and colors
  const categoryConfig: Record<string, { icon: string; color: string }> = {
    'Food & Dining': { icon: restaurant, color: '#FF6B6B' },
    'Shopping': { icon: cart, color: '#9B59B6' },
    'Transport': { icon: car, color: '#3498DB' },
    'Health': { icon: medical, color: '#2ECC71' },
    'Others': { icon: sparkles, color: '#95A5A6' },
  };

  const config = categoryConfig[category] || categoryConfig['Others'];

  // Format date
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-IE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <IonItem 
      button
      detail={false}
      style={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '12px 0'
      }}
    >
      {/* Category Icon */}
      <IonIcon
        icon={config.icon}
        slot="start"
        style={{ 
          color: config.color,
          marginRight: '15px',
          fontSize: '24px'
        }}
      />
      
      {/* Expense Details */}
      <IonLabel>
        <h3 style={{ 
          margin: '0 0 5px 0',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          {category}
        </h3>
        
        {/* Note if exists */}
        {note && (
          <p style={{ 
            margin: '5px 0', 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {note}
          </p>
        )}
        
        {/* Date */}
        <p style={{ 
          margin: '5px 0', 
          color: '#999', 
          fontSize: '12px'
        }}>
          {formatDate(date)}
        </p>
      </IonLabel>
      
      {/* Amount Badge */}
      <IonBadge 
        color="danger" 
        slot="end"
        style={{ 
          fontSize: '16px', 
          padding: '8px 12px',
          marginLeft: '10px'
        }}
      >
        -€{amount.toFixed(2)}
      </IonBadge>
    </IonItem>
  );
};

export default ExpenseCard;