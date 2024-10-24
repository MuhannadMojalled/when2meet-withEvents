const startTimeSelectElem = document.getElementById('start-time');
const endTimeSelectElem = document.getElementById('end-time');

let startTime = 8;
let endTime = 17;



populateDropdownMenu(startTimeSelectElem, 8);
populateDropdownMenu(endTimeSelectElem, 17);

function populateDropdownMenu(selectElem, selectedValue) {
    for (let i = 0; i < 24; i++) {
        let optionElem = document.createElement('option');
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00';
        hour += i < 12 ? ' AM' : ' PM';
        optionElem.text = hour;
        optionElem.value = i;
        if (i == selectedValue) {
            optionElem.selected = true;
        }
        selectElem.appendChild(optionElem);
    }
}

startTimeSelectElem.addEventListener('change', function () {
    startTime = parseInt(this.value);
    console.log(startTime);
    createTimeTable();
});

endTimeSelectElem.addEventListener('change', function () {
    endTime = parseInt(this.value);
    console.log(endTime);
    createTimeTable();
});

function createTimeTable() {
    const divContainer = document.getElementById('timeTable');

    let tableHtml = '<table><thead><tr><th></th>';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    days.forEach(day => {
        tableHtml += `<th class='day-header'>${day}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = startTime; i <= endTime; i++) {
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00';
        hour += i < 12 ? ' AM' : ' PM';

        tableHtml += '<tr>';
        tableHtml += `<td class='time-label'>${hour}</td>`;
        days.forEach(day => {
            tableHtml += `
            <td class="time-slot"
            onClick="toggleTimeSlot(this)"
            date-day=${day}
            date-time=${hour}>
            
            </td>`;

        })
        tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table>';
    divContainer.innerHTML = tableHtml;


}

const selectedTimeSlots = new Set();
function toggleTimeSlot(tdElem) {
    const timeSlotId = `${tdElem.dataset.day}-${tdElem.dataset.time}`;
    if (selectedTimeSlots.has(timeSlotId)) {
        selectedTimeSlots.delete(timeSlotId);
        tdElem.classList.remove('selected');
    } else {
        selectedTimeSlots.add(timeSlotId);
        tdElem.classList.add('selected');
    }
}

document.getElementById('submitMeeting').addEventListener('click', async function () {
    const userName = document.getElementById('user-name').value;
    const eventName = document.getElementById('event-name').value;
    if (userName === '' || eventName === '') {
        alert('Please enter your name and event name');
        return;
    }
    const bodyPayload = {
        userName,
        eventName,
        timeSlots: Array.from(selectedTimeSlots)
    };
    console.log(bodyPayload);
    const API_URL = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log(`we got back this from the server `);
    console.log(data);

});
createTimeTable();