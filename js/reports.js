// =======================================
// Finance Pro
// reports.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Elements

const reportIncome =
document.getElementById("reportIncome");


const reportExpense =
document.getElementById("reportExpense");


const reportSaving =
document.getElementById("reportSaving");



let currentUser;



// =======================================
// Auth Check
// =======================================

onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser=user;


loadReports();


});





// =======================================
// Load Reports
// =======================================

async function loadReports(){


try{


let income = 0;

let expense = 0;

let saving = 0;


let categoryData = {};




const snapshot = await getDocs(


collection(

db,

"users",

currentUser.uid,

"transactions"

)


);





snapshot.forEach((item)=>{


const data =
item.data();



if(data.type==="income"){


income += data.amount;


}



else if(data.type==="expense"){


expense += data.amount;



// Category Count


const category =
data.category || "Other";



if(categoryData[category]){


categoryData[category] += data.amount;


}

else{


categoryData[category] = data.amount;


}



}



else if(data.type==="saving"){


saving += data.amount;


}



});





// Update Cards


reportIncome.textContent =
money(income);



reportExpense.textContent =
money(expense);



reportSaving.textContent =
money(saving);





drawIncomeExpenseChart(
income,
expense
);



drawCategoryChart(
categoryData
);



}

catch(error){


console.log(error);


}


}





// =======================================
// Income Expense Chart
// =======================================

function drawIncomeExpenseChart(
income,
expense
){


const ctx =
document.getElementById(
"incomeExpenseChart"
);



new Chart(ctx,{


type:"bar",


data:{


labels:[

"Income",

"Expense"

],


datasets:[{


label:"Amount",

data:[

income,

expense

]


}]


},



options:{


responsive:true,


plugins:{


legend:{


labels:{


color:"#ffffff"


}


}


}


}



});



}






// =======================================
// Category Chart
// =======================================

function drawCategoryChart(data){


const ctx =
document.getElementById(
"categoryChart"
);



new Chart(ctx,{


type:"pie",


data:{


labels:Object.keys(data),



datasets:[{


data:Object.values(data)


}]


},


options:{


responsive:true,


plugins:{


legend:{


labels:{


color:"#ffffff"


}


}


}



}


});



}




// =======================================
// Currency
// =======================================

function money(value){


return new Intl.NumberFormat(

"en-IN",

{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}

).format(value);


}