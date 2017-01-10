var databaseid = 'NewPortal';
var collectionid = 'TJSP';
var documenturl = 'https://accesscheck.documents.azure.com:443';
var primarykey =  'qNRJ2ZF54py0VCm0nZ4OKx6DrpKWa4fQNSkWD7U1VfLkE4eBq3xz5lKJgj3fKklfu1IEVR9nQf3cb71fi2IwaA=='; 
var databaseUrl = `dbs/${databaseid}`;
var collectionUrl = `${databaseUrl}/colls/${collectionid}`;



var documentClient = require("documentdb").DocumentClient;
var client = new documentClient(documenturl, { "masterKey": primarykey });

var fs = require('fs');
var results = fs.readFileSync('output.json');
var documentDefinition = JSON.parse(results);


documentDefinition.forEach(function(doc) {
    client.createDocument
    (collectionUrl, doc, function (err, document) {
            if (err) {
                tl.setResult(tl.TaskResult.Failed, tl.loc('Erro to save in DocumentDB', err.message));
            } 
     }
    );

        }
    );
   