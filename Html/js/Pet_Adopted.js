document.addEventListener("DOMContentLoaded", async function () {
    const userId = localStorage.getItem("userId"); // Lấy userId của người dùng từ localStorage
    if (!userId) {
        console.error("Không tìm thấy userId");
        return;
    }

    try {
        const response = await fetch(`/api/adoptedPets/${userId}`);
        const pets = await response.json();

        const container = document.querySelector(".container-pet-info-content"); // Lấy container để hiển thị thú cưng

        if (pets.length === 0) {
            container.innerHTML = "<p>Không có thú cưng nào được nhận nuôi.</p>";
            return;
        }

        container.innerHTML = ""; // Xóa nội dung cũ trước khi thêm mới

        pets.forEach(pet => {
            // Tạo phần tử HTML cho mỗi thú cưng
            const petElement = document.createElement("div");
            petElement.classList.add("container-pet-info");

            petElement.innerHTML = `
                <h1 class="container-pet-info-title">Chi tiết thú cưng</h1>
                <div class="container-pet-info-content">
                    <img src="${pet.imageUrl || 'default-image.jpg'}" alt="${pet.petName}" class="container-pet-info-content-img">
                    <div class="container-pet-info-content-text">
                        <h1 class="container-pet-info-content-text-first-condition">${pet.status1}</h1>
                        <h1 class="container-pet-info-content-text-name">${pet.petName}</h1> 
                        <p class="container-pet-info-content-text-secon-condition">${pet.status2}</p>  
                    </div>
                </div>
            `;

            container.appendChild(petElement); // Thêm vào danh sách thú cưng
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu thú cưng:", error);
    }
});
