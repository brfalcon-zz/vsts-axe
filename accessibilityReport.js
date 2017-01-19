var SQLConnection = require('./sqlconnection.js');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function AccessibilityReport(file){
    this.connection = new SQLConnection();
    this.reportFile = file;
};

AccessibilityReport.prototype.AddNewReport = function(){
    this.connection.init();
    this.connection.onConnect(this.insertNewExecution, this);
};

AccessibilityReport.prototype.insertNewExecution = function(context){
    var insertedId = 0;

    var request = new Request("INSERT INTO Execution (ExecutionDate) OUTPUT inserted.Id VALUES (@executionDate)", function(err) {  
        if (err) {  
            console.log(err);
            process.exit();
        }
        else
        {
            context.insertExecutionResults(insertedId);
        }
    });  

    request.addParameter('executionDate', TYPES.DateTime, new Date());

    request.on('row', function(insertedExecution) {  
        if(insertedExecution.length == 1){
            insertedId = insertedExecution[0].value;
        } 
    });     

    context.connection.execRequest(request); 
};

AccessibilityReport.prototype.readResultsFromFile = function(file){
    var fs = require('fs');

    if(fs.existsSync(file)){
        var results = fs.readFileSync(file);
        var jsonResults = JSON.parse(results);

        return jsonResults;
    }else{
        console.error('File ' + file + ' not found');
        process.exit();
    }
}

AccessibilityReport.prototype.parseResultsToBulkRows = function(executionId, results){
    var rows = [];

    results.forEach(function(result){
        var violations = result.violations;
        var passes = result.passes;
        var url = result.url;

        violations.forEach(function(violation) {
            rows.push({
                ExecutionId: executionId,
                TestName: violation.id,
                StartTime: null,
                EndTime: null,
                Passed: "Failed",
                EMAG: null,
                WCAG: violation.tags.join(" "),
                Category: null,
                Priority: violation.impact,
                URL: url,
                Type: null
            });
        });

        passes.forEach(function(pass){
            rows.push({
                ExecutionId: executionId,
                TestName: pass.id,
                StartTime: null,
                EndTime: null,
                Passed: "Passed",
                EMAG: null,
                WCAG: pass.tags.join(" "),
                Category: null,
                Priority: "",
                URL: url,
                Type: null
            });
        });
    });

    return rows;
}

AccessibilityReport.prototype.runBulkLoad = function(load){
    var bulkLoad = this.connection.newBulkLoad('Results', function (error, rowCount) {
        console.log('inserted %d rows', rowCount);
        process.exit();
    });

    bulkLoad.addColumn('ExecutionId', TYPES.BigInt, { nullable: false });
    bulkLoad.addColumn('TestName', TYPES.VarChar, { length: 255, nullable: false });
    bulkLoad.addColumn('StartTime', TYPES.DateTime, { nullable: true });
    bulkLoad.addColumn('EndTime', TYPES.DateTime, { nullable: true });
    bulkLoad.addColumn('Passed', TYPES.VarChar, { length: 20, nullable: false });
    bulkLoad.addColumn('EMAG', TYPES.VarChar, { length: 50, nullable: true });
    bulkLoad.addColumn('WCAG', TYPES.VarChar, { length: 50, nullable: true });
    bulkLoad.addColumn('Category', TYPES.VarChar, { length: 25, nullable: true });
    bulkLoad.addColumn('Priority', TYPES.VarChar, { length: 20, nullable: false });
    bulkLoad.addColumn('URL', TYPES.VarChar, { length: 255, nullable: false });
    bulkLoad.addColumn('Type', TYPES.VarChar, { length: 10, nullable: true });

    load.forEach(function(item){
        bulkLoad.addRow(item);
    });

    this.connection.execBulkRequest(bulkLoad);
}

AccessibilityReport.prototype.insertExecutionResults = function(executionId){
    var results = this.readResultsFromFile(this.reportFile);

    var bulkRows = this.parseResultsToBulkRows(executionId, results);

    this.runBulkLoad(bulkRows);
}

module.exports = AccessibilityReport;
