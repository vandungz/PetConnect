document.addEventListener("DOMContentLoaded", async function () {
    let userId = localStorage.getItem("userId");
    console.log("userId từ localStorage:", userId); // Debug

    if (!userId) {
        try {
            const response = await fetch("http://127.0.0.1:3000/api/getUserId", { credentials: "include" });
            const data = await response.json();
            console.log("Dữ liệu trả về từ API getUserId:", data); // Debug

            if (data.userId) {
                userId = data.userId;
                localStorage.setItem("userId", userId);
            } else {
                console.error("Không tìm thấy userId từ API");
                return;
            }
        } catch (error) {
            console.error("Lỗi khi lấy userId từ API:", error);
            return;
        }
    }

    console.log("userId sau khi lấy từ API:", userId); // Debug

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/adoptedPets/${userId}`);
        const pets = await response.json();

        console.log("Dữ liệu trả về từ API adoptedPets:", pets); // Debug

        if (!Array.isArray(pets)) {
            console.error("Dữ liệu trả về không phải mảng:", pets);
            return;
        }

        const container = document.querySelector(".container-pet-info-content");

        if (pets.length === 0) {
            container.innerHTML = "<p>Không có thú cưng nào được nhận nuôi.</p>";
            return;
        }

        container.innerHTML = ""; // Xóa nội dung cũ

        pets.forEach(pet => {
            const petElement = document.createElement("div");
            petElement.classList.add("container-pet-info");
            petElement.innerHTML = `
                <h1 class="container-pet-info-title">Chi tiết thú cưng</h1>
                <div class="container-pet-info-content">
                    <img src="${pet.imageUrl || 'default-image.jpg'}" alt="${pet.petName}" class="container-pet-info-content-img">
                    <div class="container-pet-info-content-text">
                        <h1 class="container-pet-info-content-text-first-condition">${pet.status1 || "Không có thông tin"}</h1>
                        <h1 class="container-pet-info-content-text-name">${pet.petName || "Không có tên"}</h1> 
                        <p class="container-pet-info-content-text-secon-condition">${pet.status2 || "Không có thông tin"}</p>  
                    </div>
                </div>
            `;
            container.appendChild(petElement);
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu thú cưng:", error);
    }
});
