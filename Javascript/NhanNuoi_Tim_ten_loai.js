document.addEventListener('DOMContentLoaded', function() {
  const petData = [
    { id: 1, loai: 'mèo',giong: 'Mèo rừng châu phi', ten: 'Anya', hinh: './assets/img/meo-rung-chau-phi.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 2, loai: 'chó',giong: 'Border Collie', ten: 'Cáo', hinh: './assets/img/cho1.jpg', gioiTinh: 'Đực', doTuoi: 'Chưa trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 3, loai: 'chó',giong: 'Chó lai', ten: 'Tuyết', hinh: './assets/img/cho2.jpg', gioiTinh: 'Đực', doTuoi: 'Chưa trưởng thành', trangThai: 'Chưa tiêm phòng' },
    { id: 4, loai: 'chó',giong: 'Chó ta', ten: 'Mít', hinh: './assets/img/adoptPet.jpg', gioiTinh: 'Đực', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 5, loai: 'mèo',giong: 'Mèo mướp', ten: 'Meo', hinh: './assets/img/cat1.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 6, loai: 'mèo',giong: 'Mèo mướp', ten: 'Bông', hinh: './assets/img/cat2.jpg', gioiTinh: 'Cái', doTuoi: 'Chưa trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 7, loai: 'mèo',giong: 'Mèo mướp', ten: 'Gạo', hinh: './assets/img/cat3.webp', gioiTinh: 'Đực', doTuoi: 'Chưa trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 8, loai: 'chó',giong: 'Chó ta', ten: 'Sen', hinh: './assets/img/pet3.png', gioiTinh: 'Đực', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 9, loai: 'chó',giong: 'Chihuahua', ten: 'Mun', hinh: './assets/img/pet4.webp', gioiTinh: 'Cái', doTuoi: 'Chưa trưởng thành', trangThai: 'Chưa tiêm phòng' },
    { id: 10, loai: 'chó',giong: 'Chó ta', ten: 'Báo', hinh: './assets/img/dog10.jpg', gioiTinh: 'Đực', doTuoi: 'Trưởng thành', trangThai: 'Chưa biết' },
    { id: 11, loai: 'chó',giong: 'Chó ta', ten: 'Vàng', hinh: './assets/img/dog8.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Chưa biết' },
    { id: 12, loai: 'mèo',giong: 'Mèo anh lông ngắn', ten: 'Milo', hinh: './assets/img/cat7.jpg', gioiTinh: 'Đực', doTuoi: 'Chưa trưởng thành', trangThai: 'Đã tiêm phòng' },
    { id: 13, loai: 'mèo',giong: 'Mèo ta lai', ten: 'Heli', hinh: './assets/img/cat8.jpg', gioiTinh: 'Đực', doTuoi: 'Chưa trưởng thành', trangThai: 'Chưa tiêm phòng' },
    { id: 14, loai: 'chó',giong: 'Border Collie lai', ten: 'Moon', hinh: './assets/img/dog6.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng'},
    { id: 15, loai: 'mèo',giong: 'Mèo mướp', ten: 'Fami', hinh: './assets/img/cat5.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng'},
    { id: 16, loai: 'mèo',giong: 'Mèo mướp', ten: 'Pun', hinh: './assets/img/cat6.jpg', gioiTinh: 'Đực', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng'},
    { id: 17, loai: 'chó',giong: 'Chó ta', ten: 'Kin', hinh: './assets/img/dog7.jpg', gioiTinh: 'Đực', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng'},
    { id: 18, loai: 'mèo',giong: 'Mèo mướp', ten: 'Kem', hinh: './assets/img/cat10.jpg', gioiTinh: 'Cái', doTuoi: 'Trưởng thành', trangThai: 'Đã tiêm phòng'}
  ];




function renderPets(data) {
  const container = document.getElementById('petList');
  container.innerHTML = '';
  data.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.classList.add('property-card');
      petCard.innerHTML = `
          <div class="item">
              <img src="${pet.hinh}" alt="${pet.ten}">
          </div>
          <div class="property-details"> 
              <div class="property-species">${pet.giong}</div>
              <div class="property-gender">${pet.gioiTinh}, ${pet.doTuoi}</div>
              <div class="property-name">${pet.ten} <span class="trangThai">${pet.trangThai}</span></div>
              <button class="btn">Nhận nuôi</button>
          </div>
      `;
      
      petCard.querySelector('.btn').addEventListener('click', () => {
          localStorage.setItem('petName', pet.ten);
          localStorage.setItem('gender', pet.gioiTinh + ', ' + pet.doTuoi);
          localStorage.setItem('vaccin', pet.trangThai);
          localStorage.setItem('petImage', pet.hinh);
          localStorage.setItem('speciesName', pet.giong);
          window.location.href = "pet_details.html";
      });
      
      container.appendChild(petCard);
  });
}

function filterPets() {
  const nameInput = document.getElementById('nameInput').value.toLowerCase().trim();
  const selectedSpecies = document.querySelector('.choose-animal .active')?.textContent.trim().toLowerCase() || 'tất cả';
  
  const filtered = petData.filter(pet => {
      const matchSpecies = selectedSpecies === 'tất cả' || pet.loai.toLowerCase() === selectedSpecies;
      const matchName = !nameInput || pet.ten.toLowerCase().includes(nameInput);
      return matchSpecies && matchName;
  });
  
  renderPets(filtered);
}

document.getElementById('btnSearch').addEventListener('click', filterPets);

document.querySelectorAll('.choose-animal .animal a').forEach(link => {
  link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.choose-animal .animal a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      filterPets();
  });
});

// Hiển thị danh sách thú cưng ban đầu
renderPets(petData);
});