import { show_captcha } from "./CAPTCHA.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

async function handleLogin(event){
    event.preventDefault();

    const passed = await show_captcha();
    alert(passed ? "CAPTCHA passed!" : "Wrong CAPTCHA!"); //DBG
}

async function handleRegistration(event){
    event.preventDefault();

    const passed = await show_captcha();
    alert(passed ? "CAPTCHA passed!" : "Wrong CAPTCHA!"); //DBG
}

loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegistration);