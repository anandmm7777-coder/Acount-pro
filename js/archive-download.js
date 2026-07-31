// =======================================
// Finance Pro
// Print + Download Report
// =======================================


// ================================
// Print Report
// ================================

const printBtn =
document.getElementById("printReportBtn");


if(printBtn){

printBtn.addEventListener("click",()=>{

window.print();

});

}





// ================================
// Download PDF
// ================================

const downloadBtn =
document.getElementById("downloadBtn");



if(downloadBtn){


downloadBtn.addEventListener("click",async()=>{


const report =
document.getElementById("pdfReport");



if(!report){

alert("Report not found");

return;

}



const options = {


margin:10,


filename:
"Finance-Pro-Report.pdf",



image:{

type:"jpeg",

quality:0.98

},



html2canvas:{

scale:2

},



jsPDF:{

unit:"mm",

format:"a4",

orientation:"portrait"

}


};



html2pdf()

.set(options)

.from(report)

.save();



});


}