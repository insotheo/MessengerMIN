function toggleForms(e) {
    e.preventDefault();
    document.getElementById('login-container').classList.toggle('active');
    document.getElementById('register-container').classList.toggle('active');
}

//theme
const toggleButton = document.getElementById('theme-toggle');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    toggleButton.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
});