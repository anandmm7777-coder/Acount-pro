// =======================================
// Finance Pro
// savings.js
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

document.getElementById("savingForm");



const list =

document.getElementById("savingList");







// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}



currentUser=user;


loadSavings();


});









// =======================================
// Save Savings
// =======================================


form.addEventListener("submit",async(e)=>{


e.preventDefault();




const amount =

Number(

document.getElementById("amount").value

);



const goal =

document.getElementById("goal").value;



const date =

document.getElementById("date").value;



const note =

document.getElementById("note").value;







try{





// Savings Collection


await addDoc(

collection(

db,

"users",

currentUser.uid,

"savings"

),

{


amount,

goal,

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


type:"saving",

amount,

category:goal,

date,

note,

createdAt:Date.now()


}

);









// Update Total Savings


await updateDoc(

doc(

db,

"users",

currentUser.uid

),

{


totalSavings:

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


title:"Savings Added",


message:

`₹${amount} saved for ${goal}`,


type:"saving",


read:false,


createdAt:Date.now()


}

);









form.reset();


loadSavings();



alert(

"Savings Added Successfully"

);



}



catch(error){


alert(error.message);


}



});









// =======================================
// Load Savings
// =======================================


async function loadSavings(){


list.innerHTML="";



const q=query(


collection(

db,

"users",

currentUser.uid,

"savings"

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

${data.goal}

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

onclick="deleteSaving('${docSnap.id}',${data.amount})">


Delete


</button>



</div>



`;



});



}









// =======================================
// Delete Savings
// =======================================


window.deleteSaving = async(id,amount)=>{


if(!confirm("Delete Saving?"))

return;







await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"savings",

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


totalSavings:

increment(-amount)


}

);







loadSavings();



};
