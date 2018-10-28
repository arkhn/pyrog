var faker = require('faker/locale/fr');

var columns = [];

for (var column = 0; column < 10; column++) {
    var rows = [];

    for (var i = 0; i < 15; i++) {
        rows.push(faker.name.firstName());
    }

    columns.push({
        owner: faker.database.column().toUpperCase(),
        table: faker.database.column().toUpperCase(),
        column: faker.database.column().toUpperCase(),
        rows: rows,
    });
}

console.log(columns)
