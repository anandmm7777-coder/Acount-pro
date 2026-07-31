// =======================================
// Finance Pro
// expense.js
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
orderBy,
updateDoc,
increment

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let currentUser = null;



const form =
document.getElementById("expenseForm");


const list =
document.getElementById("expenseList");







// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}



currentUser = user;


loadExpense();


});








// =======================================
// Save Expense
// =======================================


form.addEventListener("submit",async(e)=>{


e.preventDefault();




const amount =

Number(
document.getElementById("amount").value
);



const category =

document.getElementById("category").value;



const date =

document.getElementById("date").value;



const note =

document.getElementById("note").value;







try{





// Expense Collection


await addDoc(

collection(

db,

"users",

currentUser.uid,

"expense"

),

{


amount,

category,

date,

note,

createdAt:Date.now()


}

);








// Transaction Collection


await addDoc(

collection(

db,

"users",

currentUser.uid,

"transactions"

),

{


type:"expense",

amount,

category,

date,

note,

createdAt:Date.now()


}

);









// Update Total Expense


await updateDoc(

doc(

db,

"users",

currentUser.uid

),

{


totalExpense:

increment(amount)


}

);









// Create Notification


await addDoc(

collection(

db,

"users",

currentUser.uid,

"notifications"

),

{


title:"Expense Added",


message:

`₹${amount} spent on ${category}`,


type:"expense",


read:false,


createdAt:Date.now()


}

);









form.reset();


loadExpense();



alert(
"Expense Saved Successfully"
);



}



catch(error){


alert(error.message);


}



});










// =======================================
// Load Expense
// =======================================


async function loadExpense(){


list.innerHTML="";



const q=query(


collection(

db,

"users",

currentUser.uid,

"expense"

),


orderBy(

"createdAt",

"desc"

)


);






const snapshot =

await getDocs(q);






snapshot.forEach((docSnap)=>{



const data =

docSnap.data();






list.innerHTML += `



<div class="card"

style="margin-bottom:15px;">



<h3>

₹${data.amount}

</h3>



<p>

${data.category}

</p>



<small>

${data.date}

</small>



<br>



<small>

${data.note}

</small>



<br><br>




<button

class="btn"

onclick="deleteExpense('${docSnap.id}',${data.amount})">


Delete


</button>



</div>



`;



});



}









// =======================================
// Delete Expense
// =======================================


window.deleteExpense = async(id,amount)=>{


if(!confirm("Delete this expense?"))

return;







await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"expense",

id

)

);







await updateDoc(

doc(

db,

"users",

currentUser.uid

),

{


totalExpense:

increment(-amount)


}

);







loadExpense();



};
