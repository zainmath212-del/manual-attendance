const API_URL =
"https://script.google.com/macros/s/AKfycbzxRG0MglizzdThP38rGaAmuIQcZeGM0Xtu-4fwbOBM2u4YVhhdqfVWonU8sdYJgAWUtQ/exec";

async function sendAttendance(id){

    const response = await fetch(
        API_URL + "?id=" + encodeURIComponent(id)
    );

    return await response.json();

}

async function getAllStudent(){

    const response = await fetch(

        API_URL + "?action=all"

    );

    return await response.json();

}
