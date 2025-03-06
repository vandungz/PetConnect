// Hàm tạo card khách sạn
function createHotelCard(hotel, index) {
    const images = hotel.images.map(img => `<div class="item${index}"><img src="${img}"></div>`).join('');
    const dateRange = hotel.availability.join(" - ");
    return `
        <div class="property-card">
            <div class="slider-container">
                <div class="slider${index}">
                    <div class="list${index}">
                        ${images}
                    </div>
                    <div class="buttons${index}">
                        <button id="prev${index}"><i class="fa-solid fa-angle-left"></i></button>
                        <button id="next${index}"><i class="fa-solid fa-angle-right"></i></button>
                    </div>
                    <ul class="dots${index}">
                        ${hotel.images.map((_, i) => `<li${i === 0 ? ` class="active${index}"` : ''}></li>`).join('')}
                    </ul>
                    <button class="fav-icon"><i class="fa-solid fa-heart"></i></button>
                </div>
                <div class="property-details"> 
                    <div class="property-location">
                        <p class="room-name">${hotel.name}</p>
                        <p>★${hotel.rating}</p>
                    </div>
                    <div class="property-address">${hotel.location}</div>
                    <div class="property-date">${dateRange}</div>
                    <div class="property-price">$${hotel.price_per_night} đêm</div>
                </div>
            </div>
        </div>
    `;
}

// Gọi API để lấy dữ liệu khách sạn
async function fetchHotels() {
    try {
        console.log("Đang gọi API /api/hotels...");
        const response = await fetch('http://127.0.0.1:3000/api/hotels', {
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const hotels = await response.json();
        console.log("Dữ liệu nhận được:", hotels);

        const propertyList = document.getElementById('property-list');
        if (!propertyList) {
            console.error("Không tìm thấy element #property-list");
            return;
        }
        if (hotels.length === 0) {
            propertyList.innerHTML = "<p>Không có khách sạn nào để hiển thị.</p>";
            return;
        }
        propertyList.innerHTML = hotels.map((hotel, index) => createHotelCard(hotel, index + 1)).join('');

        // Khởi tạo slider sau khi render DOM
        hotels.forEach((_, index) => {
            initializeSlider(index + 1);
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
        const propertyList = document.getElementById('property-list');
        if (propertyList) propertyList.innerHTML = `<p>Lỗi: ${error.message}</p>`;
    }
}

// Hàm khởi tạo slider với kiểm tra lỗi
// Trong hotel-fetch.js, cập nhật initializeSlider
// Trong hotel-fetch.js, cập nhật initializeSlider
function initializeSlider(index) {
    const slider = document.querySelector(`.slider${index}`);
    const prevBtn = document.getElementById(`prev${index}`);
    const nextBtn = document.getElementById(`next${index}`);
    const dots = document.querySelectorAll(`.dots${index} li`);

    console.log(`Khởi tạo slider ${index}: prevBtn=${prevBtn}, nextBtn=${nextBtn}, dots.length=${dots.length}, slider=${slider}`);

    if (!prevBtn || !nextBtn || !dots.length || !slider) {
        console.warn(`Slider ${index} không được khởi tạo đầy đủ. prevBtn=${prevBtn}, nextBtn=${nextBtn}, dots.length=${dots.length}, slider=${slider}`);
        return;
    }

    let currentIndex = 0;
    const items = slider.querySelectorAll(`.item${index}`);
    const list = slider.querySelector(`.list${index}`);

    if (items.length === 0 || !list) {
        console.error(`Không tìm thấy items hoặc list trong slider ${index}. items.length=${items.length}, list=${list}`);
        return;
    }

    // Đặt chiều rộng của list bằng tổng chiều rộng của các item
    list.style.width = `${items.length * 100}%`;

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlider(slider, dots, currentIndex, index);
        console.log(`Next clicked, currentIndex=${currentIndex}`);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlider(slider, dots, currentIndex, index);
        console.log(`Prev clicked, currentIndex=${currentIndex}`);
    });

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            updateSlider(slider, dots, currentIndex, index);
            console.log(`Dot clicked, currentIndex=${currentIndex}`);
        });
    });

    function updateSlider(slider, dots, index, sliderIndex) {
        const list = slider.querySelector(`.list${sliderIndex}`);
        if (list) {
            list.style.transform = `translateX(-${(index * 100) / items.length}%)`;
            list.style.transition = 'transform 0.5s ease';
            dots.forEach(dot => dot.classList.remove(`active${sliderIndex}`));
            dots[index].classList.add(`active${sliderIndex}`);
        } else {
            console.error(`Không tìm thấy .list${sliderIndex}`);
        }
    }

    // Khởi tạo slider với ảnh đầu tiên
    updateSlider(slider, dots, currentIndex, index);
}
// Gọi hàm fetch khi trang tải
window.onload = fetchHotels;

// Hàm điều hướng
function goToMenuPage() {
    window.location.href = "./Menu.html";
}