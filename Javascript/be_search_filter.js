
    document.addEventListener('DOMContentLoaded', function() {
        const searchButton = document.querySelector('#searchButton');
        const locationInput = document.querySelector('.location-dropdown input');
        const locationDropdownItems = document.querySelectorAll('.dropdown-content li');
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        const petCounts = document.querySelectorAll('.pet-count');
        const propertyCards = document.querySelectorAll('.property-card');

        // Hiển thị giá trị đã chọn lên chỗ chọn địa điểm
        locationDropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                locationInput.value = this.textContent.trim();
            });
        });

        // Hiển thị giá trị đã chọn lên chỗ thêm thú cưng
        const petsDropdown = document.querySelector('.pets-dropdown');
        const petsDropdownContent = document.querySelector('.pets-dropdown-content');
        const textDescription = document.querySelector('.text-description');

        let selectedWeight = '';

        function updatePetsDescription() {
            const petCountsArray = Array.from(petCounts).map(count => parseInt(count.textContent));
            const totalPets = petCountsArray.reduce((acc, count) => acc + count, 0);
            textDescription.textContent = `Add pets (${totalPets})`;
        
            // Lưu giá trị cân nặng đã chọn
            if (totalPets > 0) {
                if (totalPets <= 10) {
                    selectedWeight = 'Nhỏ';
                } else if (totalPets <= 20) {
                    selectedWeight = 'Vừa';
                } else {
                    selectedWeight = 'Lớn';
                }
            } else {
                selectedWeight = '';
            }
        }

        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');

        increaseButtons.forEach((button, index) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                petCounts[index].textContent = parseInt(petCounts[index].textContent) + 1;
                updatePetsDescription();
            });
        });

        decreaseButtons.forEach((button, index) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                if (parseInt(petCounts[index].textContent) > 0) {
                    petCounts[index].textContent = parseInt(petCounts[index].textContent) - 1;
                    updatePetsDescription();
                }
            });
        });


function formatDate(date) {
    return date.toLocaleDateString('en-GB'); // 'en-GB' for day/month/year format
}

function convertMonthToNumber(month) {
    const months = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
    };
    return months[month];
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
}

function isDateInRange(startDate, endDate, checkDate) {
    return checkDate >= startDate && checkDate <= endDate;
}

searchButton.addEventListener('click', function() {
    const location = locationInput.value.toLowerCase();
    // Nếu không có giá trị, thì set về null
    const checkinDate = checkinInput.value ? parseDate(checkinInput.value) : null;
    const checkoutDate = checkoutInput.value ? parseDate(checkoutInput.value) : null;
    const pets = Array.from(petCounts).map(count => parseInt(count.textContent));

    // Xác định cân nặng dựa trên số lượng pets (nếu có)
    if (pets[0] > 0) {
        selectedWeight = 'Nhỏ';
    } else if (pets[1] > 0) {
        selectedWeight = 'Vừa';
    } else if (pets[2] > 0) {
        selectedWeight = 'Lớn';
    } else {
        selectedWeight = '';
    }

    // Lọc các phòng dựa trên điều kiện:
    propertyCards.forEach(card => {
        const propertyLocation = card.querySelector('.property-address').textContent.toLowerCase();
        const propertyDates = card.querySelector('.property-date').textContent.split(' ');
        const propertyCheckinDate = new Date(`${propertyDates[2]}-${convertMonthToNumber(propertyDates[0])}-${propertyDates[1].split('-')[0]}`);
        const propertyCheckoutDate = new Date(`${propertyDates[2]}-${convertMonthToNumber(propertyDates[0])}-${propertyDates[1].split('-')[1]}`);
        const propertyWeight = card.getAttribute('data-weight');

        // Nếu ô location rỗng, matchesLocation = true, nếu không thì so sánh
        const matchesLocation = location === '' || propertyLocation.includes(location);

        // Nếu không có giá trị check-in và check-out, thì bỏ qua so sánh ngày
        const matchesDateRange = (!checkinDate && !checkoutDate) || 
          (isDateInRange(checkinDate, checkoutDate, propertyCheckinDate) ||
           isDateInRange(checkinDate, checkoutDate, propertyCheckoutDate) ||
           (propertyCheckinDate <= checkinDate && propertyCheckoutDate >= checkoutDate));

        // Nếu chưa chọn pet (selectedWeight rỗng) thì coi như thỏa mãn
        const matchesWeight = selectedWeight === '' || propertyWeight.includes(selectedWeight);

        if (matchesLocation && matchesDateRange && matchesWeight) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

});
document.addEventListener('DOMContentLoaded', function() {
    const roomTypeButtons = document.querySelectorAll('.room-type .option');
    const applyButton = document.querySelector('.apply-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    const modal = document.querySelector('.modal');
    let selectedRoomType = 'Bất kỳ loại nào';
    const filterBtn = document.querySelector('.js-ftbtn');
    const modalContainer = document.querySelector('.filter-container');
    const closeBtn = document.querySelector('.fa-xmark');
    const filterButtons = document.querySelectorAll('.ftbtn');

    function showFilter() {
        modal.classList.add('open');
    }

    function hideFilter() {
        modal.classList.remove('open');
    }

    filterBtn?.addEventListener('click', showFilter);
    modal.addEventListener('click', hideFilter);
    modalContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    closeBtn.addEventListener('click', hideFilter);
    roomTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            roomTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedRoomType = this.textContent;
            updateRoomCount();
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.textContent.trim();
            filterProperties(filterValue);
        });
    });

    applyButton.addEventListener('click', function() {
        filterRooms();
        hideFilter();
    });

    // Hàm kiểm tra phòng có phù hợp không dựa trên các tiêu chí đã chọn
function isRoomMatch(card, selectedPrice, selectedRoomType, selectedAmenities) {
    // Kiểm tra giá
    const priceText = card.querySelector('.property-price').textContent;
    const priceUSD = parseFloat(priceText.replace('$', '').replace('đêm', '').trim());
    const conversionFactor = 23000; // ví dụ chuyển đổi từ USD sang VND
    const priceVND = priceUSD * conversionFactor;
    const matchesPrice = priceVND <= selectedPrice;
  
    // Kiểm tra loại chuồng (giả sử lưu ở thuộc tính data-material)
    const roomMaterial = card.getAttribute('data-material');
    const matchesRoomType = (selectedRoomType === 'Bất kỳ loại nào' || roomMaterial === selectedRoomType);
  
    // Kiểm tra tiện nghi (ví dụ: nếu có bất kỳ tiện nghi nào trong selectedAmenities)
    const amenities = JSON.parse(card.getAttribute('data-amenities'));
    const matchesAmenities = selectedAmenities.length === 0 ||
      selectedAmenities.some(id => amenities.some(amenity => amenity.id === id));
  
    return matchesPrice && matchesRoomType && matchesAmenities;
  }
  
  // Hàm cập nhật số lượng phòng phù hợp trên nút hiển thị
  function updateRoomCount() {
    // Lấy giá trị bộ lọc hiện tại (ví dụ: giá tối đa, loại chuồng và tiện nghi)
    const selectedPrice = parseInt(document.getElementById('price-range').value);
    const selectedRoomType = document.querySelector('.room-type .active')?.textContent || 'Bất kỳ loại nào';
    // Giả sử các tiện nghi active có class 'active' và lưu data-id
    const selectedAmenities = Array.from(document.querySelectorAll('.amenity-btn.active'))
                                .map(btn => parseInt(btn.getAttribute('data-id')));
  
    const propertyCards = document.querySelectorAll('.property-card');
    const matchingRooms = Array.from(propertyCards).filter(card => 
      isRoomMatch(card, selectedPrice, selectedRoomType, selectedAmenities)
    );
    const applyButton = document.querySelector('.apply-btn');
    applyButton.textContent = `Hiển thị ${matchingRooms.length} chuồng`;
  }
  
  // Hàm lọc và hiển thị các phòng khi nhấn nút "Hiển thị"
  function filterRooms() {
    const selectedPrice = parseInt(document.getElementById('price-range').value);
    const selectedRoomType = document.querySelector('.room-type .active')?.textContent || 'Bất kỳ loại nào';
    const selectedAmenities = Array.from(document.querySelectorAll('.amenity-btn.active'))
                                .map(btn => parseInt(btn.getAttribute('data-id')));
  
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
      if (isRoomMatch(card, selectedPrice, selectedRoomType, selectedAmenities)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Ví dụ: gọi updateRoomCount() mỗi khi có thay đổi ở bộ lọc
  document.getElementById('price-range').addEventListener('input', updateRoomCount);
  document.querySelectorAll('.room-type .option').forEach(btn => {
    btn.addEventListener('click', () => {
      // Đánh dấu button active
      document.querySelectorAll('.room-type .option').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      updateRoomCount();
    });
  });
  document.querySelectorAll('.amenity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      updateRoomCount();
    });
  });
  

});
     
 document.addEventListener('DOMContentLoaded', function() {
	// Lấy phần tử slider và các phần hiển thị giá
	const priceSlider = document.getElementById('price-range');
	const minPriceDisplay = document.querySelector('.minprice span');
	const maxPriceDisplay = document.querySelector('.maxprice span');
	
	// Tỉ giá chuyển đổi (giả sử 1 USD = 23000 VND)
	const conversionFactor = 23000;
	
	function showFilter() {
        modal.classList.add('open');
        const priceSlider = document.getElementById('price-range');
        priceSlider.value = priceSlider.max; // Đặt giá trị slider về max
        updateMaxPriceDisplay(priceSlider.value); // Cập nhật hiển thị giá
    }
    
	
	// Lắng nghe sự kiện input khi kéo slider
	priceSlider.addEventListener('input', function() {
	  updateMaxPriceDisplay(this.value);
	  filterRoomsByPrice(parseInt(this.value));
	});
	
	// Hàm cập nhật hiển thị giá tối đa theo slider
	function updateMaxPriceDisplay(value) {
	  const max = parseInt(priceSlider.max);
	  let formattedValue = formatPrice(value);
	  // Nếu giá slider đạt mức tối đa, thêm dấu "+" vào hiển thị
	  if (parseInt(value) === max) {
		maxPriceDisplay.textContent = "₫ " + formattedValue + "+";
	  } else {
		maxPriceDisplay.textContent = "₫ " + formattedValue;
	  }
	}
	
	// Hàm định dạng số (thêm dấu phân cách hàng nghìn)
	function formatPrice(value) {
	  return parseInt(value).toLocaleString('vi-VN');
	}

document.querySelector('.clear-btn').addEventListener('click', function() {
    // 1. Reset thanh slider giá về giá trị mặc định (giả sử giá mặc định là max)
    const priceSlider = document.getElementById('price-range');
    priceSlider.value = priceSlider.max; 
    updateMaxPriceDisplay(priceSlider.value); // Cập nhật hiển thị giá
  
    // 2. Xóa active class khỏi tất cả các nút tiện nghi đã chọn
    document.querySelectorAll('.amenity-btn.active').forEach(btn => btn.classList.remove('active'));
  
    // 3. Reset lựa chọn loại chuồng: xóa active ở tất cả, sau đó chọn mặc định (ví dụ: "Bất kỳ loại nào")
    const roomTypeButtons = document.querySelectorAll('.room-type .option');
    roomTypeButtons.forEach(btn => btn.classList.remove('active'));
    const defaultRoomType = document.querySelector('.room-type .option:first-child');
    if (defaultRoomType) {
      defaultRoomType.classList.add('active');
    }
    updateRoomCount();
  });
});