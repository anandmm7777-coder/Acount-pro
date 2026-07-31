// =======================================
// Finance Pro
// transactions.js
// =======================================

import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let currentUser = null;

let allTransactions = [];


const list =
document.getElementById("transactionList");


const search =
document.getElementById("search");


const filter =
document.getElementById("filter");




// Auth Check

onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser=user;


loadTransactions();


});





// Load Transactions

async function loadTransactions(){


list.innerHTML="Loading...";


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
)

);



const snapshot = await getDocs(q);



allTransactions=[];



snapshot.forEach((doc)=>{


allTransactions.push({

id:doc.id,

...doc.data()

});


});



displayTransactions(allTransactions);



}





// Display Data


function displayTransactions(data){


list.innerHTML="";



if(data.length===0){


list.innerHTML=`

<div class="card">

<h3>No Transactions Found</h3>

</div>

`;

return;

}




data.forEach(item=>{


let icon="";


let color="";



if(item.type==="income"){

icon="fa-arrow-trend-up";

color="Income";

}


else if(item.type==="expense"){

icon="fa-arrow-trend-down";

color="Expense";

}


else{

icon="fa-piggy-bank";

color="Savings";

}




list.innerHTML += `


<div class="card transaction-item">


<div>


<h3>

<i class="fa-solid ${icon}"></i>

${color}

</h3>


<p>

${item.category || ""}

</p>


<small>

${item.date}

</small>


</div>



<h3>

₹${item.amount}

</h3>



</div>


`;



});


}





// Search

search.addEventListener("input",()=>{


const value =
search.value.toLowerCase();



const filtered =
allTransactions.filter(item=>{


return (

(item.category || "")
.toLowerCase()
.includes(value)

||

(item.note || "")
.toLowerCase()
.includes(value)

);


});



displayTransactions(filtered);



});





// Filter


filter.addEventListener("change",()=>{


const value =
filter.value;



if(value==="all"){


displayTransactions(allTransactions);

return;

}



const filtered =
allTransactions.filter(item=>{


return item.type===value;


});



displayTransactions(filtered);



});
