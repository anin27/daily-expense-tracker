import React from 'react';
import { IonProgressBar } from '@ionic/react';

interface BudgetProgressProps {
  monthlyBudget: number;
  totalSpent: number;
  remaining: number;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  monthlyBudget,
  totalSpent,
  remaining,
}) => {
  const spendingPercentage = Math.min((totalSpent / monthlyBudget) * 100, 100);

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Budget Summary */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginBottom: '15px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
            Total Spent
          </p>
          <p style={{ 
            margin: '5px 0', 
            color: '#e74c3c', 
            fontWeight: 'bold', 
            fontSize: '18px' 
          }}>
            €{totalSpent.toFixed(2)}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
            Remaining
          </p>
          <p style={{ 
            margin: '5px 0', 
            color: remaining >= 0 ? '#27ae60' : '#e74c3c', 
            fontWeight: 'bold', 
            fontSize: '18px' 
          }}>
            €{remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <IonProgressBar 
        value={spendingPercentage / 100} 
        color={
          spendingPercentage > 90 ? 'danger' : 
          spendingPercentage > 70 ? 'warning' : 
          'success'
        }
      />
      
      {/* Percentage Text */}
      <p style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        marginTop: '5px', 
        color: '#666' 
      }}>
        {spendingPercentage.toFixed(1)}% of budget used
      </p>
    </div>
  );
};

export default BudgetProgress;