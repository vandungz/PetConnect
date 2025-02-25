document.addEventListener("DOMContentLoaded", async () => {
    // Lấy userId từ URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user");

    if (!userId) {
        alert("Không tìm thấy userId!");
        return;
    }

    try {
        // Gửi request đến server để lấy thông tin người dùng
        const response = await fetch(`http://127.0.0.1:3000/profile?user=${userId}`);
        const user = await response.json();

        if (response.status !== 200) {
            alert("Lỗi: " + (user.error || "Không lấy được thông tin người dùng"));
            return;
        }

        // Hiển thị thông tin người dùng lên trang HTML
        document.getElementById("user-avatar").src = user.avatar || "default-avatar.png";
        document.getElementById("user-name").textContent = user.name || "Chưa có tên";
        document.getElementById("user-email").textContent = user.email || "Chưa có email";
        document.getElementById("user-phone").textContent = user.phone || "Chưa có số điện thoại";

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        alert("Không thể tải dữ liệu người dùng.");
    }
});
