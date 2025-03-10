document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/currentUser", {
            method: "GET",
            credentials: "include", // Để gửi cookie session
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("name").textContent = data.fullName;
            document.getElementById("phone-Number").textContent = data.phoneNumber;
            document.getElementById("address").textContent = data.address;
            document.getElementById("email").textContent = data.email;

            // Hiển thị ảnh đại diện
            const avatarElement = document.getElementById("avatar");
            if (avatarElement) {
                avatarElement.src = data.avatar;
            }
        } else {
            console.error("Lỗi:", data.message);
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
    }
});
function loadPetDetailsFromLocalStorage() {
    // Lấy thông tin từ localStorage
    const petName = localStorage.getItem('petName');
    const gender = localStorage.getItem('gender');       // đã bao gồm giới tính và độ tuổi
    const vaccin = localStorage.getItem('vaccin');
    const petImage = localStorage.getItem('petImage');
    // const speciesName = localStorage.getItem('speciesName'); // Nếu cần dùng
  
    // Cập nhật thông tin lên các phần tử HTML trong Adoption_Confirmation.html
    // Giả sử các phần tử có id: "petName", "petStatus1", "petStatus2", "petImageAdoption"
    document.getElementById("petName").textContent = petName || "Chưa có tên";
    document.getElementById("petStatus1").textContent = vaccin || "Chưa có thông tin";
    document.getElementById("petStatus2").textContent = gender || "Chưa có thông tin";
  
    // Cập nhật ảnh thú cưng nếu có
    const petImgEl = document.getElementById("petImageAdoption");
    if (petImgEl && petImage) {
      petImgEl.src = petImage;
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Gọi hàm để load thông tin thú cưng từ localStorage
    loadPetDetailsFromLocalStorage();
  
    // Các đoạn mã khác đã có (ví dụ, lấy thông tin user từ API) vẫn ở đây
  });
document.getElementById("adoptButton").addEventListener("click", async function () {
    // 1. Lấy thông tin người nhận nuôi
    const adopterName = document.getElementById("name").innerText;
    const phone = document.getElementById("phone-Number").innerText;
    const address = document.getElementById("address").innerText;
    const email = document.getElementById("email").innerText.trim(); // Loại bỏ khoảng trắng

    if (!email) {
        alert("Không tìm thấy email!");
        return;
    }

    // 2. Lấy thông tin thú cưng (ở HTML)
    const petName = document.getElementById("petName").innerText || "Chưa có tên";
    // Hoặc bạn có thể tách giới tính, độ tuổi, v.v. nếu muốn
    const status1 = document.getElementById("petStatus1").innerText || "Chưa có ";
    const status2 = document.getElementById("petStatus2").innerText || "Chưa có ";
    
    // 3. Gửi yêu cầu lên server để lưu vào DB (adoptions)
    const adoptionData = {
        petName: petName,
        status1: status1 , 
        status2: status2,
        adoption:"Đã được nhận nuôi", // Hoặc "Đã nhận nuôi" tùy bạn
        imageUrl: localStorage.getItem("petImage"),
        adopter: {
            name: adopterName,
            phone: phone,
            address: address,
            email: email
        }
    };

    try {
        const adoptResponse = await fetch("http://127.0.0.1:3000/api/adopt", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adoptionData)
        });

        const adoptResult = await adoptResponse.json();
        if (!adoptResponse.ok) {
            alert("Lỗi khi tạo yêu cầu nhận nuôi: " + adoptResult.message);
            return;
        }

        // 4. Nếu lưu DB thành công, gọi tiếp API gửi email
        const mailResponse = await fetch("http://127.0.0.1:3000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: email, name: adopterName, phone, address })
        });

        const mailResult = await mailResponse.json();
        if (mailResponse.ok && mailResult.success) {
            alert("Email xác nhận đã được gửi và yêu cầu nhận nuôi đã được lưu!");
            window.location.href = "./MenuAfterLogin.html";
        } else {
            alert("Đã lưu yêu cầu nhận nuôi nhưng lỗi khi gửi email: " + mailResult.message);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể gửi yêu cầu nhận nuôi. Lỗi kết nối server!");
    }
});


function goToMenuPage() {
    window.location.href = "./MenuAfterLogin.html";
  }