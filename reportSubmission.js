function submitAccessibilityReport(reportFileName){
    reportFileName = reportFileName || "output.json";
    
    var Report = require('./accessibilityReport.js');
    var report = new Report(reportFileName);

    report.AddNewReport();
}
