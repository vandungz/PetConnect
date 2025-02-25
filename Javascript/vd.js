// DropBox.js
document.addEventListener('DOMContentLoaded', function() {
    // ThongBao.js content
    const notificationIcon = document.querySelector('.header-secon-content-list-nofi-icon');
    const notificationDropdown = document.getElementById('notificationDropdown');

    notificationIcon.addEventListener('click', function() {
        notificationDropdown.classList.toggle('show');
    });

    // Đóng dropdown khi click bên ngoài
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.header-secon-content-list-nofi-icon')) {
            if (notificationDropdown.classList.contains('show')) {
                notificationDropdown.classList.remove('show');
            }
        }
    });

    // MenuBeforeLogin.js content
    const userIcon = document.querySelector('.icon-user');
    const userDropdown = document.getElementById('userDropdown');

    userIcon.addEventListener('click', function() {
        userDropdown.classList.toggle('show');
    });

    // Đóng dropdown khi click bên ngoài
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.icon-user')) {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
            }
        }
    });
});