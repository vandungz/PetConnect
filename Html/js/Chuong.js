document.addEventListener("DOMContentLoaded", function () {
    // Khởi tạo lịch Check-in và Check-out
    const checkinCalendar = flatpickr("#checkin", {
        locale: "vn",
        dateFormat: "d/m/Y",
        minDate: "today",
        defaultDate: "15/02/2025",
        position: "below",
        onOpen: updateCalendarPosition,
        onChange: (selectedDates, dateStr) => checkoutCalendar.set("minDate", dateStr)
    });

    const checkoutCalendar = flatpickr("#checkout", {
        locale: "vn",
        dateFormat: "d/m/Y",
        minDate: "today",
        defaultDate: "17/02/2025",
        position: "below",
        onOpen: updateCalendarPosition
    });

    function updateCalendarPosition(instance) {
        const calendar = instance.calendarContainer;
        if (calendar) {
            const rect = instance.input.getBoundingClientRect();
            Object.assign(calendar.style, {
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                position: "absolute",
                zIndex: "9999"
            });
        }
    }

    document.addEventListener("scroll", () => {
        [checkinCalendar, checkoutCalendar].forEach(instance => {
            if (instance.isOpen) updateCalendarPosition(instance);
        });
    });

    document.querySelector(".container-main-content--right-prepayment--date-time-left").addEventListener("click", () => document.querySelector("#checkin").click());
    document.querySelector(".container-main-content--right-prepayment--date-time-right").addEventListener("click", () => document.querySelector("#checkout").click());

    // Xử lý tính toán chi phí
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");
    const petCountElement = document.querySelector(".container-main-content--right-prepayment--pet-content");
    const btnMinus = document.querySelector(".container-main-content--right-prepayment--pet-number-btn-minus");
    const btnPlus = document.querySelector(".container-main-content--right-prepayment--pet-number-btn-plus");
    const nightDetailElement = document.getElementById("nightDetail");
    const nightPriceElement = document.getElementById("nightPrice");
    const serviceFeeFeeElement = document.getElementById("serviceFee");
    const cleaningFeeFeeElement = document.getElementById("cleaningFee")
    
    const discountElement = document.getElementById("discount");
    const totalCostElement = document.getElementById("totalCost");

    let petCount = 1,  extraPetFee =10 ;pricePerNight =priceKennel = 21.95; cleaningFee=20;

    function getDateValue(input) {
        if (!input || !input.value) return null;
        const [day, month, year] = input.value.split("/");
        return new Date(`${year}-${month}-${day}`);
    }

    function calculateTotal() {
        
        pricePerNight=priceKennel*(petCount);
        const checkinDate = getDateValue(checkinInput);
        const checkoutDate = getDateValue(checkoutInput);
        let nights = 0, discount = 0;

        if (checkinDate && checkoutDate) {
            nights = Math.max(1, Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)));
            if (nights >= 3) discount = 15;
        }

        const subtotal = nights * pricePerNight;
        const finalTotal = subtotal + cleaningFee + extraPetFee - discount;

        nightDetailElement.innerText = nights > 0 ? `$${pricePerNight} x ${nights} đêm` : "Chưa chọn ngày";
        nightPriceElement.innerText = `$${subtotal}`;
        cleaningFeeFeeElement.innerText = `$${cleaningFee}`;
        serviceFeeFeeElement.innerText = `$${extraPetFee}`;
        discountElement.innerText = discount ? `-$${discount}` : "$0";
        totalCostElement.innerText = `$${finalTotal}`;
    }

    function updatePetCount() {
        petCountElement.innerText = `${petCount} THÚ CƯNG`;
        btnMinus.style.visibility = petCount === 1 ? "hidden" : "visible";
        calculateTotal();
    }

    btnPlus.addEventListener("click", () => { petCount++; updatePetCount(); });
    btnMinus.addEventListener("click", () => { if (petCount > 1) petCount--; updatePetCount(); });
    checkinInput.addEventListener("change", calculateTotal);
    checkoutInput.addEventListener("change", calculateTotal);

    updatePetCount();
    calculateTotal();

    // Hiệu ứng menu khi cuộn
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".header--sub-scroll");
        const image = document.querySelector(".container-img");
        if (image) navbar.style.top = image.getBoundingClientRect().bottom <= 0 ? "0" : "-100px";
    });

    // Cuộn mượt khi nhấp vào liên kết menu
    document.querySelectorAll(".header--sub-scroll-list-link").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
        });
    });

    // Popup tiện ích
    const amenitiesPopup = document.getElementById("amenities-popup");
    const cmtPopup = document.getElementById("cmt-popup");

    const openAmenitiesPopup = document.querySelector(".container-main-content--left-utilities-all-util");
    const openCmtPopup = document.querySelector(".container-main-content--left-review-content-comment--all-comment");

    // Lấy danh sách nút đóng lại sau khi DOM load xong
    const closeButtons = document.querySelectorAll(".close");

    // Hàm mở popup
    function openPopup(popup) {
        if (popup) {
            popup.classList.add("show");
            document.body.classList.add("no-scroll");
        }
    }

    // Hàm đóng popup
    function closePopup(popup) {
        if (popup) {
            popup.classList.remove("show");
            document.body.classList.remove("no-scroll");
            
        }
    }

    // Sự kiện mở popup tiện ích
    if (openAmenitiesPopup) {
        openAmenitiesPopup.addEventListener("click", () => openPopup(amenitiesPopup));
    }

    // Sự kiện mở popup đánh giá
    if (openCmtPopup) {
        openCmtPopup.addEventListener("click", () => openPopup(cmtPopup));
    }

    // Đóng popup khi bấm vào nút close
    closeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            console.log("Click close:", event.target); // Kiểm tra nút đã click
    
            // Tìm phần tử cha chứa popup
            const popupToClose = event.target.closest(".popup");
    
            if (popupToClose) {
                closePopup(popupToClose);
                console.log("Closed popup:", popupToClose.id); // Kiểm tra popup nào đã đóng
            }
        });
    });
    // Đóng popup khi bấm ra ngoài nội dung popup
    window.addEventListener("click", (event) => {
        if (event.target === amenitiesPopup || event.target === cmtPopup) {
            closePopup(event.target);
        }
    });
});
function goToMenuPage() {
    window.location.href = "./Menu.html"; // Thay đổi đường dẫn nếu cần
}