const mysql = require('mysql');

const mysqlConection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password : '',
    database: 'uploaddb',
    multipleStatements: true,

}); 

mysqlConection.connect(function (err){

    if (err) {

        console.log(err);
        return;

    }

    else {

        console.log('DataBase online');

    }

});

module.exports = mysqlConection;