import { show_captcha } from "./CAPTCHA.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

async function handleLogin(event) {
    event.preventDefault();

    const passed = await show_captcha();
    if (!passed) {
        alert("Wrong CAPTCHA!");
        return;
    }

    const username = loginForm.querySelector('input[placeholder="Username"]').value;
    const password = loginForm.querySelector('input[placeholder="Password"]').value;

    try {
        const response = await fetch('/common_api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('jwt', data.token);
            alert("Login successful!");
            window.location.href = '/main';
        }
        else {
            const text = await response.text();
            alert("Login failed: " + text);
        }

    }
    catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
}

async function handleRegistration(event) {
    event.preventDefault();

    const passed = await show_captcha();
    if (!passed) {
        alert("Wrong CAPTCHA!");
        return;
    }

    const name = registerForm.querySelector('input[placeholder="What is your name?"]').value;
    const username = registerForm.querySelector('input[placeholder="Imagine a cool username"]').value;
    const password = registerForm.querySelector('input[placeholder="Password"]').value;

    try {
        const response = await fetch('/common_api/auth/register', {
            method: 'POST',
            body: new URLSearchParams({ name, username, password })
        });

        if (response.ok) {
            alert("Registration successful! You can now log in.");
            toggleForms();
        }
        else {
            const text = await response.text();
            alert("Registration failed: " + text);
        }

    }
    catch (err) {
        console.error(err);
        alert("Error connecting to server");
    }
}

loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegistration);