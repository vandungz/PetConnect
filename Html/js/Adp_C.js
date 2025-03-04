async function fetchUserData() {
    try {
        let response = await fetch("http://localhost:5000/users"); // Gọi API lấy dữ liệu
        let users = await response.json();

        if (users.length > 0) {  // Chỉ lấy 1 user đầu tiên
            let user = users[0];
            document.getElementById("name").textContent = user.name;
            document.getElementById("phone-Number").textContent = user.phonenumber;
            document.getElementById("address").textContent = user.address;
            document.getElementById("email").textContent = user.email;
            document.getElementById("avatar").src = user.avatar; 
        } else {
            console.log("Không có dữ liệu user!");
        }
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

fetchUserData();
document.getElementById("adoptButton").addEventListener("click", async function () {
    const userEmail = document.getElementById("email").textContent;
    const userName = document.getElementById("name").textContent;
    const petName = "Milo"; // Thay bằng tên thú cưng thực tế

    if (!userEmail) {
        alert("Không tìm thấy email của bạn!");
        return;
    }

    const response = await fetch("http://localhost:5000/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userName, petName })
    });

    const result = await response.json();
    alert(result.message);
});
function goToMenuPage() {
    window.location.href = "./Menu.html";
  }