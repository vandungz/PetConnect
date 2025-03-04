document.querySelector(".form_login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (!username || !password) {
        alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = "MenuAfterLogin.html"; // Chuyển hướng nếu đăng nhập thành công
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi server! Vui lòng thử lại.");
    }
});
