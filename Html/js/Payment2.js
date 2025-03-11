// Hàm lấy param từ URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

document.addEventListener("DOMContentLoaded", async function () {
  // 1) Đọc bookingData từ localStorage
  const stored = localStorage.getItem("tempBooking");
  if (!stored) {
    console.error("Không tìm thấy tempBooking trong localStorage");
    return;
  }
  const bookingData = JSON.parse(stored);
  console.log("BookingData từ localStorage:", bookingData);

  function parseDDMMYYYY(str) {
    // str dạng "14/03/2025"
    const [day, month, year] = str.split("/");
    return new Date(`${year}-${month}-${day}`); 
    // => "2025-03-14"
  }
  
  try {
    
    // 3. Cập nhật DOM
    document.getElementById("room-name-display").innerText = bookingData.roomName;
    document.getElementById("basic-info-display").innerText = bookingData.basicInfo;
    document.getElementById("address-display").innerText = bookingData.address;
    document.getElementById("container-img--main-content").src = bookingData.imageUrl || "./assets/img/avaDefault.jpg";
    
    const checkinDate = parseDDMMYYYY(bookingData.checkin);
    document.getElementById("checkinDate").innerText = checkinDate.toLocaleDateString();
    
    const checkoutDate = parseDDMMYYYY(bookingData.checkout);
    document.getElementById("checkoutDate").innerText = checkoutDate.toLocaleDateString();
    
    // Tìm dòng khớp với pattern "số + THÚ CƯNG"
    const petString = bookingData.pet;
    const lines = petString.split("\n").map(x => x.trim()).filter(Boolean);
    const petLine = lines.find(line => /\d+\s*THÚ\s*CƯNG/i.test(line));
    document.getElementById("bookingGuests").innerText = petLine || bookingData.pet;

    document.getElementById("subTotalText").innerText = `₫${bookingData.subtotal}`;
    document.getElementById("discountText").innerText = bookingData.discount ? `-₫${bookingData.discount}` : "$0";

    const finalTotal = bookingData.subtotal - bookingData.discount;
    document.getElementById("finalTotalText").innerText = `₫${finalTotal}`;

    // 4. Lắng nghe sự kiện "Xác nhận và thanh toán"
    document.querySelector(".button-accept").addEventListener("click", async function () {
      // Kiểm tra radio
      const vnPayRadio = document.getElementById("vnpay-payment");
      const cashRadio = document.getElementById("cash-payment");

      if (vnPayRadio.checked) {
        // Gọi server để tạo URL thanh toán VNPay
        try {
          const res = await fetch("http://127.0.0.1:3000/api/vnpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingData }),
            credentials: "include"
          });
          if (!res.ok) throw new Error("Lỗi khi tạo URL thanh toán VNPay");
          const data = await res.json();
          
          // Chuyển hướng sang cổng thanh toán VNPay
          window.location.href = data.vnpayUrl;
        } catch (error) {
          console.error("Error processing VNPay payment:", error);
        }
      } else if (cashRadio.checked) {
        // 1) Gọi /api/createBooking để lưu booking
        try {
          const res = await fetch("http://127.0.0.1:3000/api/createBooking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
            credentials: "include" // Để gửi cookie session
          });
          if (!res.ok) throw new Error("Lỗi khi tạo booking (cash).");

          const data = await res.json();
          console.log("Booking đã lưu DB (cash):", data);

          // 2) Sau khi lưu booking xong -> chuyển sang trang "checked_payment.html"
          window.location.href = "./checked_payment.html";

        } catch (error) {
          console.error("Lỗi cash payment:", error);
          alert("Không thể tạo booking. Kiểm tra lại console!");
        }
      } else {
        alert("Vui lòng chọn phương thức thanh toán");
      }
    });

  } catch (err) {
    console.error("Lỗi khi lấy booking data:", err);
  }
});
