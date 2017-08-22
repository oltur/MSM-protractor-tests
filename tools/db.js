const testData = require('../json/test-data.json');
const sql = require('mssql');

class Db {

    constructor() {
    }

    getData() {

        return sql.connect('mssql://sa:sa@localhost/FreedomSite')
        .then(pool => {
            return pool.request()
                //.input('input_parameter', sql.Int, value)
                .query("select * from DpnDatabaseProperties where Name ='Database Version'")
        }).then(result => {
            return Promise.resolve(JSON.stringify(result.recordset[0].Value));
        });

    }
}

exports.getInstance = () => new Db();