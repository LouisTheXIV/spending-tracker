import {
    renderExpenses,
    renderMonthlyBudget
} from "./expenses.js";
import { getDailyTotalForDate } from "./expenses.js";
import { getDailyLimit } from "./settings.js";

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");

export const today = new Date();
export let currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
);

export let selectedDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
);

export function renderCalendar() {

    calendar.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    monthYear.textContent = currentMonth.toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay + 6) % 7;

    // create empty spaces before day 1
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const button = document.createElement("button");

        button.textContent = day;
        button.classList.add("calendar-day");

        const date = new Date(year, month, day);
        const todayDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        // Only compare dates up to today
        if (date <= todayDate) {

            const dailySpent = getDailyTotalForDate(date);
            const dailyLimit = getDailyLimit(date);

            if (dailySpent > dailyLimit) {
                button.classList.add("over-limit");
            } else {
                button.classList.add("under-limit");
            }

        }

        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        if (isToday) {
            button.classList.add("today");
        }

        const isSelected =
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();

        if (isSelected) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {

            selectedDate = new Date(year, month, day);

            renderExpenses();

            renderCalendar();

        });

        calendar.appendChild(button);
    }
    renderExpenses();
    renderMonthlyBudget();
}

window.addEventListener("settings-changed", () => {
    renderCalendar();
    renderMonthlyBudget();
    renderExpenses();
});