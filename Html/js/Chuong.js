document.addEventListener("DOMContentLoaded", function () {
  // ---------------------------
  // Phần thiết lập flatpickr cho checkin, checkout
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

  document.querySelector(".container-main-content--right-prepayment--date-time-left")
    .addEventListener("click", () => document.querySelector("#checkin").click());
  document.querySelector(".container-main-content--right-prepayment--date-time-right")
    .addEventListener("click", () => document.querySelector("#checkout").click());

    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");
    const petCountElement = document.querySelector(".container-main-content--right-prepayment--pet-content");
    const btnMinus = document.querySelector(".container-main-content--right-prepayment--pet-number-btn-minus");
    const btnPlus = document.querySelector(".container-main-content--right-prepayment--pet-number-btn-plus");
    const nightDetailElement = document.getElementById("nightDetail");
    const nightPriceElement = document.getElementById("nightPrice");
    const serviceFeeFeeElement = document.getElementById("serviceFee");
    const cleaningFeeFeeElement = document.getElementById("cleaningFee");
    const discountElement = document.getElementById("discount");
    const totalCostElement = document.getElementById("totalCost");
  let priceKennel = 460.000; // Giá mặc định
  const storedPrice = localStorage.getItem("price");
  priceKennel = parseFloat(storedPrice.replace(/[^0-9.]/g, ''));
  let petCount = 1, extraPetFee = 150.000, pricePerNight = 230.000, cleaningFee = 260.000;

  // Hàm chuyển đổi giá trị input ngày
  function getDateValue(input) {
    if (!input || !input.value) return null;
    const [day, month, year] = input.value.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  // Hàm tính toán tổng chi phí
  function calculateTotal() {
    // Tính pricePerNight dựa trên số lượng thú cưng và giá của phòng (priceKennel)
    pricePerNight = priceKennel * petCount;
    const checkinDate = getDateValue(checkinInput);
    const checkoutDate = getDateValue(checkoutInput);
    let nights = 0, discount = 0;

    if (checkinDate && checkoutDate) {
      nights = Math.max(1, Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)));
      if (nights >= 3) discount = 15;
    }

    const subtotal = nights * pricePerNight;
    const finalTotal = subtotal + cleaningFee + extraPetFee - discount;

    nightDetailElement.innerText = nights > 0 ? `${pricePerNight.toFixed(2)} x ${nights} đêm` : "Chưa chọn ngày";
    nightPriceElement.innerText = `₫${subtotal.toFixed(2)}`;
    cleaningFeeFeeElement.innerText = `₫${cleaningFee.toFixed(2)}`;
    serviceFeeFeeElement.innerText = `₫${extraPetFee.toFixed(2)}`;
    discountElement.innerText = discount ? `-₫${discount.toFixed(2)}` : "₫0";
    totalCostElement.innerText = `₫${finalTotal.toFixed(2)}`;
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

  // ---------------------------
  // Các chức năng khác: hiệu ứng menu, popup, …
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".header--sub-scroll");
    const image = document.querySelector(".container-img");
    if (image) navbar.style.top = image.getBoundingClientRect().bottom <= 0 ? "0" : "-100px";
  });

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
  const closeButtons = document.querySelectorAll(".close");

  function openPopup(popup) {
    if (popup) {
      popup.classList.add("show");
      document.body.classList.add("no-scroll");
    }
  }

  function closePopup(popup) {
    if (popup) {
      popup.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }
  }

  if (openAmenitiesPopup) {
    openAmenitiesPopup.addEventListener("click", () => openPopup(amenitiesPopup));
  }

  if (openCmtPopup) {
    openCmtPopup.addEventListener("click", () => openPopup(cmtPopup));
  }

  closeButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const popupToClose = event.target.closest(".popup");
      if (popupToClose) {
        closePopup(popupToClose);
      }
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === amenitiesPopup || event.target === cmtPopup) {
      closePopup(event.target);
    }
  });

  // ---------------------------
  // PHẦN XỬ LÝ LƯU DỮ LIỆU KHI NHẤN NÚT THANH TOÁN
  // (Nút có class "container-main-content--right-prepayment-button")
  document.querySelector('.container-main-content--right-prepayment-button')
    .addEventListener('click', async function () {
      // Lấy thông tin từ DOM
      const roomName = document.querySelector('.container-main-content--left-info-head').innerText;
      const basicInfo = document.querySelector('.container-main-content--left-info-content-name').innerText;
      const address = document.querySelector('.container-content--bottom-location').innerText;
      const checkin = document.querySelector('#checkin').value;
      const checkout = document.querySelector('#checkout').value;
      // Lấy thông tin thú cưng từ phần tử mới:
      const pet = document.querySelector('.container-main-content--right-prepayment--pet').innerText;

      // Hàm parse giá tiền từ các phần tử có id tương ứng
      const parsePrice = (selector) => {
        const el = document.getElementById(selector);
        if (!el) return 0;
        return parseFloat(el.innerText.replace('$', '').replace('-', '')) || 0;
      };
      const nightPrice = parsePrice("nightPrice");
      const cleaningFee = parsePrice("cleaningFee");
      const serviceFee = parsePrice("serviceFee");
      const discount = parsePrice("discount");
      const subtotal = nightPrice + cleaningFee + serviceFee;

      const bookingData = { roomName, basicInfo, address, checkin, checkout, pet, subtotal, discount };
      console.log("bookingData:", bookingData);
      try {
        const response = await fetch("http://127.0.0.1:3000/api/hotel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        // Sau redirect, bookingId sẽ được truyền qua query string (hoặc lưu vào session/localStorage)
        window.location.href = `./Payment2.html?bookingId=${data._id}`;
      } catch (err) {
        console.error("Lỗi khi lưu booking:", err);
        return null;
      }

      const bookRoomBtn = document.getElementById("bookRoomBtn");
      bookRoomBtn.addEventListener("click", async function () {
        const data = await sendBookingData();
        if (data && data._id) {
          // Lưu vào localStorage để đảm bảo dữ liệu không bị mất qua reload
          localStorage.setItem("bookingId", data._id);
          window.location.href = `./Payment2.html?bookingId=${data._id}`;
        } else {
          console.error("Không có bookingId trả về từ server.");
        }
    });
});

function goToMenuPage() {
  window.location.href = "./MenuAfterLogin.html";
}
document.addEventListener('DOMContentLoaded', function () {
  const servicesLink = document.getElementById('services-link');
  const servicesDropdown = document.getElementById('services-dropdown');

  servicesLink.addEventListener('click', function (event) {
    event.preventDefault();
    servicesDropdown.classList.toggle('active');
  });

  document.addEventListener('click', function (event) {
    if (!servicesLink.contains(event.target) && !servicesDropdown.contains(event.target)) {
      servicesDropdown.classList.remove('active');
    }
  });
});
});
document.addEventListener('DOMContentLoaded', function () {
  // Function to update room details
  function updateRoomDetails(roomName, roomType, material, petType, weight, judgement, price, address) {
    document.querySelector('.container-main-content--left-info-head').textContent = roomName;
    document.querySelector('.container-main-content--left-info-content-name').textContent = `${roomType} • ${material} • ${petType} • ${weight}`;
    document.querySelector('.container-content--bottom-location').textContent=address;
    document.querySelector('.container-main-content--left-info-content-review-fist-number').textContent = judgement;
    document.getElementById("pricePerNight").textContent = `${price}`;
     
  }

  // Check if room details are stored in localStorage
  const roomName = localStorage.getItem('roomName');
  const roomType = localStorage.getItem('roomType');
  const material = localStorage.getItem('material');
  const petType = localStorage.getItem('petType');
  const weight = localStorage.getItem('weight');
  const judgement = localStorage.getItem('judgement');
  const price = localStorage.getItem('price');
  const address = localStorage.getItem('address');

  if (roomName && roomType && material && petType && weight && judgement && price && address) {
    // Update room details with the data from localStorage
    updateRoomDetails(roomName, roomType, material, petType, weight, judgement, price, address);

    // Clear localStorage
    localStorage.removeItem('roomName');
    localStorage.removeItem('roomType');
    localStorage.removeItem('material');
    localStorage.removeItem('petType');
    localStorage.removeItem('weight');
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Lấy dữ liệu hình ảnh từ localStorage với key "propertyImages"
  const images = JSON.parse(localStorage.getItem('propertyImages'));

  if (images && images.length > 0) {
    // Hiển thị ảnh chính và phụ ban đầu trong container-img
    const mainImage = document.querySelector('.container-img--main-content');
    const supImages = document.querySelectorAll('.container-img--sup-content');

    mainImage.src = images[0];
    supImages.forEach((img, index) => {
      if (images[index + 1]) {
        img.src = images[index + 1];
      }
    });
  }

  // Hàm mở Lightbox slider với hiệu ứng fade mượt
  function openLightbox(imgArray, startIndex) {
    const lightbox = document.getElementById('lightbox');
    const imgElement = lightbox.querySelector('.lightbox-image');
    const counter = lightbox.querySelector('.lightbox-counter');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    let currentIndex = startIndex;
    const total = imgArray.length;

    function updateImage() {
      // Fade out ảnh hiện tại
      imgElement.style.opacity = 0;
      setTimeout(() => {
        // Cập nhật ảnh mới và chỉ số
        imgElement.src = imgArray[currentIndex];
        counter.textContent = `${currentIndex + 1}/${total}`;
        // Fade in ảnh mới
        imgElement.style.opacity = 1;
      }, 200); // 200ms, bạn có thể điều chỉnh
    }

    btnClose.onclick = function (e) {
      e.stopPropagation();
      // Fade out lightbox container, sau đó ẩn đi
      lightbox.classList.remove('show');
      setTimeout(() => {
        lightbox.style.display = 'none';
      }, 400); // Thời gian khớp với transition của CSS (0.4s)
    };

    btnPrev.onclick = function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + total) % total;
      updateImage();
    };

    btnNext.onclick = function (e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % total;
      updateImage();
    };

    // Mở lightbox với hiệu ứng fade in
    lightbox.style.display = 'flex';
    // Buộc reflow để transition hoạt động
    void lightbox.offsetWidth;
    lightbox.classList.add('show');
    updateImage();
  }

  // Khi click vào .container-img, tạo overlay hiển thị tất cả các ảnh của property card
  document.querySelector('.container-img').addEventListener('click', function (e) {
    e.stopPropagation();

    // Tạo overlay container
    const allImagesContainer = document.createElement('div');
    allImagesContainer.classList.add('all-images-container');

    // Tạo header với nút đóng cho overlay
    const header = document.createElement('header');
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    closeButton.onclick = function () {
      allImagesContainer.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(allImagesContainer);
        document.body.classList.remove('no-scroll');
      }, 500);
    };
    header.appendChild(closeButton);
    allImagesContainer.appendChild(header);

    // Phân tách mảng ảnh thành roomImages và playImages (dựa vào tên file chứa "room" và "play")
    const roomImages = images.filter(src => src.includes('room'));
    const playImages = images.filter(src => src.includes('play'));

    // Tạo container cho hình ảnh phòng
    const roomContainer = document.createElement('div');
    roomContainer.classList.add('room-container');
    const roomHeader = document.createElement('h2');
    roomHeader.textContent = 'Hình ảnh phòng';
    roomContainer.appendChild(roomHeader);

    const roomMainImage = document.createElement('img');
    roomMainImage.src = roomImages[0] || '';
    roomMainImage.classList.add('room-main-image');
    roomContainer.appendChild(roomMainImage);

    const roomSubContainer = document.createElement('div');
    roomSubContainer.classList.add('room-sub-container');
    roomImages.slice(1).forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('room-sub-image');
      roomSubContainer.appendChild(img);
      // Gán sự kiện click cho ảnh phụ
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        const allImagesCombined = [...roomImages, ...playImages];
        openLightbox(allImagesCombined, index + 1);
      });
    });
    roomContainer.appendChild(roomSubContainer);
    allImagesContainer.appendChild(roomContainer);

    // Tạo container cho hình ảnh sân chơi nếu có
    if (playImages.length > 0) {
      const playContainer = document.createElement('div');
      playContainer.classList.add('play-container');
      const playHeader = document.createElement('h2');
      playHeader.textContent = 'Hình ảnh sân chơi';
      playContainer.appendChild(playHeader);

      const playMainImage = document.createElement('img');
      playMainImage.src = playImages[0] || '';
      playMainImage.classList.add('play-main-image');
      playContainer.appendChild(playMainImage);

      const playSubContainer = document.createElement('div');
      playSubContainer.classList.add('play-sub-container');
      playImages.slice(1).forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('play-sub-image');
        playSubContainer.appendChild(img);
        // Gán sự kiện click cho ảnh phụ sân chơi
        img.addEventListener('click', function (e) {
          e.stopPropagation();
          const allImagesCombined = [...roomImages, ...playImages];
          openLightbox(allImagesCombined, roomImages.length + index + 1);
        });
      });
      playContainer.appendChild(playSubContainer);
      allImagesContainer.appendChild(playContainer);

      // Gán sự kiện click cho ảnh chính sân chơi
      playMainImage.addEventListener('click', function (e) {
        e.stopPropagation();
        const allImagesCombined = [...roomImages, ...playImages];
        openLightbox(allImagesCombined, roomImages.length);
      });
    }

    // Gán sự kiện click cho ảnh chính phòng
    roomMainImage.addEventListener('click', function (e) {
      e.stopPropagation();
      const allImagesCombined = [...roomImages, ...playImages];
      openLightbox(allImagesCombined, 0);
    });

    // Thêm overlay vào body và vô hiệu hóa cuộn trang
    document.body.appendChild(allImagesContainer);
    document.body.classList.add('no-scroll');

    // Kích hoạt hiệu ứng chuyển động cho overlay
    setTimeout(() => {
      allImagesContainer.classList.add('show');
    }, 50);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const amenitiesStr = localStorage.getItem('selectedAmenities');
  if (!amenitiesStr) return;

  const amenities = JSON.parse(amenitiesStr); // mảng đối tượng tiện nghi

  // Hàm trả về icon dựa theo id hoặc tên tiện nghi (định nghĩa theo nhu cầu)
  function getAmenityIcon(amenity) {
    // Ví dụ: nếu amenity.id === 1 thì trả về icon ăn uống
    switch (amenity.id) {
      case 1: return '<i class="fa-solid fa-utensils"></i>';
      case 2: return '<i class="fa-solid fa-shower"></i>';
      case 3: return '<i class="fa-solid fa-walking"></i>';
      case 4: return '<i class="fa-solid fa-temperature-three-quarters"></i>';
      case 5: return '<i class="fa-solid fa-snowflake"></i>';
      case 6: return '<i class="fa-solid fa-wind"></i>';
      case 7: return '<i class="fa-solid fa-hand-holding-heart"></i>';
      case 8: return '<i class="fa-solid fa-soap"></i>';
      case 9: return '<i class="fa-solid fa-horse"></i>';
      case 10: return '<i class="fa-solid fa-gamepad"></i>';
      case 11: return '<i class="fa-solid fa-house"></i>';
      case 12: return '<i class="fa-solid fa-fire-extinguisher"></i>';
      default: return '<i class="fa-solid fa-circle-info"></i>';

    }
  }

  // Lấy container hiển thị tiện nghi
  const listContainer = document.querySelector('.container-main-content--left-utilities-list');
  // Xoá danh sách cũ nếu có
  listContainer.innerHTML = '';

  let amenitiesToDisplay = amenities;
  let isOverflow = false;

  if (amenities.length > 6) {
    amenitiesToDisplay = amenities.slice(0, 6);
    isOverflow = true;
  }

  // Tạo các phần tử tiện nghi
  amenitiesToDisplay.forEach(amenity => {
    const li = document.createElement('li');
    li.classList.add('container-main-content--left-utilities-list-content');
    li.innerHTML = `
<div class="container-main-content--left-utilities-list-content-icon">
  ${getAmenityIcon(amenity)}
</div>
<p class="container-main-content--left-utilities-list-content-text">${amenity.name}</p>
`;
    listContainer.appendChild(li);
  });

  // Nếu có nhiều hơn 6 tiện nghi, hiển thị nút mở popup
  if (isOverflow) {
    const btn = document.createElement('div');
    btn.id = 'review';
    btn.classList.add('container-main-content--left-utilities-all-util');
    btn.innerHTML = `<p class="container-main-content--left-utilities-all-util-text">Hiện tất cả ${amenities.length} tiện nghi</p>`;
    listContainer.parentNode.appendChild(btn);

    btn.addEventListener('click', () => {
      // Hiển thị popup
      const popup = document.getElementById('amenities-popup');
      popup.style.display = 'block';
      const popupList = popup.querySelector('.amenity-category-list');
      popupList.innerHTML = ''; // Xoá nội dung cũ
      amenities.forEach(amenity => {
        const liPopup = document.createElement('li');
        liPopup.classList.add('amenity-category-list-item');
        liPopup.innerHTML = `
    <div class="amenity-category-list-item-icon">
      ${getAmenityIcon(amenity)}
    </div>
    <p class="amenity-category-list-item-text">${amenity.name}</p>
  `;
        popupList.appendChild(liPopup);
      });
    });

    // Đóng popup khi click vào nút đóng
    const closeBtn = document.querySelector('#amenities-popup .popup-content-close .close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('amenities-popup').style.display = 'none';
      });
    }
  }
});

