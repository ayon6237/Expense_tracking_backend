const mongoose = require('mongoose');
const Expense = require('../expense/expense.model');


const addExpense = async (req, res) => {
    try {
        // বডিতে category আছে কিনা চেক করুন
        const { userId, title, amount, type, category } = req.body; 

        const newExpense = new Expense({
            userId,
            title,
            amount,
            type,
            category // 🔥 ডাটাবেজে সেভ হচ্ছে
        });
        await newExpense.save();
        res.status(201).json({ message: "Success", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenses = async (req, res) => {

    try {

        const { userId } = req.params;

        const expenses = await Expense.find({ userId });

        res.status(200).json(expenses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteExpenses = async (req,res)=>{
    try {
        const {userId} = req.params;
        await Expense.deleteMany({userId});

        res.status(200).json({
            message:"All expense cleared successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}



const getExpensesHistory = async (req, res) => {

    try {

        const { userId } = req.params;

        const expenses = await Expense.find({ userId });

        res.status(200).json(expenses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteExpense = async (req, res) => {

    try {

        const { expenseId } = req.params;

        await Expense.findByIdAndDelete(expenseId);

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



const updateExpense = async (req, res) => {

    try {

        const { expenseId } = req.params;

        const { title, amount, type } = req.body;

        // 🔥 validate id
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                $set: {
                    title,
                    amount: Number(amount),
                    type
                }
            },
            {
                new: true
            }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// DELETE ALL EXPENSES
const deleteAllExpenses = async (req, res) => {

    try {

        const { userId } = req.params;

        await Expense.deleteMany({ userId });

        res.status(200).json({
            message: "All expenses deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};




const getExpenseAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const analytics = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { 
                $group: { 
                    _id: "$category", 
                    totalAmount: { $sum: "$amount" } 
                } 
            }
        ]);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
     addExpense ,
     getExpenses,
     deleteExpenses,
     getExpensesHistory,
     deleteExpense,
     updateExpense,
     deleteAllExpenses,
     getExpenseAnalytics
    };