"use strict";

// const fs = require("fs");
// import fs from "fs";
var rooms = document.querySelectorAll(".room");
var date = localStorage.getItem('date');


function setColors() {
  fetch("/lists")
    .then((response) => response.json())
    .then((data) => {
      let db_dates = data.reservations[date];
      // lists에서 가져온 데이터로, 방의 색상을 변경합니다.
      db_dates.forEach(function (index) {
        // 방의 예약 상태에 따라 색상을 변경합니다.
        let room_id = document.getElementById(index.room);
        // console.log(room_id.id);
        if (index.color === 1) {
          if(index.room){
            room_id.style.backgroundColor = "red";
          }
        } else {
          room_id.style.backgroundColor = "green";
        }
      })
    })
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

function update_reservations() {
  var roomNumber = document.getElementById("roomNumber").value;
  var date = document.getElementById("content1").value;
  var guestName = document.getElementById("content2").value;
  var reservation_code = document.getElementById("content3").value;
  if (guestName === ""){
    var reserv_map = {color:0, room:roomNumber, reservation_code:"", name:""};
  } else {
    var reserv_map = {color:1, room:roomNumber, reservation_code: reservation_code,name:guestName};
  }
  console.log(reserv_map);
  var req = {
    reserv_map:reserv_map,
    date:date,
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
    });
}

// 팝업 창 열기
function openPopup(roomNumber) {
  let index = parseInt(roomNumber.toString().slice(2))-1;
 
  if (rooms[index].style.backgroundColor === "red") {
    alert("이미 예약된 방입니다.");
    fetch("/lists").then((response) => response.json())
    .then((data) => {
      let db_dates = data.reservations[date];
      document.getElementById("content1").value = date;
      document.getElementById("content2").value = db_dates[index].name;
      document.getElementById("content3").value = db_dates[index].reservation_code ;

      // update_reservations({ "color": 1, "room": 201, "reservation_code": 111, "name": "asd faef" },index,date);
    }
    )
  } else {
    alert("예약 가능한 방입니다.");
  }
  
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

window.onload = function () {
  setColors();
  toggleFloor(); // Set initial rooms on page load
};
