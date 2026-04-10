import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
} from "@ionic/react";
import {
  add,
  checkmarkCircle,
  warning,
  archiveOutline,
} from "ionicons/icons";
import { useBudget } from "../context/BudgetContext";

// Import reusable components
import BudgetProgress from "../components/BudgetProgress";
import CategoryBar from "../components/CategoryBar";

const Home: React.FC = () => {
  // Get budget data from context (global state)
  const { monthlyBudget, totalSpent, remaining, getExpensesByCategory } =
    useBudget();
  
  // Get expenses grouped by category
  const expensesByCategory = getExpensesByCategory();

  return (
    <IonPage>
      {/* ===== HEADER SECTION ===== */}
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* ===== MAIN CONTENT SECTION ===== */}
      <IonContent className="ion-padding">
        
        {/* ----- CARD 1: Budget Overview ----- */}
        <IonCard>
          <IonCardContent>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              {/* Label: "Monthly Budget" */}
              <h2 style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                Monthly Budget
              </h2>
              
              {/* Big green number showing budget amount */}
              <h1
                style={{
                  margin: "10px 0",
                  color: "#27ae60",
                  fontSize: "36px",
                }}
              >
                €{monthlyBudget.toFixed(2)}
              </h1>

              {/* Status badge with proper icon */}
              <IonBadge color={remaining >= 0 ? "success" : "danger"}>
                <IonIcon
                  icon={remaining >= 0 ? checkmarkCircle : warning}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                {remaining >= 0 ? "Active" : "Over Budget"}
              </IonBadge>
            </div>

            {/* Use reusable BudgetProgress Component */}
            <BudgetProgress
              monthlyBudget={monthlyBudget}
              totalSpent={totalSpent}
              remaining={remaining}
            />
          </IonCardContent>
        </IonCard>

        {/* ----- CARD 2: Spending by Category ----- */}
        <IonCard>
          <IonCardContent>
            <h3
              style={{
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Spending by Category
            </h3>

            <IonList lines="none">
              {/* Map through categories and render CategoryBar component */}
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <CategoryBar
                  key={category}
                  category={category}
                  amount={amount as number}
                  monthlyBudget={monthlyBudget}
                />
              ))}

              {/* Empty state - shown when no expenses exist */}
              {Object.keys(expensesByCategory).length === 0 && (
                <IonItem>
                  {/* ✅ Fixed: Use archiveOutline icon (not 'inbox') */}
                  <IonIcon
                    icon={archiveOutline}
                    slot="start"
                    style={{ 
                      color: "#999", 
                      marginRight: "10px", 
                      fontSize: "24px" 
                    }}
                  />
                  <IonLabel style={{ textAlign: "center", color: "#999" }}>
                    No expenses yet. Tap "+" to add one!
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* ----- FLOATING ACTION BUTTON: Add Expense ----- */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="primary"
            routerLink="/add"
            aria-label="Add expense"
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};


export default Home;