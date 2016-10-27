'use strict'

var documentDbClient = require('documentdb').DocumentClient;
const path = require('path');
const tl = require('vsts-task-lib/task');
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
    var gruntFile = 'Gruntfile.js';

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

    gruntInstance.arg('--gruntfile');
    gruntInstance.pathArg(gruntFile);

    return gruntInstance;
}

AxeTaskRunner.prototype.parseConfiguration = function(){
    var config = {
        analysis: {
            urls: this.vstsTask.getInput('urls', false) || 'http://www.google.com',
            urlfile: this.vstsTask.getInput('urlfile', false) || '',
            tags: this.vstsTask.getInput('tags', false) || ''
        },
        documentDb:{
            documentUrl: this.vstsTask.getInput('documenturl', false) || 'https://accesscheck.documents.azure.com',
            primaryKey: this.vstsTask.getInput('primarykey', false) || 'qNRJ2ZF54py0VCm0nZ4OKx6DrpKWa4fQNSkWD7U1VfLkE4eBq3xz5lKJgj3fKklfu1IEVR9nQf3cb71fi2IwaA==',
            databaseId: this.vstsTask.getInput('databaseid', false) || 'NewPortal',
            collectionId: this.vstsTask.getInput('collectionid', false) || 'TJSP'
        }
    };

    return config;
}

AxeTaskRunner.prototype.parseReportFromFile = function(reportFile){
    var absoluteFilePath = path.resolve(reportFile);
    var report = fs.readFileSync(absoluteFilePath);
    
    return JSON.parse(report);
}

AxeTaskRunner.prototype.saveReportToDocumentDB = function(gruntReturnCode, reportCollection){
    var self = this;
    var client = new documentDbClient(this.config.documentDb.documentUrl, { "masterKey": this.config.documentDb.primaryKey });
    var databaseUrl = `dbs/${this.config.documentDb.databaseId}`;
    var collectionUrl = `${databaseUrl}/colls/${this.config.documentDb.collectionId}`;
    
    var remaingSavingChecks = reportCollection.length;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    reportCollection.forEach(function (report) {
        var roundsToCheck = reportCollection.length;
        var saveErrors = [];
        client.createDocument(collectionUrl, report, (err, document) => {
            if(err){
                saveErrors.push(err);
            }

            remaingSavingChecks--;

            if(remaingSavingChecks <= 0){
                self.finishTask(gruntReturnCode, roundsToCheck, saveErrors);
            }
        });
    });
}

AxeTaskRunner.prototype.setGruntArgs = function(gt, analysisConfig){
    var args = `--urls=${analysisConfig.urls} --urlfile=${analysisConfig.urlfile} --tags=${analysisConfig.tags} --force`; 
    gt.argString(args);
}

AxeTaskRunner.prototype.saveReport = function(gruntReturnCode, reportCollection){
    this.saveReportToDocumentDB(gruntReturnCode, reportCollection);
}

AxeTaskRunner.prototype.finishTask = function(gruntReturnCode, roundsToCheck, saveErrors){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
    
    if(saveErrors.length == 0){
        this.vstsTask.setResult(this.vstsTask.TaskResult.Succeeded, this.vstsTask.loc('GruntReturnCode', gruntReturnCode));
    }else if( saveErrors.length < roundsToCheck){
        this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', `Failed to save ${saveErrors.length} documents to the database!`));
    }else{
        this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', `Failed to save all documents to the database! Reason : ${saveErrors[0].message}`));
    }
}

AxeTaskRunner.prototype.run = function(){
    var reportCollection = this.parseReportFromFile(this.reportFileName);

    this.grunt
    .exec()
    .then((gruntReturnCode) => this.saveReport(gruntReturnCode, reportCollection))
    .fail((error) => this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', error.message)));
}

module.exports = AxeTaskRunner;