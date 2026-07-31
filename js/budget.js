// =======================================
// Finance Pro
// budget.js
// =======================================


import { auth, db } from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
addDoc,
getDocs,
deleteDoc,
doc,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let currentUser = null;



const form =
document.getElementById("budgetForm");


const budgetList =
document.getElementById("budgetList");


const totalBudget =
document.getElementById("totalBudget");


const usedBudget =
document.getElementById("usedBudget");


const remainingBudget =
document.getElementById("remainingBudget");


const progressBar =
document.getElementById("progressBar");




// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser = user;


loadBudget();


});




// =======================================
// Save Budget
// =======================================


form.addEventListener("submit",async(e)=>{


e.preventDefault();



const amount = Number(

document.getElementById("budgetAmount").value

);



const category =

document.getElementById("budgetCategory").value;



try{


await addDoc(

collection(

db,

"users",

currentUser.uid,

"budgets"

),

{


amount,

category,

createdAt:Date.now()


}

);



form.reset();


loadBudget();



alert("Budget Saved Successfully");



}

catch(error){


alert(error.message);


}



});




// =======================================
// Load Budget
// =======================================


async function loadBudget(){


budgetList.innerHTML="";


let total = 0;



const q = query(

collection(

db,

"users",

currentUser.uid,

"budgets"

),

orderBy(

"createdAt",

"desc"

)

);



const snapshot = await getDocs(q);



snapshot.forEach((item)=>{


const data = item.data();



total += data.amount;



budgetList.innerHTML += `


<div class="card" style="margin-bottom:15px">


<h3>

₹${data.amount}

</h3>


<p>

Category:

${data.category}

</p>



<button

class="btn"

onclick="deleteBudget('${item.id}')"

>

Delete

</button>


</div>


`;



});



totalBudget.innerHTML =

formatMoney(total);



calculateUsed(total);



}




// =======================================
// Calculate Expense
// =======================================


async function calculateUsed(total){



let used = 0;



const expenseSnap = await getDocs(


collection(

db,

"users",

currentUser.uid,

"expense"

)


);



expenseSnap.forEach((item)=>{


used += item.data().amount;


});





const remaining = total - used;



usedBudget.innerHTML =

formatMoney(used);



remainingBudget.innerHTML =

formatMoney(remaining);





let percent = 0;



if(total > 0){


percent =

(used / total) * 100;


}



if(percent > 100){

percent = 100;

}



progressBar.style.width =

percent + "%";



}




// =======================================
// Delete Budget
// =======================================


window.deleteBudget = async(id)=>{


if(!confirm("Delete Budget?"))

return;



await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"budgets",

id

)

);



loadBudget();



};




// =======================================
// Currency Format
// =======================================


function formatMoney(value){


return new Intl.NumberFormat(

"en-IN",

{

style:"currency",

currency:"INR",

maximumFractionDigits:0

}

).format(value);



}