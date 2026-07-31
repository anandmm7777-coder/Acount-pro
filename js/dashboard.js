// =======================================
// Finance Pro
// dashboard.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

doc,
getDoc,
collection,
getDocs,
query,
orderBy,
limit,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ================================
// Elements
// ================================


const welcomeName =
document.getElementById("welcomeName");


const profilePhoto =
document.getElementById("profilePhoto");


const incomeAmount =
document.getElementById("incomeAmount");


const expenseAmount =
document.getElementById("expenseAmount");


const savingAmount =
document.getElementById("savingAmount");


const budgetAmount =
document.getElementById("budgetAmount");


const totalBalance =
document.getElementById("totalBalance");


const logoutBtn =
document.getElementById("logoutBtn");



const dashboardBudget =
document.getElementById("dashboardBudget");


const dashboardGoals =
document.getElementById("dashboardGoals");



let currentUser = null;

let chart = null;







// ================================
// Auth Check
// ================================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser=user;


loadProfile();

loadRecentTransactions();

loadNotificationCount();

loadDashboardBudget();

loadDashboardGoals();


});









// ================================
// Load Profile
// ================================


async function loadProfile(){


try{


const ref = doc(

db,

"users",

currentUser.uid

);



const snap = await getDoc(ref);



if(!snap.exists())

return;



const data = snap.data();




welcomeName.textContent =

`Welcome, ${data.name || "User"} 👋`;





if(data.photo){

profilePhoto.src=data.photo;

}




const income =
Number(data.totalIncome || 0);



const expense =
Number(data.totalExpense || 0);



const saving =
Number(data.totalSavings || 0);



const balance =
income - expense;



incomeAmount.textContent =
money(income);



expenseAmount.textContent =
money(expense);



savingAmount.textContent =
money(saving);



budgetAmount.textContent =
money(balance);



totalBalance.textContent =
money(balance+saving);




drawChart(

income,

expense,

saving

);



}

catch(error){

console.log(error);

}


}









// ================================
// Money Format
// ================================


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









// ================================
// Finance Chart
// ================================


function drawChart(

income,

expense,

saving

){



const ctx =
document.getElementById(
"financeChart"
);



if(!ctx)

return;




if(chart){

chart.destroy();

}





chart = new Chart(ctx,{


type:"doughnut",



data:{


labels:[

"Income",

"Expense",

"Savings"

],



datasets:[{

data:[

income,

expense,

saving

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
// Recent Transactions
// =======================================


function loadRecentTransactions(){



const list =
document.getElementById(
"transactionList"
);



if(!list)

return;




const q = query(


collection(

db,

"users",

currentUser.uid,

"transactions"

),



orderBy(

"createdAt",

"desc"

),



limit(5)

);






onSnapshot(q,(snapshot)=>{


list.innerHTML="";




if(snapshot.empty){


list.innerHTML=`

<div class="card">

<h3>No Transactions Found</h3>

</div>

`;

return;

}





snapshot.forEach((item)=>{


const data=item.data();



let icon="🐷";

let title="Savings";



if(data.type==="income"){

icon="💰";

title="Income";

}



if(data.type==="expense"){

icon="💸";

title="Expense";

}






list.innerHTML += `


<div class="card transaction-item">


<div>

<h3>

${icon} ${title}

</h3>


<p>

${data.category || ""}

</p>


<small>

${data.date || ""}

</small>


</div>



<h3>

${money(data.amount || 0)}

</h3>



</div>


`;



});


});



}









// =======================================
// Notification Count
// =======================================


function loadNotificationCount(){



const badge =
document.getElementById(
"notificationCount"
);



if(!badge)

return;



const q =
collection(

db,

"users",

currentUser.uid,

"notifications"

);




onSnapshot(q,(snapshot)=>{


let count=0;



snapshot.forEach((item)=>{


if(!item.data().read){

count++;

}


});



badge.textContent=count;



});



}









// =======================================
// Load Dashboard Budget
// =======================================


async function loadDashboardBudget(){


try{


const snap = await getDocs(

collection(

db,

"users",

currentUser.uid,

"budgets"

)

);



let total=0;



snap.forEach((item)=>{


total += Number(

item.data().amount || 0

);


});




if(dashboardBudget){


dashboardBudget.textContent =
money(total);


}



}

catch(error){

console.log(error);

}


}









// =======================================
// Load Dashboard Goals
// =======================================


async function loadDashboardGoals(){



try{


if(!dashboardGoals)

return;



dashboardGoals.innerHTML="";



const snap = await getDocs(

collection(

db,

"users",

currentUser.uid,

"goals"

)

);





if(snap.empty){


dashboardGoals.innerHTML=`

<div class="card">

<h3>No Goals Added</h3>

</div>

`;

return;

}






snap.forEach((item)=>{


const data=item.data();



let saved =
Number(data.saved || 0);



let target =
Number(data.target || 1);



let percent =
(saved/target)*100;



if(percent>100)

percent=100;





dashboardGoals.innerHTML += `


<div class="card">


<h3>

🎯 ${data.name}

</h3>


<p>

₹${saved} / ₹${target}

</p>



<div class="progress">


<div class="goal-progress"

style="width:${percent}%">

</div>


</div>



<p>

${Math.round(percent)}% Complete

</p>



</div>


`;



});



}

catch(error){

console.log(error);

}


}









// =======================================
// Logout
// =======================================


if(logoutBtn){


logoutBtn.onclick=async()=>{


await signOut(auth);


location.href="login.html";


};


}
