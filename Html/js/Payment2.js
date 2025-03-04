function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

document.addEventListener("DOMContentLoaded", async function () {
  // Lấy bookingId từ sessionStorage
  let bookingId = sessionStorage.getItem("bookingId");
  console.log("BookingId từ sessionStorage:", bookingId);
  
  // Nếu không có, lấy từ query string
  if (!bookingId) {
    bookingId = getQueryParam("bookingId");
    console.log("BookingId từ query string:", bookingId);
  }
  
  if (!bookingId) {
    console.error("Không tìm thấy bookingId trong sessionStorage hoặc query string.");
    return;
  }
  
  try {
    const response = await fetch(`http://127.0.0.1:3000/api/hotel/${bookingId}`);
    if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu booking");
    
    const bookingData = await response.json();
    console.log("Dữ liệu booking nhận được:", bookingData);
    
    // Cập nhật các phần tử DOM theo mapping
    document.getElementById("room-name-display").innerText = bookingData.roomName;
    document.getElementById("basic-info-display").innerText = bookingData.basicInfo;
    document.getElementById("address-display").innerText = bookingData.address;
    
    const checkinDate = new Date(bookingData.checkin);
    document.getElementById("checkinDate").innerText = checkinDate.toLocaleDateString();
    
    const checkoutDate = new Date(bookingData.checkout);
    document.getElementById("checkoutDate").innerText = checkoutDate.toLocaleDateString();
    
    
    const petString = bookingData.pet;
    const lines = petString.split("\n").map(x => x.trim()).filter(Boolean);

    // Tìm dòng khớp với pattern "số + THÚ CƯNG"
    const petLine = lines.find(line => /\d+\s*THÚ\s*CƯNG/i.test(line));

    // Nếu tìm được, dùng nó; nếu không, fallback về giá trị gốc
    document.getElementById("bookingGuests").innerText = petLine || bookingData.pet;

    document.getElementById("subTotalText").innerText = `$${bookingData.subtotal}`;
    document.getElementById("discountText").innerText = bookingData.discount ? `-$${bookingData.discount}` : "$0";
    
    // Tính finalTotal = subtotal - discount và cập nhật hiển thị tại #finalTotalText
    const finalTotal = bookingData.subtotal - bookingData.discount;
    document.getElementById("finalTotalText").innerText = `$${finalTotal}`;
    
  } catch (err) {
    console.error("Lỗi khi lấy booking data:", err);
  }
});
