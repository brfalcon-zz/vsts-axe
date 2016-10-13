var ConnectionFactory = require('tedious').Connection;

function Connection(){
    this.connection = null;
}

Connection.prototype.init = function (){    
    var config = {
        userName : "poc-owner@poc-accessibilitydbserver",
        password : "**contoso2016**",
        server   : "poc-accessibilitydbserver.database.windows.net",
        options  : {
            encrypt: true, 
            database: "tests_db",
            rowCollectionOnDone: true
        }
    };
    
    this.connection = new ConnectionFactory(config);    
};

Connection.prototype.onConnect = function (callback, context){
    this.connection.on('connect', function (err){
        if(err){
            console.log(err.message);
            process.exit();
        }else{
            console.log("Connected!");
            callback(context);
        }
    });
}

Connection.prototype.execRequest = function(request){
    this.connection.execSql(request);
}

Connection.prototype.newBulkLoad = function(table, callback){
    return this.connection.newBulkLoad(table, callback);
}

Connection.prototype.execBulkRequest = function(bulkLoad){
    this.connection.execBulkLoad(bulkLoad);
}

module.exports = Connection;