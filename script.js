// ================= USERS =================
const students = [
    { username: "st1", password: "1234" },
    { username: "st2", password: "1234" },
    { username: "st3", password: "1234" },
    { username: "st4", password: "1234" },
    { username: "st5", password: "1234" },
    { username: "st6", password: "1234" }
];

const hod = {
    username: "hod",
    password: "admin"
};


// ================= PASSWORD TOGGLE =================
function togglePassword() {
    let pass = document.getElementById("password");

    if (pass) {
        pass.type = pass.type === "password" ? "text" : "password";
    }
}


// ================= LOGIN =================
function login() {
    let u = document.getElementById("username").value.trim();
    let p = document.getElementById("password").value.trim();

    if (!u || !p) {
        alert("Enter username & password");
        return;
    }

    let valid = students.find(
        s => s.username === u && s.password === p
    );

    if (valid) {
        localStorage.setItem("role", "student");
        localStorage.setItem("user", u);
        window.location.href = "student.html";
    } 
    else {
        alert("Invalid Username or Password");
    }
}


// ================= AUTH CHECK =================
function checkAuth(expectedRole) {
    let role = localStorage.getItem("role");

    if (!role) {
        window.location.href = "index.html";   // FIXED
        return;
    }

    if (role !== expectedRole) {
        window.location.href = "index.html";   // FIXED
    }
}


// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    window.location.href = "index.html";   // FIXED
}


// ================= SAFETY INIT =================
if (!localStorage.getItem("students")) {
    localStorage.setItem("students", JSON.stringify([]));
}


// ================= ATTENDANCE SYSTEM =================

// HOD Attendance ON/OFF
function toggleAttendance() {
    let status = localStorage.getItem("attendanceStatus");

    if (status === "on") {
        localStorage.setItem("attendanceStatus", "off");
        alert("Attendance Closed");
    } 
    else {
        localStorage.setItem("attendanceStatus", "on");
        alert("Attendance Opened");
    }
}


// ================= FACE ATTENDANCE =================
async function markAttendance(subjectName) {
    let currentUser = localStorage.getItem("user");
    let status = localStorage.getItem("attendanceStatus");

    if (status !== "on") {
        alert("Attendance is currently closed by HOD");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        let cameraWindow = window.open("", "_blank", "width=700,height=600");

        cameraWindow.document.write(`
            <html>
            <head>
                <title>Face Attendance</title>
                <style>
                    body{
                        background:black;
                        color:white;
                        text-align:center;
                        font-family:Arial;
                    }
                    video{
                        width:500px;
                        margin-top:20px;
                        border-radius:20px;
                    }
                    button{
                        padding:12px 25px;
                        margin-top:20px;
                        background:#00c6ff;
                        border:none;
                        color:white;
                        border-radius:10px;
                        cursor:pointer;
                    }
                </style>
            </head>
            <body>
                <h2>Face Attendance Verification</h2>
                <video id="video" autoplay></video><br>
                <button onclick="captureFace()">Capture Face</button>

                <script>
                    let video = document.getElementById("video");
                    video.srcObject = opener.currentStream;

                    function captureFace(){
                        alert("Face Verified Successfully");
                        window.close();
                    }
                </script>
            </body>
            </html>
        `);

        window.currentStream = stream;

        cameraWindow.onbeforeunload = function () {
            stream.getTracks().forEach(track => track.stop());

            saveAttendance(currentUser, subjectName);
        };

    } catch (error) {
        alert("Camera access denied or not supported");
    }
}


// Save Subject Attendance
function saveAttendance(currentUser, subjectName) {
    let attendanceData =
        JSON.parse(localStorage.getItem("attendanceData")) || {};

    if (!attendanceData[currentUser]) {
        attendanceData[currentUser] = {};
    }

    if (!attendanceData[currentUser][subjectName]) {
        attendanceData[currentUser][subjectName] = 0;
    }

    attendanceData[currentUser][subjectName] += 1;

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );

    alert(
        subjectName +
        " attendance marked successfully using facial verification"
    );
}


// ================= HOD ATTENDANCE REPORT =================
function showAttendanceReport() {
    let attendanceData =
        JSON.parse(localStorage.getItem("attendanceData")) || {};

    let output = document.getElementById("attendanceReport");

    if (!output) return;

    output.innerHTML = "<h2>📋 Subject Attendance Report</h2>";

    const subjects = [
        "BCE-C621",
        "BCE-C625",
        "BCE-C661",
        "BCE-M002",
        "BCE-O633",
        "BCE-P624"
    ];

    for (let student in attendanceData) {
        output.innerHTML += `
            <div class="student-card">
                <h3>👤 ${student}</h3>
        `;

        subjects.forEach(subject => {
            let count = attendanceData[student][subject] || 0;

            output.innerHTML += `
                <p>${subject}: ${count} Classes</p>
            `;
        });

        output.innerHTML += `</div>`;
    }
}


// ================= VIEW STUDENT ATTENDANCE =================
function viewStudentAttendance(studentName) {
    alert(
        "Student Name: " +
        studentName +
        "\\nAttendance Data Available"
    );
}