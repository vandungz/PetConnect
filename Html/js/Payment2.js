// Hàm lấy param từ URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

document.addEventListener("DOMContentLoaded", async function () {
  // 1. Lấy bookingId từ sessionStorage hoặc query string
  let bookingId = sessionStorage.getItem("bookingId");
  console.log("BookingId từ sessionStorage:", bookingId);
  
  if (!bookingId) {
    bookingId = getQueryParam("bookingId");
    console.log("BookingId từ query string:", bookingId);
  }
  
  if (!bookingId) {
    console.error("Không tìm thấy bookingId trong sessionStorage hoặc query string.");
    return;
  }
  
  // 2. Gọi API để lấy thông tin booking
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/hotel/${bookingId}`);
    if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu booking");
    
    const bookingData = await response.json();
    console.log("Dữ liệu booking nhận được:", bookingData);
    
    // 3. Cập nhật DOM
    document.getElementById("room-name-display").innerText = bookingData.roomName;
    document.getElementById("basic-info-display").innerText = bookingData.basicInfo;
    document.getElementById("address-display").innerText = bookingData.address;
    
    const checkinDate = new Date(bookingData.checkin);
    document.getElementById("checkinDate").innerText = checkinDate.toLocaleDateString();
    
    const checkoutDate = new Date(bookingData.checkout);
    document.getElementById("checkoutDate").innerText = checkoutDate.toLocaleDateString();
    
    // Tìm dòng khớp với pattern "số + THÚ CƯNG"
    const petString = bookingData.pet;
    const lines = petString.split("\n").map(x => x.trim()).filter(Boolean);
    const petLine = lines.find(line => /\d+\s*THÚ\s*CƯNG/i.test(line));
    document.getElementById("bookingGuests").innerText = petLine || bookingData.pet;

    document.getElementById("subTotalText").innerText = `$${bookingData.subtotal}`;
    document.getElementById("discountText").innerText = bookingData.discount ? `-$${bookingData.discount}` : "$0";

    const finalTotal = bookingData.subtotal - bookingData.discount;
    document.getElementById("finalTotalText").innerText = `$${finalTotal}`;

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
            body: JSON.stringify({ bookingId: bookingId })
          });
          if (!res.ok) throw new Error("Lỗi khi tạo URL thanh toán VNPay");
          const data = await res.json();
          
          // Chuyển hướng sang cổng thanh toán VNPay
          window.location.href = data.vnpayUrl;
        } catch (error) {
          console.error("Error processing VNPay payment:", error);
        }
      } else if (cashRadio.checked) {
        // Chuyển hướng trang "thanh toán tiền mặt"
        window.location.href = "./checked_payment.html";
      } else {
        alert("Vui lòng chọn phương thức thanh toán");
      }
    });

  } catch (err) {
    console.error("Lỗi khi lấy booking data:", err);
  }
});
