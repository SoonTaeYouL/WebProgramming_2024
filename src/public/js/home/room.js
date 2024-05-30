"use strict";

var rooms = document.querySelectorAll(".room");
var date = localStorage.getItem("date");

async function setColors() {
  try {
    const response = await fetch("/lists");
    const data = await response.json();
    const db_dates = data.reservations[date];
    db_dates.forEach(function (index) {
      let room_id = document.getElementById(index.room);
      if (index.name === "") {
        if (index.room) {
          room_id.style.backgroundColor = "green";
        }
      } else {
        room_id.style.backgroundColor = "red";
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
  // fetch("/lists")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     var db_dates = data.reservations[date];
  //     // lists에서 가져온 데이터로, 방의 색상을 변경합니다.
  //     db_dates.forEach(function (index) {
  //       // 방의 예약 상태에 따라 색상을 변경합니다.
  //       let room_id = document.getElementById(index.room);
  //       // console.log(room_id.id);
  //       if (index.name === "") {
  //         if (index.room) {
  //           room_id.style.backgroundColor = "green";
  //         }
  //       } else {
  //         room_id.style.backgroundColor = "red";
  //       }
  //     });
  //   });
  // .catch((error) => console.error("Error:", error));
}

function toggleFloor() {
  var selectedFloor = document.getElementById("select_room").value;
  var floors = document.querySelectorAll(".floor");
  floors.forEach(function (floor) {
    if (selectedFloor === "floor_none" || floor.id === selectedFloor) {
      floor.style.display = "block";
    } else {
      floor.style.display = "none";
    }
  });
}

// 예약 추가
async function add_reservations() {
  const formData = new FormData();

  var roomNumber = parseInt(document.getElementById("roomNumber").value);
  var date = document.getElementById("content1").value;
  var guestName = document.getElementById("content2").value;
  var new_reservation_code = document.getElementById("content3").value;
  const image = document.getElementById("fileUpload").files[0];

  console.log(guestName);
  if (guestName !== "") {
    var reserv_map = {
      room: roomNumber,
      reservation_code: new_reservation_code,
      name: guestName,
    };
  }

  formData.append("reserv_map", JSON.stringify(reserv_map));
  formData.append("date", date);
  formData.append("image", image);

  try {
    const response = await fetch("/lists", {
      method: "POST",
      body: formData,
    });

    console.log(response);
    closePopup();
    window.location.reload(true);
  } catch (err) {
    console.log(err);
  }
}

// 예약 업데이트
function update_reservations() {
  var roomNumber = parseInt(document.getElementById("roomNumber").value);
  var date = document.getElementById("content1").value;
  var guestName = document.getElementById("content2").value;
  var reservation_code = document.getElementById("content3").value;
  if (guestName === "") {
    var reserv_map = {
      room: roomNumber,
      reservation_code: "",
      name: "",
    };
  } else {
    var reserv_map = {
      room: roomNumber,
      reservation_code: reservation_code,
      name: guestName,
    };
  }
  console.log(reserv_map);
  var req = {
    reserv_map: reserv_map,
    date: date,
  };
  fetch("/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      closePopup();
      window.location.reload(true);
    });
}

// 예약 삭제
function delete_reservations() {
  var roomNumber = parseInt(document.getElementById("roomNumber").value);
  var date = document.getElementById("content1").value;
  // var guestName = document.getElementById("content2").value;
  // var reservation_code = document.getElementById("content3").value;
  var reserv_map = {
    room: roomNumber,
    reservation_code: "",
    name: "",
  };
  console.log(reserv_map);
  var req = {
    reserv_map: reserv_map,
    date: date,
  };
  fetch("/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      closePopup();
      window.location.reload(true);
    });
}
// 팝업 창 열기
function openPopup(roomNumber) {
  fetch("/lists")
    .then((response) => response.json())
    .then((data) => {
      var db_dates = data.reservations[date];
      db_dates.forEach(function (reserv) {
        if (reserv.room === parseInt(roomNumber)) {
          const index = db_dates.indexOf(reserv);
          document.getElementById("content1").value = date;
          document.getElementById("content2").value = db_dates[index].name;
          document.getElementById("content3").value =
            db_dates[index].reservation_code;
          var popup = document.getElementById("popup");
          var popupTitle = document.getElementById("popupTitle");
          popup.style.display = "block";
          popupTitle.innerText = "Room " + roomNumber + " Reservation";
          document.getElementById("roomNumber").value = roomNumber;
          var addormod = document.getElementById("addormod");
          if (document.getElementById("content2").value === "") {
            addormod.innerText = "추가";
            addormod.onclick = add_reservations;
            deletebutton.style.display = "none";
          } else {
            addormod.innerText = "수정";
            addormod.onclick = update_reservations;
            deletebutton.innerText = "삭제";
            deletebutton.onclick = delete_reservations;
            deletebutton.style.display = "inline-block";
          }
        }
      });
    });
  // if (rooms[index].style.backgroundColor === "red") {
  // } else {
  //   alert("예약 가능한 방입니다.");
  // }
}

// room.html에서 일괄 삭제 버튼 클릭 시
// 해당 날짜의 모든 예약을 삭제합니다.
// 단 db.json에 기본 틀이 있어야 합니다. {room: $roomNumber, reservation_code: "", name: ""}
function alldelete() {
  var req = {
    date: date,
  };
  fetch("/alldel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      window.location.reload(true);
    });
}
// 팝업 창 닫기
function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}

window.onload = function () {
  setColors();
  toggleFloor(); // Set initial rooms on page load
};
