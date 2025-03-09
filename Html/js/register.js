document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn chặn reload trang

    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Kiểm tra mật khẩu có khớp không
    const passwordError = document.getElementById("passwordError");
    if (password !== confirmPassword) {
        passwordError.style.display = "block";
        return;
    } else {
        passwordError.style.display = "none";
    }

    // Gửi dữ liệu lên server qua API
    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({fullName, username, email, phoneNumber, password})
    });

    const result = await response.json();
    if (response.ok) {
        alert("Đăng ký thành công!");
        window.location.href = "dangNhap.html"; // Chuyển hướng sau khi đăng ký thành công
    } else {
        alert(result.message);
    }
});
