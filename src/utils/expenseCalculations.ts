
export interface ExpenseRecord {
  amountPaid: number;
  description: string;
}

export interface Person {
  name: string;
  expenses: ExpenseRecord[];
}

export interface Balance {
  name: string;
  totalPaid: number;
  expenses: ExpenseRecord[];
  balance: number;
  owes: Array<{ to: string; amount: number }>;
  shouldReceive: Array<{ from: string; amount: number }>;
}

export const calculateExpenseSplit = (people: Person[]): {
  balances: Balance[];
  totalExpense: number;
  perPersonShare: number;
  transactions: Array<{ from: string; to: string; amount: number }>;
} => {
  // Calculate total amount paid by each person
  const balances: Balance[] = people.map(person => {
    const totalPaid = person.expenses.reduce((sum, expense) => sum + expense.amountPaid, 0);
    return {
      name: person.name,
      totalPaid,
      expenses: person.expenses,
      balance: 0,
      owes: [],
      shouldReceive: []
    };
  });

  const totalExpense = balances.reduce((sum, person) => sum + person.totalPaid, 0);
  const perPersonShare = totalExpense / people.length;

  // Calculate individual balances
  balances.forEach(person => {
    person.balance = person.totalPaid - perPersonShare;
  });

  // Calculate who owes whom
  const debtors = balances.filter(person => person.balance < 0);
  const creditors = balances.filter(person => person.balance > 0);

  const transactions: Array<{ from: string; to: string; amount: number }> = [];

  // Simple settlement algorithm
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = Math.abs(debtors[i].balance);
    const credit = creditors[j].balance;
    const settleAmount = Math.min(debt, credit);

    transactions.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: Math.round(settleAmount * 100) / 100
    });

    debtors[i].balance += settleAmount;
    creditors[j].balance -= settleAmount;

    if (Math.abs(debtors[i].balance) < 0.01) i++;
    if (Math.abs(creditors[j].balance) < 0.01) j++;
  }

  return {
    balances,
    totalExpense: Math.round(totalExpense * 100) / 100,
    perPersonShare: Math.round(perPersonShare * 100) / 100,
    transactions
  };
};

export const generateWhatsAppMessage = (
  balances: Balance[],
  totalExpense: number,
  perPersonShare: number,
  transactions: Array<{ from: string; to: string; amount: number }>
): string => {
  let message = "💰 *Expense Split Summary*\n\n";
  
  message += "📋 *What everyone paid:*\n";
  balances.forEach(person => {
    message += `• ${person.name}: ₹${person.totalPaid}\n`;
    person.expenses.forEach(expense => {
      if (expense.description) {
        message += `  - ₹${expense.amountPaid} (${expense.description})\n`;
      } else {
        message += `  - ₹${expense.amountPaid}\n`;
      }
    });
  });

  message += `\n💸 *Total Expense:* ₹${totalExpense}\n`;
  message += `👥 *Per Person Share:* ₹${perPersonShare}\n\n`;

  if (transactions.length > 0) {
    message += "💳 *Settlement Required:*\n";
    transactions.forEach(transaction => {
      message += `• ${transaction.from} should pay ₹${transaction.amount} to ${transaction.to}\n`;
    });
  } else {
    message += "✅ All expenses are already balanced!\n";
  }

  message += "\n🔗 Try this expense splitter: " + window.location.origin;

  return encodeURIComponent(message);
};
