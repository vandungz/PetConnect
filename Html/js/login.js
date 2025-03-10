// Thêm Google Sign-In API script
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Thay bằng client_id từ Google Cloud
        callback: handleGoogleCallback
    });
    google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"), // Thêm button với id="googleSignInButton" trong HTML
        { theme: "outline", size: "large" }
    );
};

function handleGoogleCallback(response) {
    const idToken = response.credential;
    
    console.log("📢 ID Token nhận được từ Google:", idToken);

    fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
    })
    .then(response => response.json())
    .then(data => {
        console.log("🔹 Phản hồi từ server:", data);

        if (data.userId) {
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.username || "Người dùng");
            sessionStorage.setItem("userEmail", data.email || "Không có email");

            console.log("✅ Đã lưu userId vào sessionStorage:", sessionStorage.getItem("userId"));

            window.location.href = "MenuAfterLogin.html";
        } else {
            console.error("❌ Không nhận được userId từ server!");
            alert("Lỗi khi đăng nhập bằng Google!");
        }
    })
    .catch(error => {
        console.error("❌ Lỗi đăng nhập Google:", error);
        alert("Lỗi kết nối! Vui lòng thử lại.");
    });
}


// Đăng nhập thủ công
document.querySelector(".form_login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (!username || !password) {
        alert("Vui lòng nhập tên đăng nhập và mật khẩu!");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.clear();
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.username || "Người dùng");
            sessionStorage.setItem("userEmail", data.email || "Không có email");
            console.log("✅ Đã lưu vào sessionStorage:", sessionStorage.getItem("userId"));
            window.location.href = "MenuAfterLogin.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Lỗi server! Vui lòng thử lại.");
    }
});

// Đăng xuất
window.logout = function() {
    fetch('http://127.0.0.1:3000/logout', {
        method: 'GET',
        credentials: 'include'
    }).then(() => {
        sessionStorage.clear();
        window.location.href = "dangNhap.html";
    }).catch(err => console.error("❌ Lỗi khi đăng xuất:", err));
};