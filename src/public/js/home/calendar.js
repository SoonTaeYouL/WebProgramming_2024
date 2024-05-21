"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    dateClick: function (info) {
    //   alert(info.dateStr);
      reserv(info.dateStr);
    },
    headerToolbar: {
      start: "dayGridMonth,timeGridWeek,timeGridDay", // headerToolbar에 버튼을 추가
      center: "title",
      end: "addEventButton today prev,next", // 스페이스-버튼띄움 ,-붙여서 생성
    },
    customButtons: {
      addEventButton: {
        // 추가한 버튼 설정
        text: "일정 추가", // 버튼 내용
        click: function () {
          // 버튼 클릭 시 이벤트 추가
          // 이벤트 추가 동작 구현
          var title = prompt("Event Title:");
          var dateStr = prompt("Enter a date in YYYY-MM-DD format:");
          var date = new Date(dateStr + "T00:00:00"); // will be in local time

          if (!isNaN(date.valueOf())) {
            // valid?
            calendar.addEvent({
              title: title,
              start: date,
              allDay: true,
            });
            alert("Great. Now, update your database...");
          } else {
            alert("Invalid date.");
          }
        },
      },
    },
  });
  calendar.render();
});

function reserv(date) {
  var req = {
    date: date,
  };
  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
        if (res.success && res.reservations.length > 0) {
            let reservations = res.reservations.map(r => `Room: ${r.room}, Code: ${r.reservation_code}, Name: ${r.name}`).join('\n');
            alert(`Reservations for ${date}:\n${reservations}`);
        } else {
            // alert('예약이 없습니다.');
            alert(`Reservations for ${date}:\n${reservations}`);
        }
    });
};

// document.addEventListener("DOMContentLoaded", function () {
//   const calendarEl = document.getElementById("calendar");
//   const calendar = new FullCalendar.Calendar(calendarEl, {
//     initialView: "dayGridMonth",
//     dateClick: function (info) {
//       alert(info.dateStr);
//       console.log(jsonData);
//     },
//   });
//   calendar.render();
// });

// reservbtn.addEventListener("click", reserv);

// function reserv() {
//   var req = {
//     text: text.value,
//   };
//   fetch("/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(req),
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.success) {
//         alert(text.value);
//       } else {
//         alert(res.msg);
//       }
//     });
// }
