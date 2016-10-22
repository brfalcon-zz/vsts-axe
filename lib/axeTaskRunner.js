var documentClient = require("documentdb").DocumentClient;
var path = require('path');
var tl = require('vsts-task-lib/task');
var fs = require('fs');

function AxeTaskRunner(reportFileName){
    this.vstsTask = tl;
    this.reportFileName = reportFileName;
    this.config = this.parseConfiguration();
    this.grunt = this.getGruntInstance();
    this.setGruntArgs(this.grunt, this.config.analysis);
}

AxeTaskRunner.prototype.getGruntInstance = function(){
    var gt = null;
    var gruntInstance = null;

    this.vstsTask.setResourcePath(path.join(__dirname, 'task.json'));
    gt = this.vstsTask.which('grunt', false);

    if (this.vstsTask.exist(gt)) {
        gruntInstance = this.vstsTask.createToolRunner(gt);
    } else {
        var gtcli = null;
        
        gruntInstance = this.vstsTask.createToolRunner(this.vstsTask.which('node', true));
        
        gtcli = this.vstsTask.getInput('gruntCli', true);
        gtcli = path.resolve(cwd, gtcli);
        
        if (this.vstsTask.exist(gtcli)) {
            gruntInstance.pathArg(gtcli);
        }else{
            this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntCliNotInstalled', gtcli));
        }
    }

    return gruntInstance;
}

AxeTaskRunner.prototype.parseConfiguration = function(){
    var config = {
        analysis: {
            urls: this.vstsTask.getInput('urls', false),
            urlfile = this.vstsTask.getInput('urlfile', false),
            tags = this.vstsTask.getInput('tags', false)
        },
        documentDb:{
            databaseId = this.vstsTask.getInput('databaseid', false),
            collectionId = this.vstsTask.getInput('collectionid', false),
            primaryKey = this.vstsTask.getInput('primarykey', false),
            documentUrl = this.vstsTask.getInput('documenturl', false)
        }
    };

    return config;
}

AxeTaskRunner.prototype.parseReportFromFile = function(reportFile){
    var report = fs.readFileSync(`../${reportFileName}`);
    
    return JSON.parse(report);
}

AxeTaskRunner.prototype.saveReportToDocumentDB = function(reportCollection){
    var client = new documentClient(this.config.documentDb.documentUrl, { "masterKey": this.config.documentDb.primaryKey });
    var databaseUrl = `dbs/${this.config.documentDb.databaseId}`;
    var collectionUrl = `${databaseUrl}/colls/${this.config.documentDb.collectionId}`;

    var saveErrors = [];

    reportCollection.forEach(function (report) {
        client.createDocument(collectionUrl, report, function (err, document) {
            if (err) {
                saveErrors.push(err);
            }
        });
    });

    return saveErrors.length == 0;
}

AxeTaskRunner.prototype.setGruntArgs = function(gt, analysisConfig){
    var args = `--urls=${analysisConfig.urls} --urlfile=${analysisConfig.urlfile} --tags=${analysisConfig.tags} --force`; 
    gt.argString(args);
}

AxeTaskRunner.prototype.saveReport = function(code, reportCollection){
    if(this.saveReportToDocumentDB(reportCollection)){
        this.vstsTask.setResult(this.vstsTask.TaskResult.Succeeded, this.vstsTask.loc('GruntReturnCode', code));
    }else{
        this.failTask({message: "Error saving to database"});
    }
}

AxeTaskRunner.prototype.failTask = function(err){
    this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', err.message));
}

AxeTaskRunner.prototype.run = function(){
    var reportCollection = this.parseReportFromFile(this.reportFileName);

    this.grunt
    .exec()
    .then((code) => this.saveReport(code, reportCollection))
    .fail((error) => this.failTask(error));
}

module.exports = AxeTaskRunner;