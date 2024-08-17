document.addEventListener('DOMContentLoaded', () => {
  let totalIncome = 0;
  let totalExpenses = 0;
  let savingsGoal = 0;
  let currentSavings = 0;
  let expenses = [];

  const incomeInput = document.getElementById('income-amount');
  const addIncomeBtn = document.getElementById('add-income');
  const totalIncomeText = document.getElementById('total-income');

  const expenseNameInput = document.getElementById('expense-name');
  const expenseAmountInput = document.getElementById('expense-amount');
  const expenseCategorySelect = document.getElementById('expense-category');
  const addExpenseBtn = document.getElementById('add-expense');
  const expensesList = document.getElementById('expenses-list');

  const savingsGoalInput = document.getElementById('savings-goal');
  const currentSavingsText = document.getElementById('current-savings');
  const goalStatusText = document.getElementById('goal-status');

  const breakdownChartCanvas = document.getElementById('breakdown-chart');

  let chart;

  function updateIncome() {
    totalIncomeText.textContent =(` Total Income: $${totalIncome.toFixed(2)}`);
    updateSavingsGoal();
  }

  function updateExpenses() {
    totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    renderExpenses();
    updateSavingsGoal();
    updateBreakdownChart();
  }

  function updateSavingsGoal() {
    if (savingsGoal > 0) {
      currentSavings = totalIncome - totalExpenses;
      const progress = Math.min((currentSavings / savingsGoal) * 100, 100);
      currentSavingsText.textContent = (`Current Savings: $${currentSavings.toFixed(2)}`);
      goalStatusText.textContent =(` Savings Goal Progress: ${progress.toFixed(2)}%`);
    }
  }

  function renderExpenses() {
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
      const li = document.createElement('li');
      li.textContent = (`${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})`);
      expensesList.appendChild(li);
    });
  }

  function updateBreakdownChart() {
    if (!breakdownChartCanvas) return; // Ensure the chart canvas is present

    const ctx = breakdownChartCanvas.getContext('2d');
    const categories = [...new Set(expenses.map(expense => expense.category))];
    const data = categories.map(category => {
      return expenses
        .filter(expense => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0);
    });

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          label: 'Expenses Breakdown',
          data: data,
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  addIncomeBtn.addEventListener('click', () => {
    const income = parseFloat(incomeInput.value);
    if (!isNaN(income) && income > 0) {
      totalIncome += income;
      updateIncome();
      incomeInput.value = '';
    } else {
      alert('Please enter a valid income amount.');
    }
  });

  addExpenseBtn.addEventListener('click', () => {
    const name = expenseNameInput.value;
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;

    if (name && !isNaN(amount) && amount > 0 && category) {
      expenses.push({ name, amount, category });
      updateExpenses();
      expenseNameInput.value = '';
      expenseAmountInput.value = '';
    } else {
      alert('Please enter valid expense details.');
    }
  });

  savingsGoalInput.addEventListener('input', () => {
    const goal = parseFloat(savingsGoalInput.value);
    if (!isNaN(goal) && goal >= 0) {
      savingsGoal = goal;
      updateSavingsGoal();
    } else {
      alert('Please enter a valid savings goal.');
    }
  });
});