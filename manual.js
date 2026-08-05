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
    onclick="submitAttendance('${s.id}')">

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
async function submitAttendance(id){

    const btn = document.getElementById("btn-" + id);

    // Disable tombol
    btn.disabled = true;
    btn.innerHTML = "⏳ Submitting...";

    try{

        const hasil = await sendAttendance(id);

        if(hasil.success){

            result.innerHTML = `
                <div class="alert alert-success">
                    ✅ Attendance Recorded
                </div>
            `;

            keyword.value = "";
            keyword.focus();

            setTimeout(()=>{

                result.innerHTML = "";

            },1200);

        }else{

            btn.disabled = false;
            btn.innerHTML = "✓ Submit Attendance";

            result.innerHTML = `
                <div class="alert alert-danger">
                    ${hasil.message}
                </div>
            `;

        }

    }catch(e){

        btn.disabled = false;
        btn.innerHTML = "✓ Submit Attendance";

        result.innerHTML = `
            <div class="alert alert-danger">
                Gagal mengirim attendance.
            </div>
        `;

    }

}
