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

    document.querySelector(".container-main-content--date-time-left").addEventListener("click", () => document.querySelector("#checkin").click());
    document.querySelector(".container-main-content--date-time-right").addEventListener("click", () => document.querySelector("#checkout").click());

    // Xử lý tính toán chi phí
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");

});