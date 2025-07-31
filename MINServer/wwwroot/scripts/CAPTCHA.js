const CAPTCHA_templates = ["n o n", "n o (n o n)", "(n o n) o n"]; // o - operation; n - number

const CAPTCHA_numbers = [
    ["0", "0️⃣", "zero"],
    ["1", "1️⃣", "one"],
    ["2", "2️⃣", "two"],
    ["3", "3️⃣", "three"],
    ["4", "4️⃣", "four"],
    ["5", "5️⃣", "five"],
    ["6", "6️⃣", "six"],
    ["7", "7️⃣", "seven"],
    ["8", "8️⃣", "eight"],
    ["9", "9️⃣", "nine"]
];

const CAPTCHA_operations = [
    ["+", "plus"],
    ["-", "minus"],
    ["*", "times"]
];

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function show_captcha() {
    return new Promise((resolve) => {
        const modal = document.getElementById('captcha-modal');
        const card = modal.querySelector('.captcha-card');
        const problemDiv = document.getElementById('captcha-problem');
        const answerInput = document.getElementById('captcha-answer');
        const submitBtn = document.getElementById('captcha-submit');
        const cancelBtn = document.getElementById('captcha-cancel');

        let currentResult;

        function generateCaptcha() {
            const template = CAPTCHA_templates[get_random_int(0, CAPTCHA_templates.length - 1)];
            let problem = "";
            let evalString = "";

            for (let j = 0; j < template.length; j++) {
                const ch = template[j];

                if (ch === "n") {
                    const numIndex = get_random_int(0, CAPTCHA_numbers.length - 1);
                    const numForm = get_random_int(0, 2);
                    problem += CAPTCHA_numbers[numIndex][numForm];
                    evalString += CAPTCHA_numbers[numIndex][0];
                }
                
                else if (ch === "o") {
                    const opIndex = get_random_int(0, CAPTCHA_operations.length - 1);
                    const opForm = get_random_int(0, 1);
                    problem += CAPTCHA_operations[opIndex][opForm];
                    evalString += CAPTCHA_operations[opIndex][0];
                }
                
                else {
                    problem += ch;
                    evalString += ch;
                }
            }

            try {
                currentResult = eval(evalString);
                problemDiv.textContent = problem;
                answerInput.value = '';
            }
            catch (e) {
                console.error("CAPTCHA eval error:", e);
                resolve(false);
            }
        }

        function cleanup() {
            card.classList.add('fade-out');
            card.addEventListener('animationend', () => {
                modal.classList.add('hidden');
                card.classList.remove('fade-out');
            },
            { once: true });

            submitBtn.removeEventListener('click', onSubmit);
            cancelBtn.removeEventListener('click', onCancel);
            answerInput.removeEventListener('keydown', onKeyDown);
        }

        function onSubmit() {
            const answer = parseFloat(answerInput.value);
            if (answer === parseFloat(currentResult)) {
                cleanup();
                resolve(true);
            }
            else {
                card.classList.add('shake');
                card.addEventListener('animationend', () => {
                    card.classList.remove('shake');
                    generateCaptcha();
                },
                { once: true });
            }
        }

        function onCancel() {
            cleanup();
            resolve(false);
        }

        function onKeyDown(e) {
            if (e.key === 'Enter') onSubmit();
        }

        //init
        generateCaptcha();
        modal.classList.remove('hidden');
        answerInput.focus();

        submitBtn.addEventListener('click', onSubmit);
        cancelBtn.addEventListener('click', onCancel);
        answerInput.addEventListener('keydown', onKeyDown);
    });
}