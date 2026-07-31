// =======================================
// Finance Pro
// Archive Save System
// P18.2
// =======================================


import { auth, db } from "./firebase.js";


import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

collection,
getDocs,
getDoc,
doc,
addDoc,
serverTimestamp,
deleteDoc,
updateDoc,
writeBatch,
  setDoc
  
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let currentUser = null;

let authReady = false;

const archiveBtn = document.getElementById("archiveSaveBtn");


// if(archiveBtn){

// archiveBtn.onclick = async(e)=>{

// e.preventDefault();


// // बाकी पूरा code यहाँ रहेगा

// };

// }



// ===============================
// Auth
// ===============================

onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser=user;

authReady=true;


});



// ===============================
// Save Archive
// ===============================


if(archiveBtn){

archiveBtn.onclick = async(e)=>{


e.preventDefault();

if(!authReady){

alert("Please wait...");

return;

}
if(!currentUser){

alert("User not found");

return;

}

try{
const archiveName = prompt(
"Enter a name for this archive (Example: July Report)"
);
if (!archiveName || archiveName.trim() === "") {

    alert("Archive name is required.");

    return;

}



// User Profile

const userSnap =
await getDoc(

doc(
db,
"users",
currentUser.uid
)

);



const profile =
userSnap.exists()
?
userSnap.data()
:
{};



// Income

const incomeSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"income"
)

);



let income=[];


incomeSnap.forEach((item)=>{

income.push({

id:item.id,

...item.data()

});

});




// Expense

const expenseSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"expense"
)

);



let expense=[];


expenseSnap.forEach((item)=>{

expense.push({

id:item.id,

...item.data()

});

});




// Savings

const savingsSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"savings"
)

);



let savings=[];


savingsSnap.forEach((item)=>{

savings.push({

id:item.id,

...item.data()

});

});




// Transactions

const transactionSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"transactions"
)

);



let transactions=[];


transactionSnap.forEach((item)=>{

transactions.push({

id:item.id,

...item.data()

});

});




// Budgets

const budgetSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"budgets"
)

);



let budgets=[];


budgetSnap.forEach((item)=>{

budgets.push({

id:item.id,

...item.data()

});

});




// Goals

const goalSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"goals"
)

);



let goals=[];


goalSnap.forEach((item)=>{

goals.push({

id:item.id,

...item.data()

});

});




// Notifications

const notificationSnap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
"notifications"
)

);



let notifications=[];


notificationSnap.forEach((item)=>{

notifications.push({

id:item.id,

...item.data()

});

});




// ===============================
// Save Archive
// ===============================


await addDoc(

collection(
db,
"users",
currentUser.uid,
"archives"
),
{

name: archiveName.trim(),

profile,

income,

expense,

savings,

transactions,

budgets,

goals,

notifications,

createdAt: serverTimestamp()

}
);

await resetAccount();

alert(
"Account Backup Saved Successfully"
);



location.href="archive.html";



}

catch(error){


console.log(error);


alert(error.message);


}



};}
// =======================================
// Reset Account After Archive
// =======================================


async function resetAccount(){


const userPath =
[
"income",
"expense",
"savings",
"transactions",
"budgets",
"goals",
"notifications"
];



for(const path of userPath){


const snap =
await getDocs(

collection(
db,
"users",
currentUser.uid,
path
)

);



const batch =
writeBatch(db);



snap.forEach((item)=>{


batch.delete(

doc(
db,
"users",
currentUser.uid,
path,
item.id
)

);


});



await batch.commit();


}



// Reset Totals

await setDoc(

doc(
db,
"users",
currentUser.uid
),

{

totalIncome:0,

totalExpense:0,

totalSavings:0

},

{

merge:true

}

);



}