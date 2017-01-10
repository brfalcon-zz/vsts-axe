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

urls= 'http://hwww.tjsp.jus.br/,http://hwww.tjsp.jus.br/Links/PublicoInterno,http://hwww.tjsp.jus.br/Links/Index,http://hwww.tjsp.jus.br/PoderJudiciario/PoderJudiciario/OrgaosDaJustica,http://hwww.tjsp.jus.br/ConhecaOTJ,http://hwww.tjsp.jus.br/TribunalPleno,http://hwww.tjsp.jus.br/OrgaoEspecial/OrgaoEspecial/Apresentacao,http://hwww.tjsp.jus.br/ConselhoSuperiorMagistratura,http://hwww.tjsp.jus.br/ConhecaOTJ/Presidencia,http://hwww.tjsp.jus.br/ConhecaOTJ/VicePresidencia,http://hwww.tjsp.jus.br/Corregedoria,http://hwww.tjsp.jus.br/Decanato,http://hwww.tjsp.jus.br/SecaoDireitoCriminal,http://hwww.tjsp.jus.br/SecaoDireitoPrivado,http://hwww.tjsp.jus.br/SecaoDireitoPublico,http://hwww.tjsp.jus.br/PrimeiraInstancia/GestaoDocumental,http://hwww.tjsp.jus.br/Processos,http://hwww.tjsp.jus.br/Certidoes/Certidoes/CertidoesPrimeiraInstancia,http://hwww.tjsp.jus.br/ListaTelefonica,http://hwww.tjsp.jus.br/CanaisComunicacao/Feriados/ExpedienteForense,http://hwww.tjsp.jus.br/PrimeiraInstancia/Arquivo/FAQ_Default,http://hwww.tjsp.jus.br/Especialidade/Especialidade/Civel,http://hwww.tjsp.jus.br/Especialidade/Especialidade/Criminal,http://hwww.tjsp.jus.br/Especialidade/Especialidade/ExecucoesFiscais,http://hwww.tjsp.jus.br/Especialidade/Especialidade/FamiliaSucessoes,http://hwww.tjsp.jus.br/Especialidade/Especialidade/FazendaPublica,http://hwww.tjsp.jus.br/Especialidade/Especialidade/InfanciaJuventude,http://hwww.tjsp.jus.br/Especialidade/Especialidade/Juizados,http://hwww.tjsp.jus.br/Especialidade/Especialidade/ViolenciaDomesticaFamiliar,http://hwww.tjsp.jus.br/Especialidade/Especialidade/FalenciasRecuperacoesJudiciaisConflitos,http://hwww.tjsp.jus.br/Depre/Comunicados?reaComunicado=PequenoValorUnidadesPublicas,http://hwww.tjsp.jus.br/Conciliacao,http://hwww.tjsp.jus.br/Conciliacao/SegundaInstancia,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/AutorizacaoViagemMenor,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/CartasPrecatorias,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/CartasRogatorias,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/DivorcioLitigioso,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/HastasPublicas,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/InvestigacaoPaternidade,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/PensaoAlimenticia,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/RegulamentacaoVisitas,http://hwww.tjsp.jus.br/Biblioteca,http://hwww.tjsp.jus.br/Sistemas_DJE,http://hwww.tjsp.jus.br/Enunciados,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ContasPublicas_ExecucaoOrcamentariaFinanceir,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ContasPublicas_OrcamentoAnual_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ControleInterno_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/Licitacoes_Default,http://hwww.tjsp.jus.br/ConhecaOTJ/PlanejamentoEstrategico,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ContasPublicas_RelatoriosGestaoFiscal_Defaul,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/UnidadeGerenciamentoProjetos_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/PlanoPlurianual_Default,http://hwww.tjsp.jus.br/CanaisAtendimentoRelacionamento/FaleConosco,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ResCNJ79_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ResCNJ102_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/ResCNJ195_Default,http://hwww.tjsp.jus.br/CanaisComunicacao/Transparencia/Produtividade_Default,http://hwww.tjsp.jus.br/Corregedoria/Estatisticas,http://hwww.tjsp.jus.br/JusticaBandeirante,http://hwww.tjsp.jus.br/ConhecaOTJ/MunEmpAmigosJustica,http://hwww.tjsp.jus.br/Corregedoria/Corregedoria/FaleComCorregedoria,http://hwww.tjsp.jus.br/Museu,http://hwww.tjsp.jus.br/ConhecaOTJ/ConhecaOTJ/VisitaMonitorada,http://hwww.tjsp.jus.br/Imprensa/Imprensa/Contato,http://hwww.tjsp.jus.br/Imprensa/Imprensa/MaterialDivulgacao,http://hwww.tjsp.jus.br/Imprensa/MateriasEspeciais,http://hwww.tjsp.jus.br/Noticias,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=36682,http://hwww.tjsp.jus.br/InformacoesGerais/InformacoesGerais/LinksDeInteresse,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=37751,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=37749,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=37744,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=37748,http://hwww.tjsp.jus.br/IndicesTaxasJudiciarias/DespesasProcessuais,http://hwww.tjsp.jus.br/Depre,http://hwww.tjsp.jus.br/Noticias/Noticia?codigoNoticia=36668,http://hwww.tjsp.jus.br/UtilidadePublica/UtilidadePublica/DenunciasMaustratosContraMenores,http://hwww.tjsp.jus.br/Corregedoria/JuizadosEspeciais,http://hwww.tjsp.jus.br/Corregedoria/Corregedoria/NormasExtrajudicial,http://hwww.tjsp.jus.br/Corregedoria/Corregedoria/NormasJudiciais,http://hwww.tjsp.jus.br/Comesp/Mapas/MunicipiosSaoPaulo,http://hwww.tjsp.jus.br/Nurer/Nurer/Irdr,http://hwww.tjsp.jus.br/Museu/Museu/Redacao,http://hwww.tjsp.jus.br/InformacoesGerais/InformacoesGerais/OAB,http://hwww.tjsp.jus.br/Segmento/Magistrados/Designacoes';

//urlfile = 'tjspH.url';
databaseid = '';
collectionid = '';
documenturl = '';
primarykey =  ''; 

var gruntargs =  '--urls=' + urls + ' --urlfile=' + urlfile + '  --tags='  + tags + ' --force' ;
var reportFileName = reportFileName || "output.json";

var documentClient = require("documentdb").DocumentClient;
var client = new documentClient(documenturl, { "masterKey": primarykey });
var databaseUrl = `dbs/${databaseid}`;
var collectionUrl = `${databaseUrl}/colls/${collectionid}`;

gt.argString(gruntargs);
gt.exec();
// .then(function (code) {


// var fs = require('fs');
// var results = fs.readFileSync(reportFileName);
// var documentDefinition = JSON.parse(results);


// documentDefinition.forEach(function(doc) {
//     client.createDocument(collectionUrl, doc, function (err, document) {
//             if (err) {
//                 tl.setResult(tl.TaskResult.Failed, tl.loc('Erro to save in DocumentDB', err.message));
//             } 
//      }
//     );

//         }, this
//     );
//     tl.setResult(tl.TaskResult.Succeeded, tl.loc('GruntReturnCode', code));
//     }).fail(function (err) {
//         tl.debug('taskRunner fail');
//         tl.setResult(tl.TaskResult.Failed, tl.loc('GruntFailed', err.message));
//     }
//  );