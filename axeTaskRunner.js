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
            loginurl: this.vstsTask.getInput('loginurl', false) || "http://tst01.tjsp.jus.br/RHF/Acesso/Login/SignIn?ReturnUrl=%2FRHF%2FAcesso%2Fwsfederation%3Fwa%3Dwsignin1.0%26wtrealm%3Dhttp%253a%252f%252ftst01.tjsp.jus.br%252fRHF%252fRecepcaoDocumentos%252f%26wctx%3Drm%253d0%2526id%253dpassive%2526ru%253d%25252fRHF%25252fRecepcaoDocumentos%26wct%3D2017-05-31T21%253a46%253a59Z",
            userControlName: this.vstsTask.getInput('userControlName', false) || "//input[@id='Usuario']",
            passControlName: this.vstsTask.getInput('passControlName', false) || "//input[@id='Senha']",
            user: this.vstsTask.getInput('user', false) || "33978834820",
            pass: this.vstsTask.getInput('pass', false) || "12345678",
            titleToWait: this.vstsTask.getInput('titleToWait', false) || "ID3206: A SignI",            
            loginButtonName: this.vstsTask.getInput('loginButtonName', false) || "//button[@type='submit']",
            urls: this.vstsTask.getInput('urls', false) || '',
            urlfile: this.vstsTask.getInput('urlfile', false) || path.resolve('urlsToAnalyze/all.txt'),
            tags: this.vstsTask.getInput('tags', false) || ''
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
    
    var remaingUnsavedReports = reportCollection.length;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    reportCollection.forEach(function (report) {
        var reportsToSave = reportCollection.length;
        var reportsFailedSaving = [];
        client.createDocument(collectionUrl, report, (err, document) => {
            if(err){
                reportsFailedSaving.push(err);
            }

            remaingUnsavedReports--;

            if(remaingUnsavedReports <= 0){
                self.finishTask(gruntReturnCode, reportsToSave, reportsFailedSaving);
            }
        });
    });
}

AxeTaskRunner.prototype.setGruntArgs = function (gt, analysisConfig){
    'use strict';

    if (analysisConfig.urls){
        gt.arg("--urls");
        gt.pathArg(analysisConfig.urls);
    }

    
    if (analysisConfig.urlfile){
        gt.arg("--urlfile");
        gt.pathArg(analysisConfig.urlfile);
    }

    if (analysisConfig.tags){
        gt.arg("--tags");
        gt.pathArg(analysisConfig.tags);
    }

    if (analysisConfig.loginurl){
        gt.arg("--loginurl");
        gt.pathArg(analysisConfig.loginurl);
    }
    if (analysisConfig.userControlName){
        gt.arg("--userControlName");
        gt.pathArg(analysisConfig.userControlName);
    }
    if (analysisConfig.passControlName){
        gt.arg("--passControlName");
        gt.pathArg(analysisConfig.passControlName);
    }
    if (analysisConfig.user){
        gt.arg("--user");
        gt.pathArg(analysisConfig.user);
    }
    if (analysisConfig.pass){
        gt.arg("--pass");
        gt.pathArg(analysisConfig.pass);
    }
    if (analysisConfig.titleToWait){
        gt.arg("--titleToWait");
        gt.pathArg(analysisConfig.titleToWait);
    }

     if (analysisConfig.loginButtonName){
        gt.arg("--loginButtonName");
        gt.pathArg(analysisConfig.loginButtonName);
    }






    gt.arg("--force");
}

AxeTaskRunner.prototype.saveReport = function(gruntReturnCode, reportCollection){
    this.saveReportToDocumentDB(gruntReturnCode, reportCollection);
}

AxeTaskRunner.prototype.finishTask = function(gruntReturnCode, reportsToSave, reportsFailedSaving){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
    var errorMessage = '';

    if(reportsFailedSaving.length == 0){
        this.vstsTask.setResult(this.vstsTask.TaskResult.Succeeded, this.vstsTask.loc('GruntReturnCode', gruntReturnCode));
    }else if( reportsFailedSaving.length < reportsToSave){
        
        if(reportsFailedSaving[0].body){
            errorMessage = JSON.parse(reportsFailedSaving[0].body).message;
        }else{
            errorMessage = reportsFailedSaving[0];
        }
        
        this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', `Failed to save ${reportsFailedSaving.length} reports to the database! Reason: ${errorMessage}`));
    }else{

        if(reportsFailedSaving[0].body){
            errorMessage = JSON.parse(reportsFailedSaving[0].body).message;
        }else{
            errorMessage = reportsFailedSaving[0];
        }

        this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', `Failed to save all reports to the database! Reason : ${errorMessage}`));
    }
}

AxeTaskRunner.prototype.run = function(){
    var reportCollection = this.parseReportFromFile(this.reportFileName);

    this.grunt
    .exec()
    .then((gruntReturnCode) => /*this.saveReport(gruntReturnCode, reportCollection)*/ this.vstsTask.setResult(this.vstsTask.TaskResult.Succeeded, this.vstsTask.loc('GruntReturnCode', gruntReturnCode)))
    .fail((error) => this.vstsTask.setResult(this.vstsTask.TaskResult.Failed, this.vstsTask.loc('GruntFailed', error.message)));
}

module.exports = AxeTaskRunner;