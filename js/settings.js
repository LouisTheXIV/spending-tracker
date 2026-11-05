
import { currentMonth } from "./calendar.js";

const BUDGET_KEY = "monthlyBudget";
const DAILY_LIMIT_KEY = "dailyLimitOverrides";

let monthlyBudget = Number(
    localStorage.getItem(BUDGET_KEY)
) || 400;

let dailyLimitOverrides = {};

try {
    dailyLimitOverrides = JSON.parse(
        localStorage.getItem(DAILY_LIMIT_KEY)
    ) || {};
} catch {
    dailyLimitOverrides = {};
}


// Format date as YYYY-MM
export function getMonthKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}


// Get monthly budget
export function getMonthlyBudget() {
    return monthlyBudget;
}


// Get daily limit for a specific month
export function getDailyLimit(date) {

    const key = getMonthKey(date);

    // Use custom limit if one exists
    if (dailyLimitOverrides[key] !== undefined) {
        return dailyLimitOverrides[key];
    }

    // Otherwise calculate automatically
    const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    return monthlyBudget / daysInMonth;
}


// Save settings
function saveSettings() {

    const budgetInput = document.getElementById("budget-input");
    const dailyLimitInput = document.getElementById("daily-limit-input");

    const newBudget = Number(budgetInput.value);
    const newDailyLimit = Number(dailyLimitInput.value);

    if (
        !Number.isFinite(newBudget) ||
        newBudget <= 0 ||
        !Number.isFinite(newDailyLimit) ||
        newDailyLimit <= 0
    ) {
        alert("Please enter valid positive amounts.");
        return;
    }

    monthlyBudget = Math.round(newBudget * 100) / 100;

    const key = getMonthKey(currentMonth);

    // Save the daily limit for the displayed month
    dailyLimitOverrides[key] =
        Math.round(newDailyLimit * 100) / 100;

    localStorage.setItem(
        BUDGET_KEY,
        monthlyBudget
    );

    localStorage.setItem(
        DAILY_LIMIT_KEY,
        JSON.stringify(dailyLimitOverrides)
    );

    document.getElementById("settings-modal").style.display = "none";

    // Notify other modules that settings changed
    window.dispatchEvent(new Event("settings-changed"));
}


// Settings popup
const settingsModal = document.getElementById("settings-modal");

document.getElementById("open-settings").addEventListener("click", () => {

    document.getElementById("budget-input").value =
        monthlyBudget.toFixed(2);

    document.getElementById("daily-limit-input").value =
        getDailyLimit(currentMonth).toFixed(2);

    settingsModal.style.display = "flex";
});


document.getElementById("save-settings").addEventListener("click", saveSettings);


document.getElementById("close-settings").addEventListener("click", () => {
    settingsModal.style.display = "none";
});
