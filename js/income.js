// =======================================
// Finance Pro
// income.js
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
document.getElementById("incomeForm");


const list =
document.getElementById("incomeList");







// =========================
// Auth Check
// =========================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}



currentUser=user;


loadIncome();


});








// =========================
// Save Income
// =========================


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



// Income Collection


await addDoc(

collection(

db,

"users",

currentUser.uid,

"income"

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


type:"income",

amount,

category,

date,

note,

createdAt:Date.now()


}

);








// Update Total Income


await updateDoc(

doc(

db,

"users",

currentUser.uid

),

{


totalIncome:

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


title:"Income Added",


message:

`₹${amount} income added in ${category}`,


type:"income",


read:false,


createdAt:Date.now()


}

);








form.reset();


loadIncome();



alert(
"Income Saved Successfully"
);



}

catch(error){


alert(error.message);


}



});









// =========================
// Load Income
// =========================


async function loadIncome(){


list.innerHTML="";



const q=query(


collection(

db,

"users",

currentUser.uid,

"income"

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

onclick="deleteIncome('${docSnap.id}',${data.amount})">


Delete


</button>



</div>



`;



});



}








// =========================
// Delete Income
// =========================


window.deleteIncome = async(id,amount)=>{


if(!confirm("Delete this income?"))

return;





await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"income",

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


totalIncome:

increment(-amount)


}

);






// Delete Notification (optional future upgrade)



loadIncome();



};
