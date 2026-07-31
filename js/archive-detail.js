// =======================================
// Finance Pro
// Archive Detail
// P18.4
// =======================================


import {auth,db} from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let uid=null;



const params =
new URLSearchParams(
location.search
);


const archiveId =
params.get("id");



onAuthStateChanged(auth,async(user)=>{


if(!user){

location.href="login.html";

return;

}


uid=user.uid;


loadArchive();


});





async function loadArchive(){


const snap =
await getDoc(

doc(

db,

"users",

uid,

"archives",

archiveId

)

);



if(!snap.exists()){

alert("Archive Not Found");

return;

}



const data =
snap.data();




// Profile

profileName.innerHTML =
data.profile.name || "User";


profileEmail.innerHTML =
data.profile.email || "";




// Summary

let income=0;

let expense=0;

let saving=0;



data.income.forEach(i=>{

income += i.amount || 0;

});


data.expense.forEach(i=>{

expense += i.amount || 0;

});


data.savings.forEach(i=>{

saving += i.amount || 0;

});



incomeTotal.innerHTML =
money(income);


expenseTotal.innerHTML =
money(expense);


savingTotal.innerHTML =
money(saving);




// Transactions

transactionList.innerHTML="";


data.transactions.forEach(t=>{


transactionList.innerHTML += `

<div class="card">

<h3>
${t.type}
</h3>

<p>
₹${t.amount}
</p>

<small>
${t.date || ""}
</small>

</div>

`;

});



// Goals

goalList.innerHTML="";


data.goals.forEach(g=>{


goalList.innerHTML +=`

<div class="card">

<h3>
🎯 ${g.name}
</h3>

<p>
Target: ₹${g.target}
</p>

<p>
Saved: ₹${g.saved}
</p>

</div>

`;

});


}





function money(value){


return new Intl.NumberFormat(
"en-IN",
{

style:"currency",
currency:"INR"

}

).format(value);


}