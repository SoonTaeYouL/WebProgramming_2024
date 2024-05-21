const fs = require('fs');

const jsonFile = fs.readFileSync('./db.json', 'utf8');
const jsonData = JSON.parse(jsonFile);

const reserv = jsonData.reservations;
reserv.forEach(reserv => {
    console.log(reserv.name);
});

module.exports = {
    reserv,
};