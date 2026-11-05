
import { selectedDate, currentMonth } from "./calendar.js";
import {
    getMonthlyBudget,
    getDailyLimit
} from "./settings.js";


// Get total expenses for a specific date
export function getDailyTotalForDate(date) {

    const dateString = dateToString(date);

    return expenses.reduce((total, expense) => {

        if (expense.date === dateString) {
            return total + Math.round(expense.amount * 100);
        }

        return total;

    }, 0) / 100;
}

// LocalStorage key
const STORAGE_KEY = "monthlyExpenses";

let expenses = [];

try {
    expenses = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];
} catch (error) {
    console.error("Could not load expenses:", error);
    expenses = [];
}


// HTML elements
const modal = document.getElementById("expense-modal");
const addButton = document.getElementById("add-expense");
const cancelButton = document.getElementById("cancel-expense");
const expenseForm = document.getElementById("expense-form");

const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseList = document.getElementById("expense-list");


// Convert a Date into YYYY-MM-DD using local time
function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Save expenses permanently
function saveExpenses() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(expenses)
    );
}


// Open popup
addButton.addEventListener("click", () => {
    modal.style.display = "flex";
    expenseName.focus();
});


// Close popup
cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
    expenseForm.reset();
});


// Add expense
expenseForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);

    if (
        !name ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return;
    }

    const expense = {
        id: crypto.randomUUID(),
        name: name,
        amount: Math.round(amount * 100) / 100,
        date: dateToString(selectedDate)
    };

    expenses.push(expense);

    saveExpenses();
    renderExpenses();
    renderMonthlyBudget();

    expenseForm.reset();
    modal.style.display = "none";
});


// Delete expense
function deleteExpense(id) {

    expenses = expenses.filter(expense =>
        expense.id !== id
    );

    saveExpenses();

    renderExpenses();
    renderMonthlyBudget();
}


// Display expenses for selected day
export function renderExpenses() {

    expenseList.innerHTML = "";

    const selectedDateString = dateToString(selectedDate);

    const dailyExpenses = expenses.filter(expense =>
        expense.date === selectedDateString
    );

    // Calculate daily total in cents
    const dailyTotal = dailyExpenses.reduce(
        (total, expense) =>
            total + Math.round(expense.amount * 100),
        0
    );

    document.getElementById("daily-total").textContent =
        `€${(dailyTotal / 100).toFixed(2)}`;


    dailyExpenses.forEach(expense => {

        const item = document.createElement("div");
        item.classList.add("expense-item");

        const name = document.createElement("span");
        name.classList.add("expense-name");
        name.textContent = expense.name;

        const amount = document.createElement("span");
        amount.classList.add("expense-amount");
        amount.textContent = `€${expense.amount.toFixed(2)}`;

        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-expense");
        deleteButton.textContent = "🗑";
        deleteButton.title = "Delete expense";

        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.id);
        });

        item.append(name, amount, deleteButton);

        expenseList.appendChild(item);
    });
}


// Calculate monthly budget
export function renderMonthlyBudget() {

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthPrefix =
        `${year}-${String(month + 1).padStart(2, "0")}`;

    // Find expenses belonging to displayed month
    const monthlyExpenses = expenses.filter(expense =>
        expense.date.startsWith(monthPrefix)
    );

    // Calculate total in cents
    const totalSpent = monthlyExpenses.reduce(
        (total, expense) =>
            total + Math.round(expense.amount * 100),
        0
    );

    const budgetInCents = getMonthlyBudget() * 100;
    const remaining = budgetInCents - totalSpent;

    document.getElementById("total-spent").textContent =
        `€${(totalSpent / 100).toFixed(2)}`;

    document.getElementById("remaining-budget").textContent =
        `€${(remaining / 100).toFixed(2)}`;
}
