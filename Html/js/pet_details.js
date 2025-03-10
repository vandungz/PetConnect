/*document.addEventListener("DOMContentLoaded", function() {
  const containerImg = document.querySelector(".container-img");
  const rightContent = document.querySelector(".container-main-content--right");

  // Tạo observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // .container-img đang ở trong vùng hiển thị => Ẩn khối bên phải
        rightContent.classList.remove("visible");
      } else {
        // .container-img ra khỏi vùng hiển thị => Hiển thị khối bên phải
        rightContent.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1, 
    // threshold = 0.1: Khi >=10% chiều cao container-img còn trên màn hình 
    // thì coi như "đang hiển thị".
  });

  // Bắt đầu quan sát container-img
  observer.observe(containerImg);
});*/
document.addEventListener('DOMContentLoaded', function() {
  const petName = localStorage.getItem('petName');
  const gender = localStorage.getItem('gender');
  const vaccin = localStorage.getItem('vaccin');
  const petImage = localStorage.getItem('petImage');
  const speciesName = localStorage.getItem('speciesName');
  const petAge = localStorage.getItem('petAge');

  
  document.getElementById('species-name').textContent = speciesName;
  document.getElementById('pet-name').textContent = petName;
  document.getElementById('pet-gender').textContent = gender;
  document.getElementById('pet-vaccin').textContent = vaccin;
  document.getElementById('pet-image').src = petImage;
  document.getElementById('pet-name-2').textContent = petName;
  document.getElementById('pet-gender-2').textContent = gender;
  document.getElementById('pet-vaccin-2').textContent = vaccin;
  document.getElementById('pet-image-2').src = petImage;
  
});
