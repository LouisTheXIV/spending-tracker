import { renderCalendar } from "./js/calendar.js"
import * as calendar from "./js/calendar.js"
import "./js/expenses.js"
import "./js/settings.js";

let currentMonth = calendar.currentMonth
let selectedDate = calendar.selectedDate

// function updateSelectedDate() {

//     // selectedDateLabel.textContent =
//     //     selectedDate.toLocaleDateString(
//     //         "en-US",
//     //         {
//     //             day: "numeric",
//     //             month: "long",
//     //             year: "numeric"
//     //         }
//     //     );
// }

document.getElementById("prev-month").addEventListener("click", () => {

    currentMonth.setMonth(currentMonth.getMonth() - 1);

    renderCalendar();
});


document.getElementById("next-month").addEventListener("click", () => {

    currentMonth.setMonth(currentMonth.getMonth() + 1);

    renderCalendar();
});


renderCalendar();