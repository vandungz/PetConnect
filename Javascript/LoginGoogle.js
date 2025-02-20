/* tạo app (id + secretsecret)
code + app secret -> accessToken
lấy thông tin người dùng: avatar, name, mail
./auth/userinfo.email
./auth/userinfo.profile */
const CLIENT_ID = "370070666207-doivth203a5ioi01brklkmh936nvrcbs.apps.googleusercontent.com";
const LINK_GET_TOKEN = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.email%20https%3A//www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://127.0.0.1:5500/PetConnect/Html/index.html&client_id=${CLIENT_ID}`.replace(/\s+/g, '');
/* replace(/\s+/g, '') : xoá toàn bộ hàng và khoảng trắng thừa */

/* gọi đăng nhập khi người dùng click vào button */
document.addEventListener("DOMContentLoaded", () =>{
    const sign_btn = document.querySelector(".btn-loginGoogle");
    sign_btn.addEventListener("click", () =>{
        window.location.href = LINK_GET_TOKEN;
    });
});

const getToken = () =>{
        const url = new URLSearchParams(window.location.hash.substring(1)) /* lấy token sau dấu # */
        const token = url.get("access_token");
        return token;
    };

/* lấy thông tin người dùng */
const getInfoUser = async() =>{
    const accessToken = getToken();
    if(!accessToken) return;
    try{
    const respone = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const data = await respone.json();
    renderUI(data);
} catch(error){
    console.error("Lỗi khi gọi API userinfo:", error);
}
};
getInfoUser();

/* hiển thị thông tin người dùng */
const renderUI = (data) =>{
    const avatar = document.getElementById("avatar");
    const name = document.getElementById("name");
    const mail = document.getElementById("mail");
    avatar.src = data.picture;
    name.innerText = data.name;
    mail.innerText = data.email;
    
};
