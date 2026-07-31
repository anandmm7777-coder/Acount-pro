

  // =======================================
// Finance Pro
// goals.js
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




// Variables

let currentUser = null;


const form =
document.getElementById("goalForm");


const goalList =
document.getElementById("goalList");





// =======================================
// Auth Check
// =======================================


onAuthStateChanged(auth,(user)=>{


if(!user){

location.href="login.html";

return;

}


currentUser = user;


console.log(
"Current User:",
currentUser.uid
);


loadGoals();


});






// =======================================
// Create Goal
// =======================================


form.addEventListener("submit",async(e)=>{


e.preventDefault();



if(!currentUser){

alert("User not logged in");

return;

}



const name =
document.getElementById("goalName").value;



const target =
Number(
document.getElementById("targetAmount").value
);



const saved =
Number(
document.getElementById("savedAmount").value
);



const deadline =
document.getElementById("deadline").value;




try{


await addDoc(

collection(

db,

"users",

currentUser.uid,

"goals"

),

{


name:name,

target:target,

saved:saved,

deadline:deadline,

createdAt:Date.now()


}

);



alert(
"Goal Created Successfully"
);



form.reset();



loadGoals();



}

catch(error){


console.log(error);

alert(error.message);


}



});







// =======================================
// Load Goals
// =======================================


async function loadGoals(){


if(!currentUser) return;



goalList.innerHTML="Loading...";



try{


const q = query(

collection(

db,

"users",

currentUser.uid,

"goals"

),

orderBy(

"createdAt",

"desc"

)

);



const snapshot =
await getDocs(q);



goalList.innerHTML="";





if(snapshot.empty){


goalList.innerHTML=`

<div class="card">

<h3>No Goals Found</h3>

</div>

`;

return;


}





snapshot.forEach((item)=>{


const data =
item.data();



let percent =

(data.saved / data.target) * 100;



if(percent > 100){

percent = 100;

}



goalList.innerHTML += `


<div class="card goal-card">


<h2>
🎯 ${data.name}
</h2>



<p>
Target: ₹${data.target}
</p>


<p>
Saved: ₹${data.saved}
</p>


<p>
Deadline: ${data.deadline}
</p>



<div class="progress">

<div class="goal-progress"

style="width:${percent}%">

</div>

</div>



<p>
${Math.round(percent)}% Completed
</p>



<button

class="btn danger"

onclick="deleteGoal('${item.id}')">

Delete

</button>



</div>


`;



});



}

catch(error){


console.log(error);


goalList.innerHTML=`

<div class="card">

Error Loading Goals

</div>

`;


}



}







// =======================================
// Delete Goal
// =======================================


window.deleteGoal = async(id)=>{


if(!confirm("Delete this goal?"))

return;



try{


await deleteDoc(

doc(

db,

"users",

currentUser.uid,

"goals",

id

)

);



loadGoals();



}

catch(error){


alert(error.message);


}


};
