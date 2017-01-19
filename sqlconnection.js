var SQLConnectionFactory = require('tedious').Connection;

function SQLConnection(){
    this.connection = null;
}

SQLConnection.prototype.init = function (){    
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
    
    this.connection = new SQLConnectionFactory(config);    
};

SQLConnection.prototype.onConnect = function (callback, context){
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

SQLConnection.prototype.execRequest = function(request){
    this.connection.execSql(request);
}

SQLConnection.prototype.newBulkLoad = function(table, callback){
    return this.connection.newBulkLoad(table, callback);
}

SQLConnection.prototype.execBulkRequest = function(bulkLoad){
    this.connection.execBulkLoad(bulkLoad);
}

module.exports = SQLConnection;