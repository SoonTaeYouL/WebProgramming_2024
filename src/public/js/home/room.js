"use strict";

var room = document.querySelector("#room");
var color = document.querySelector("#color");

window.onload = function() {
  fetch('../../database/db.json')
    .then(response => response.json())
    .then(data => {
      var rooms = document.querySelectorAll(".color");
      rooms.forEach(function (room) {
        // 방의 예약 상태에 따라 색상을 변경합니다.
        console.log(data);
        if (data.date.color === 1) {
          // 방이 예약되어 있으면 빨간색으로 표시합니다.
          room.style.backgroundColor = "red";
        } else {
          // 방이 예약되어 있지 않으면 초록색으로 표시합니다.
          room.style.backgroundColor = "green";
        }
      });
    })
    .catch(error => console.error('Error:', error));
};




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

// 팝업 창 열기
function openPopup(roomNumber) {
  var popup = document.getElementById("popup");
  var popupTitle = document.getElementById("popupTitle");
  popup.style.display = "block";
  popupTitle.innerText = "Room " + roomNumber + " Reservation";
  document.getElementById("roomNumber").value = roomNumber;
}

// 팝업 창 닫기
function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}

// 예약 저장
function saveReservation() {
  var roomNumber = document.getElementById("roomNumber").value;
  var date = document.getElementById("date").value;
  var guestName = document.getElementById("content1").value;
  var request = document.getElementById("content2").value;

  console.log("Room Number:", roomNumber);
  console.log("Date:", date);
  console.log("Guest Name:", guestName);
  console.log("Request:", request);
  closePopup();
}

window.onload = toggleFloor; // Set initial rooms on page load
