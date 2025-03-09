document.addEventListener("DOMContentLoaded", async function () {
    let urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get("user") || sessionStorage.getItem("userId");

    if (!userId) {
        alert("Không tìm thấy tài khoản!");
        window.location.href = "dangNhap.html";
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:3000/profile?id=${userId}`);
        const user = await response.json();

        if (user.message) {
            alert("Lỗi: " + user.message);
            return;
        }

        if(!user.fullName) {
            document.getElementById("user-fullname").textContent = user.username;
        } else {
            document.getElementById("user-fullname").textContent = user.fullName;
        }
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("phoneNumber").textContent = user.phoneNumber;
        if (user.avatar !== "./assets/img/avaDefault.jpg") {
            document.getElementById("avatar").src = user.avatar;
        } else {
            document.getElementById("avatar").src = "./assets/img/avaDefault.jpg";
        }
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
    }
});
