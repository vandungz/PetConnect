document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/currentUser", {
            credentials: "include", // Để gửi cookie session
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("name").textContent = data.fullName;
            document.getElementById("phone-Number").textContent = data.phoneNumber;
            document.getElementById("address").textContent = data.address;
            document.getElementById("email").textContent = data.email;
        } else {
            console.error("Lỗi:", data.message);
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
    }
});
document.getElementById("adoptButton").addEventListener("click", function () {
    // Lấy thông tin từ HTML
    const name = document.getElementById("name").innerText;
    const phone = document.getElementById("phone-Number").innerText;
    const address = document.getElementById("address").innerText;
    const email = document.getElementById("email").innerText.trim(); // Loại bỏ khoảng trắng

    if (!email) {
        alert("Không tìm thấy email!");
        return;
    }

    // Gửi yêu cầu đến server
    fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, name, phone, address })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Email xác nhận đã được gửi!");
            window.location.href = "./MenuAfterLogin.html";
        } else {
            alert("Lỗi khi gửi email: " + data.message);
        }
    })
    .catch(error => console.error("Lỗi:", error));
});


function goToMenuPage() {
    window.location.href = "./MenuAfterLogin.html";
  }