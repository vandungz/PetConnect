document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("bookingsContainer");
    const avatarImg = document.getElementById("avatar");
    try {
        // 1) Lấy avatar user
        const userRes = await fetch("http://127.0.0.1:3000/api/currentUser", {
        credentials: "include"
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        // Hiển thị avatar
        avatarImg.src = userData.avatar || "../assets/img/avaDefault.jpg";
      } else {
        console.warn("Không thể lấy thông tin user (chưa đăng nhập?)");
      }
  
      // 2) Gọi API để lấy danh sách booking
      const res = await fetch("http://127.0.0.1:3000/api/my-bookings", {
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error("Lỗi khi gọi /api/my-bookings");
      }
  
      const bookings = await res.json();
      console.log("Danh sách booking:", bookings);

        container.innerHTML = ""; // Xóa nội dung cũ

        bookings.forEach(booking => {
            const bookingElement = document.createElement("div");
            bookingElement.classList.add("container-pet-info");
            bookingElement.innerHTML = `
                <h1 class="container-pet-info-title">Chi tiết chuồng</h1>
                <div class="container-pet-info-content">
                    <img src="${booking.imageUrl || 'avaDefault.jpg'}" alt="${booking.roomName}" class="container-pet-info-content-img">
                    <div class="container-pet-info-content-text">
                        <h1 class="container-booking-info-content-name">${booking.roomName || "Không có tên"}</h1>
                        <h1 class="container-booking-info-content-basicInfo">${booking.basicInfo || "Không có thông tin"}</h1> 
                        <p class="container-booking-info-content-address">${booking.address|| "Không có địa chỉ"}</p>
                        <div class="booking-dates-container">
                            <p class="booking-dates">${new Date(booking.checkin).toLocaleDateString()}</p>
                            <div class="booking-dates-line"></div>
                            <p class="booking-dates">${new Date(booking.checkout).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(bookingElement);
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu chuồng:", error);
    }
});

// Hàm này gọi khi user bấm logo => trở về trang chủ
function goToMenuPage() {
    window.location.href = "./MenuAfterLogin.html";
}
