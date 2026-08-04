const keyword = document.getElementById("keyword");

const result = document.getElementById("result");

keyword.focus();

let typingTimer;

keyword.addEventListener("keyup", () => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(loadStudent, 200);

});

async function loadStudent(){

    const text = keyword.value.trim();

    if(text.length < 2){

        result.innerHTML="";

        return;

    }

    const siswa = await searchStudent(text);

    let html="";

    siswa.forEach(s=>{

        html += `

<div class="student">

<div class="name">

${s.nama}

</div>

<div class="grade">

Grade ${s.kelas}

</div>

<button
class="btn btn-primary"
onclick="submitAttendance('${s.id}')">

Submit Attendance

</button>

</div>

`;

    });

    result.innerHTML = html;

}

async function submitAttendance(id){

    const hasil = await sendAttendance(id);

    if(hasil.success){

        alert("✅ Attendance Recorded");

        keyword.value="";

        result.innerHTML="";

        keyword.focus();

    }else{

        alert(hasil.message);

    }

}
