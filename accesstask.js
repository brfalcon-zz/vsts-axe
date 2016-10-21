const path = require('path');
const tl = require('vsts-task-lib/task');

tl.setResourcePath(path.join(__dirname, 'task.json'));

var gruntFile = 'Gruntfile.js'
var grunt = tl.which('grunt', false);

tl.debug('check path : ' + grunt);

if (!tl.exist(grunt)) {
    tl.debug('not found global installed grunt-cli, try to find grunt-cli locally.');
    var gt = tl.createToolRunner(tl.which('node', true));
    var gtcli = tl.getInput('gruntCli', true);
    gtcli = path.resolve(cwd, gtcli);
    tl.debug('check path : ' + gtcli);
    if (!tl.exist(gtcli)) {
        tl.setResult(tl.TaskResult.Failed, tl.loc('GruntCliNotInstalled', gtcli));
    }
    gt.pathArg(gtcli);
}
else {
    var gt = tl.createToolRunner(grunt);
}

var urls = tl.getInput('urls', false);
var urlfile = tl.getInput('urlfile', false);
var tags = tl.getInput('tags', false);
var databaseid = tl.getInput('databaseid', false);
var collectionid = tl.getInput('collectionid', false);
var documenturl = tl.getInput('documenturl', false);
var primarykey = tl.getInput('primarykey', false);
var gruntargs =  '--urls=' + urls + ' --urlfile=' + urlfile + '  --tags='  + tags + ' --force' ;
var reportFileName = reportFileName || "output.json";
var fs = require('fs');
var results = fs.readFileSync(reportFileName);
var documentDefinition = JSON.parse(results);
var documentClient = require("documentdb").DocumentClient;
var client = new documentClient(documenturl, { "masterKey": primarykey });
var databaseUrl = `dbs/${databaseid}`;
var collectionUrl = `${databaseUrl}/colls/${collectionid}`;

gt.argString(gruntargs);
gt.exec().then(function (code) {
gt.arg();
gt.arg('--gruntfile');
gt.pathArg(gruntFile);



documentDefinition.forEach(function(doc) {
    client.createDocument(collectionUrl, doc, function (err, document) {
            if (err) {
                tl.setResult(tl.TaskResult.Failed, tl.loc('Erro to save in DocumentDB', err.message));
            } 
    });

        }, this
    );
    tl.setResult(tl.TaskResult.Succeeded, tl.loc('GruntReturnCode', code));
    }).fail(function (err) {
        tl.debug('taskRunner fail');
        tl.setResult(tl.TaskResult.Failed, tl.loc('GruntFailed', err.message));
    }
);