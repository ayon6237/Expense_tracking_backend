const { addExpense, getExpenses, deleteExpenses, getExpensesHistory, deleteExpense, updateExpense, deleteAllExpenses, getExpenseAnalytics } = require('./expense.controller');

const router = require('express').Router();

// ➕ add expense
router.post('/expense',addExpense );
router.get('/expense/:userId', getExpenses);
router.delete('/expense/clear/:userId',deleteExpenses);


router.get('/expense/history/:userId',getExpensesHistory);
router.delete('/expense/:expenseId', deleteExpense);
router.put('/expense/:expenseId', updateExpense);
router.delete("/expense/delete-all/:userId", deleteAllExpenses);
router.get('/expense/analytics/:userId', getExpenseAnalytics);


module.exports = router;