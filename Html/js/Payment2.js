document.addEventListener("DOMContentLoaded", function() {
  const bookingDataStr = sessionStorage.getItem("bookingData");
  if (!bookingDataStr) return;

  const bookingData = JSON.parse(bookingDataStr);

  const checkinDate = new Date(bookingData.checkin); 
  const checkoutDate = new Date(bookingData.checkout); 
  const checkinDay = checkinDate.getDate(); 
  const checkoutDay = checkoutDate.getDate(); 
  const checkinMonth = checkinDate.getMonth() + 1; 
  // Months are zero-based 
  const checkoutMonth = checkoutDate.getMonth() + 1; let dateText; 
  if (checkinMonth === checkoutMonth) { 
    dateText = `${checkinDay} - ${checkoutDay} thg ${checkinMonth}`; 
  } else { 
    dateText = `${checkinDay} thg ${checkinMonth} - ${checkoutDay} thg ${checkoutMonth}`; 
  } 
  document.getElementById("bookingDates").innerText = dateText;


  // Tính toán: priceNightsTotal = costPerNight * nights
  const nightsTotal = bookingData.costPerNight * bookingData.nights;
  // subTotal = priceNightsTotal + serviceFee
  const subTotal = nightsTotal + bookingData.serviceFee;
  // finalTotal = subTotal - discount
  const finalTotal = subTotal - bookingData.discount;

  document.getElementById("subTotalText").innerText = `$${subTotal}`;
  document.getElementById("discountText").innerText = bookingData.discount ? `-$${bookingData.discount}` : "$0";
  document.getElementById("finalTotalText").innerText = `$${finalTotal}`;
});
