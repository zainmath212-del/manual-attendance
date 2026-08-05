const keyword = document.getElementById("keyword");
const result = document.getElementById("result");

let allStudents = [];
let typingTimer;

// Fokus ke textbox
keyword.focus();

// =============================
// LOAD SEMUA SISWA (1x SAJA)
// =============================
(async () => {

    result.innerHTML = `
        <div class="text-center text-muted">
            ⏳ Memuat data siswa...
        </div>
    `;

    try {

        allStudents = await getAllStudent();

        result.innerHTML = `
            <div class="text-center text-success">
                ✅ ${allStudents.length} siswa siap dicari
            </div>
        `;

        setTimeout(() => {
            result.innerHTML = "";
        }, 1000);

    } catch (e) {

        result.innerHTML = `
            <div class="text-danger text-center">
                Gagal memuat data siswa.
            </div>
        `;

    }

})();

// =============================
// AUTO SEARCH
// =============================
keyword.addEventListener("keyup", () => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(loadStudent, 100);

});

// =============================
// CARI SISWA
// =============================
function loadStudent(){

    const text = keyword.value.trim().toLowerCase();

    if(text.length < 2){

        result.innerHTML = "";

        return;

    }

    const siswa = allStudents
        .filter(s =>
            s.nama.toLowerCase().includes(text) ||
            s.id.includes(text)
        )
        .slice(0,10);

    let html = "";

    if(siswa.length == 0){

        html = `
            <div class="text-center text-muted">
                Tidak ada siswa ditemukan.
            </div>
        `;

    }else{

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
id="btn-${s.id}"
class="btn btn-success"
onclick="submitAttendance('${s.id}',this)">

    ✓ Submit Attendance

</button>

            </div>

            `;

        });

    }

    result.innerHTML = html;

}

// =============================
// SUBMIT
// =============================
async function submitAttendance(id, btn){

    // cegah double click
    if(btn.disabled) return;

    btn.disabled = true;

    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Recording...
    `;

    btn.closest(".student").style.opacity = ".6";

    try{

        const hasil = await sendAttendance(id);

        if(hasil.success){

            const toast =
                new bootstrap.Toast(
                    document.getElementById("successToast"),
                    {
                        delay:1500
                    }
                );

            toast.show();

            keyword.value="";

            result.innerHTML="";

            keyword.focus();

        }else{

            btn.disabled=false;

            btn.innerHTML="✓ Submit Attendance";

            btn.closest(".student").style.opacity="1";

            showMessage("❌ " + hasil.message, "danger");

        }

    }catch(err){

        btn.disabled=false;

        btn.innerHTML="✓ Submit Attendance";

        btn.closest(".student").style.opacity="1";

        alert("Gagal mengirim attendance.");

    }

}
function showMessage(text, type = "success") {

    const box = document.getElementById("message");

    box.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${text}
        </div>
    `;

    setTimeout(() => {
        box.innerHTML = "";
    }, 3000);
}
