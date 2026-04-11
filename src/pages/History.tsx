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
  IonIcon,
  IonBadge,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonPopover,
  IonDatetime,
} from '@ionic/react';
import { useBudget } from '../context/BudgetContext';
import { 
  restaurant, 
  cart, 
  car, 
  medical, 
  sparkles,
  filter as filterIcon,
  calendarOutline,
  refresh,
  close,
  checkmark,
} from 'ionicons/icons';

// Map category names to their icons
const categoryIcons: Record<string, string> = {
  'Food & Dining': restaurant,
  'Shopping': cart,
  'Transport': car,
  'Health': medical,
  'Others': sparkles,
};

// Map category names to their colors
const categoryColors: Record<string, string> = {
  'Food & Dining': '#FF6B6B',
  'Shopping': '#9B59B6',
  'Transport': '#3498DB',
  'Health': '#2ECC71',
  'Others': '#95A5A6',
};

const History: React.FC = () => {
  // Get expenses from context
  const { expenses } = useBudget();
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Popover states (to control visibility)
  const [showStartPopover, setShowStartPopover] = useState(false);
  const [showEndPopover, setShowEndPopover] = useState(false);
  
  // Event references (to anchor the popover to the clicked element)
  const [startEvent, setStartEvent] = useState<Event>();
  const [endEvent, setEndEvent] = useState<Event>();

  // All available categories for filtering
  const categories = ['All', 'Food & Dining', 'Shopping', 'Transport', 'Health', 'Others'];

  // ✅ Filter expenses with INCLUSIVE date range
  const filteredExpenses = expenses.filter(exp => {
    const categoryMatch = filterCategory === 'All' || exp.category === filterCategory;
    
    let dateMatch = true;
    if (startDate && endDate) {
      // Convert expense date to date-only string (YYYY-MM-DD)
      const expenseDate = new Date(exp.date).toISOString().split('T')[0];
      
      // INCLUSIVE comparison
      const startMatch = expenseDate >= startDate;
      const endMatch = expenseDate <= endDate;
      dateMatch = startMatch && endMatch;
    }
    
    return categoryMatch && dateMatch;
  });

  // Format date to readable format (e.g., "10 Apr 2026")
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `€${amount.toFixed(2)}`;
  };

  // Format date for display in input (DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle Start Date Click
  const handleStartClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    setStartEvent(ev.nativeEvent); // Store the event to anchor popover
    setShowStartPopover(true);
  };

  // Handle End Date Click
  const handleEndClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    setEndEvent(ev.nativeEvent); // Store the event to anchor popover
    setShowEndPopover(true);
  };

  // Apply filters
  const applyFilters = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setShowStartPopover(false);
      setShowEndPopover(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory('All');
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
  };

  // Check if any filter is active
  const hasActiveFilters = filterCategory !== 'All' || startDate || endDate;
  
  // Check if we can apply filters
  const canApplyFilters = tempStartDate && tempEndDate;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
        {/* ===== FILTER SECTION ===== */}
        <div style={{ 
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <IonGrid>
            {/* Filter Header */}
            <IonRow className="ion-align-items-center">
              <IonCol size="auto">
                <IonIcon icon={filterIcon} style={{ marginRight: '8px', fontSize: '20px' }} />
              </IonCol>
              <IonCol>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Filters</h3>
              </IonCol>
            </IonRow>
            
            <IonRow style={{ marginTop: '15px' }}>
              {/* Category Filter */}
              <IonCol size="12" sizeMd="4">
                <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0', '--padding-end': '0' }}>
                  <IonLabel position="stacked" style={{ fontSize: '14px', color: '#666' }}>Category</IonLabel>
                  <IonSelect
                    value={filterCategory}
                    onIonChange={(e: CustomEvent) => setFilterCategory(e.detail.value as string)}
                    placeholder="All categories"
                    interface="popover"
                    style={{ maxWidth: '200px' }}
                  >
                    {categories.map(cat => (
                      <IonSelectOption key={cat} value={cat}>
                        {cat}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              </IonCol>
              
              {/* Start Date Input */}
              <IonCol size="12" sizeMd="3">
                <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0', '--padding-end': '0' }}>
                  <IonLabel position="stacked" style={{ fontSize: '14px', color: '#666' }}>From</IonLabel>
                  {/* Clickable Input Field */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={handleStartClick}
                  >
                    <IonIcon icon={calendarOutline} style={{ color: '#666', fontSize: '18px' }} />
                    <span style={{ fontSize: '14px', color: tempStartDate ? '#333' : '#999' }}>
                      {tempStartDate ? formatDateForDisplay(tempStartDate) : 'Select date'}
                    </span>
                  </div>
                  
                  {/* ✅ START DATE POPOVER (Appears below input) */}
                  <IonPopover
                    isOpen={showStartPopover}
                    event={startEvent}
                    onDidDismiss={() => setShowStartPopover(false)}
                    keepContentsMounted={true}
                    side="bottom"
                    alignment="start"
                  >
                    <div style={{ padding: '10px' }}>
                      <IonDatetime
                        value={tempStartDate}
                        onIonChange={(e: CustomEvent) => setTempStartDate(e.detail.value as string)}
                        presentation="date"
                        max={tempEndDate || undefined}
                        style={{ '--background': '#fff' }}
                      />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <IonButton 
                          fill="outline" 
                          size="small" 
                          onClick={() => setShowStartPopover(false)}
                          style={{ flex: 1 }}
                        >
                          Cancel
                        </IonButton>
                        <IonButton 
                          size="small" 
                          color="primary"
                          onClick={() => setShowStartPopover(false)}
                          style={{ flex: 1 }}
                        >
                          Done
                        </IonButton>
                      </div>
                    </div>
                  </IonPopover>
                  
                </IonItem>
              </IonCol>
              
              {/* End Date Input */}
              <IonCol size="12" sizeMd="3">
                <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0', '--padding-end': '0' }}>
                  <IonLabel position="stacked" style={{ fontSize: '14px', color: '#666' }}>To</IonLabel>
                  {/* Clickable Input Field */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={handleEndClick}
                  >
                    <IonIcon icon={calendarOutline} style={{ color: '#666', fontSize: '18px' }} />
                    <span style={{ fontSize: '14px', color: tempEndDate ? '#333' : '#999' }}>
                      {tempEndDate ? formatDateForDisplay(tempEndDate) : 'Select date'}
                    </span>
                  </div>
                  
                  {/* ✅ END DATE POPOVER (Appears below input) */}
                  <IonPopover
                    isOpen={showEndPopover}
                    event={endEvent}
                    onDidDismiss={() => setShowEndPopover(false)}
                    keepContentsMounted={true}
                    side="bottom"
                    alignment="start"
                  >
                    <div style={{ padding: '10px' }}>
                      <IonDatetime
                        value={tempEndDate}
                        onIonChange={(e: CustomEvent) => setTempEndDate(e.detail.value as string)}
                        presentation="date"
                        min={tempStartDate || undefined}
                        style={{ '--background': '#fff' }}
                      />
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <IonButton 
                          fill="outline" 
                          size="small" 
                          onClick={() => setShowEndPopover(false)}
                          style={{ flex: 1 }}
                        >
                          Cancel
                        </IonButton>
                        <IonButton 
                          size="small" 
                          color="primary"
                          onClick={() => setShowEndPopover(false)}
                          style={{ flex: 1 }}
                        >
                          Done
                        </IonButton>
                      </div>
                    </div>
                  </IonPopover>
                  
                </IonItem>
              </IonCol>
              
              {/* Submit Button */}
              <IonCol size="12" sizeMd="2">
                <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0', '--padding-end': '0' }}>
                  <IonButton
                    expand="block"
                    fill="solid"
                    color="primary"
                    onClick={applyFilters}
                    disabled={!canApplyFilters}
                    style={{ marginTop: '20px' }}
                  >
                    <IonIcon icon={checkmark} slot="start" />
                    Apply
                  </IonButton>
                </IonItem>
              </IonCol>
            </IonRow>
            
            {/* Active Filters Display */}
            {(startDate || endDate || filterCategory !== 'All') && (
              <IonRow style={{ marginTop: '15px' }}>
                <IonCol size="12">
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Active filters:</span>
                    
                    {filterCategory !== 'All' && (
                      <IonChip color="primary" onClick={() => setFilterCategory('All')} style={{ height: '28px' }}>
                        <IonIcon icon={close} slot="start" style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px' }}>{filterCategory}</span>
                      </IonChip>
                    )}
                    
                    {startDate && (
                      <IonChip color="primary" onClick={() => {
                        setTempStartDate('');
                        setStartDate('');
                      }} style={{ height: '28px' }}>
                        <IonIcon icon={close} slot="start" style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px' }}>From: {formatDateForDisplay(startDate)}</span>
                      </IonChip>
                    )}
                    
                    {endDate && (
                      <IonChip color="primary" onClick={() => {
                        setTempEndDate('');
                        setEndDate('');
                      }} style={{ height: '28px' }}>
                        <IonIcon icon={close} slot="start" style={{ fontSize: '14px' }} />
                        <span style={{ fontSize: '13px' }}>To: {formatDateForDisplay(endDate)}</span>
                      </IonChip>
                    )}
                    
                    <IonButton 
                      fill="outline" 
                      size="small" 
                      color="medium"
                      onClick={clearFilters}
                      style={{ 
                        height: '28px',
                        fontSize: '12px',
                        '--border-radius': '4px'
                      }}
                    >
                      <IonIcon icon={refresh} slot="start" style={{ fontSize: '14px', marginRight: '4px' }} />
                      Clear All
                    </IonButton>
                  </div>
                </IonCol>
              </IonRow>
            )}
          </IonGrid>
        </div>

        {/* ===== EXPENSE LIST ===== */}
        <IonList>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <IonItem 
                key={expense.id} 
                button
                detail={false}
                style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  padding: '15px 0'
                }}
              >
                <IonIcon
                  icon={categoryIcons[expense.category] || sparkles}
                  slot="start"
                  style={{ 
                    color: categoryColors[expense.category] || '#666',
                    marginRight: '15px',
                    fontSize: '24px'
                  }}
                />
                
                <IonLabel>
                  <h3 style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {expense.category}
                  </h3>
                  
                  {expense.note && (
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#666', 
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      {expense.note}
                    </p>
                  )}
                  
                  <p style={{ 
                    margin: '5px 0', 
                    color: '#999', 
                    fontSize: '13px'
                  }}>
                    {formatDate(expense.date)}
                  </p>
                </IonLabel>
                
                <IonBadge 
                  color="danger" 
                  slot="end"
                  style={{ 
                    fontSize: '16px', 
                    padding: '10px 14px',
                    marginLeft: '10px',
                    borderRadius: '6px'
                  }}
                >
                  -{formatCurrency(expense.amount)}
                </IonBadge>
              </IonItem>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              color: '#999'
            }}>
              <IonIcon 
                icon={sparkles} 
                style={{ fontSize: '64px', marginBottom: '20px', color: '#ddd' }}
              />
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No expenses found</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {hasActiveFilters 
                  ? "Try adjusting your filters or date range"
                  : "You haven't added any expenses yet.\nTap '+' to add your first expense!"
                }
              </p>
              {hasActiveFilters && (
                <IonButton fill="outline" color="primary" onClick={clearFilters} style={{ marginTop: '20px' }}>
                  Clear Filters
                </IonButton>
              )}
            </div>
          )}
        </IonList>

        {/* ===== SUMMARY FOOTER ===== */}
        {filteredExpenses.length > 0 && (
          <div style={{ 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderTop: '2px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              Showing {filteredExpenses.length} of {expenses.length} expenses
            </p>
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: '#e74c3c'
            }}>
              Total: -{formatCurrency(
                filteredExpenses.reduce((sum: number, exp) => sum + exp.amount, 0)
              )}
            </p>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default History;