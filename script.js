const quizContainer = document.getElementById('quiz-container');
let hits = 0;
let misses = 0;
let answeredCount = 0;
const totalQuestions = 50;
let timeLeft = 10 * 60; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    const countdown = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.innerText = `Tempo: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeLeft <= 0) { clearInterval(countdown); finalizeQuiz(); } else { timeLeft--; }
    }, 1000);
}

function loadQuiz() {
    const questionsShuffled = shuffleArray([...questions]).slice(0, totalQuestions);
    const letras = ['A', 'B', 'C', 'D'];

    questionsShuffled.forEach((q, qIndex) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        const num = String(qIndex + 1).padStart(2, '0');
        let opts = q.options.map((text, index) => ({ text, originalIndex: index }));
        shuffleArray(opts);

        let optionsHtml = '';
        opts.forEach((opt, oIndex) => {
            optionsHtml += `
                <button class="option-btn" data-idx="${opt.originalIndex}" onclick="checkAnswer(${qIndex}, ${opt.originalIndex}, this, ${q.correct})">
                    <span class="error-label">ERRO ✘</span>
                    <div style="display:flex; align-items:center;">
                        <span class="option-letter">${letras[oIndex]})</span> 
                        <span>${opt.text}</span>
                    </div>
                </button>`;
        });

        card.innerHTML = `<button class="btn-speaker" onclick="lerQuestao('${q.question.replace(/'/g, "\\'")}')">🔊</button>
            <div class="question-text">Questão ${num}: ${q.question}</div>
            <div class="options-container" id="container-${qIndex}">${optionsHtml}</div>
            <div class="feedback-box" id="feedback-${qIndex}"><strong>Explicação:</strong> ${q.explanation}</div>`;
        quizContainer.appendChild(card);
    });
    startTimer();
}

function checkAnswer(qIndex, selectedIndex, element, correctIndex) {
    if (element.classList.contains('disabled')) return;
    const container = document.getElementById(`container-${qIndex}`);
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.add('disabled'));

    if (selectedIndex === correctIndex) {
        element.classList.add('correct-direct');
        hits++;
    } else {
        element.classList.add('wrong');
        buttons.forEach(btn => { if (parseInt(btn.getAttribute('data-idx')) === correctIndex) btn.classList.add('correct-revealed'); });
        document.getElementById(`feedback-${qIndex}`).classList.add('visible');
        misses++;
    }
    
    document.getElementById('hits').innerText = hits;
    document.getElementById('misses').innerText = misses;
    answeredCount++;

    if (answeredCount === totalQuestions) finalizeQuiz();
}

function finalizeQuiz() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const resultCard = document.getElementById('final-result-card');
    resultCard.classList.remove('hidden');
    
    const percent = Math.round((hits / totalQuestions) * 100);
    document.getElementById('final-percent').innerText = `${percent}%`;
    document.getElementById('final-hits').innerText = hits;
    document.getElementById('final-misses').innerText = misses;

    const msg = document.getElementById('encouragement-msg');
    if (percent >= 90) msg.innerText = "🏆 EXCELENTE! Você está no nível de aprovação para a UFRJ!";
    else if (percent >= 70) msg.innerText = "🚀 BOM TRABALHO! Continue revisando os erros para chegar nos 90%.";
    else msg.innerText = "📚 CONTINUE ESTUDANDO! A constância é o segredo do sucesso.";
}

function lerQuestao(texto) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(texto); u.lang = 'pt-BR'; window.speechSynthesis.speak(u); }

document.addEventListener('DOMContentLoaded', loadQuiz);
