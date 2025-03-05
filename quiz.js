document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'affective-disorders';
    const difficulties = urlParams.get('difficulties') ? urlParams.get('difficulties').split(',') : ['easy', 'medium', 'hard'];
    const timedMode = urlParams.get('timed') === 'true';

    // Initialize the question bank with parameters
    new PsychiatryQuestionBank(category, difficulties, timedMode);
});

class PsychiatryQuestionBank {
    constructor(category, difficulties, timedMode) {
        // Default settings
        this.category = category;
        this.difficultiesFilter = {
            easy: difficulties.includes('easy'),
            medium: difficulties.includes('medium'),
            hard: difficulties.includes('hard')
        };
        this.timedMode = timedMode;
        
        // Quiz state tracking
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.correctQuestions = 0;
        this.incorrectQuestions = 0;
        this.skippedQuestions = [];

        // Timer variables
        this.timerDuration = 20;
        this.timerInterval = null;

        // DOM Elements
        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.feedbackEl = document.getElementById('feedback');
        this.explanationEl = document.getElementById('explanation');
        this.scoreEl = document.getElementById('score');
        this.nextBtn = document.getElementById('next-btn');
        this.timerEl = document.getElementById('timer');

        // Progress bar elements
        this.progressCorrectEl = document.querySelector('.progress-correct');
        this.progressIncorrectEl = document.querySelector('.progress-incorrect');

        // Get questions
        this.questions = QUESTIONS[this.category] || [];
        
        this.initEventListeners();
        this.filterQuestions();
        this.loadQuestion();
    }

    filterQuestions() {
        this.questions = QUESTIONS[this.category].filter(q => 
            this.difficultiesFilter[q.difficulty]
        );
        
        // Reset quiz state after filtering
        this.currentQuestionIndex = 0;
    }

    initEventListeners() {
        this.nextBtn.addEventListener('click', () => this.loadQuestion());
    }

    startTimer() {
        // Clear any existing timer
        this.stopTimer();

        // Set initial time
        let timeLeft = this.timerDuration;
        this.timerEl.textContent = `Verbleibende Zeit: ${timeLeft}s`;
        this.timerEl.style.display = 'block';

        // Start countdown
        this.timerInterval = setInterval(() => {
            timeLeft--;
            this.timerEl.textContent = `Verbleibende Zeit: ${timeLeft}s`;

            if (timeLeft <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerEl.style.display = 'none';
        }
    }

    handleTimeOut() {
        this.stopTimer();
        
        // Mark all options as disabled
        const optionElements = this.optionsEl.querySelectorAll('.option');
        optionElements.forEach(option => {
            option.style.pointerEvents = 'none';
            option.style.opacity = '0.7';
        });
        
        // Show feedback
        this.feedbackEl.textContent = 'Zeit abgelaufen! Bitte versuchen Sie es mit der nächsten Frage.';
        this.feedbackEl.style.color = '#e74c3c';
        this.feedbackEl.style.display = 'block';
        
        // Update score
        this.incorrectQuestions++;
        this.totalQuestions++;
        this.updateProgressBar();
        this.scoreEl.textContent = `Punktzahl: ${this.score}/${this.totalQuestions}`;
    }

    loadQuestion() {
        // Clear previous state
        this.feedbackEl.style.display = 'none';
        this.explanationEl.style.display = 'none';
        this.optionsEl.innerHTML = '';
        
        // If we've gone through all questions, show completion message
        if (this.currentQuestionIndex >= this.questions.length) {
            this.questionEl.textContent = 'Quiz abgeschlossen!';
            this.optionsEl.innerHTML = `<p>Sie haben ${this.score} von ${this.totalQuestions} Fragen richtig beantwortet.</p>`;
            this.nextBtn.style.display = 'none';
            return;
        }
        
        // Get current question
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        // Display question
        this.questionEl.textContent = currentQuestion.question;
        
        // Create and display options
        currentQuestion.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            optionEl.textContent = option.text;
            
            optionEl.addEventListener('click', () => this.selectOption(optionEl, option));
            
            this.optionsEl.appendChild(optionEl);
        });
        
        // Reset timer if in timed mode
        if (this.timedMode) {
            this.startTimer();
        }
        
        // Move to next question for next time
        this.currentQuestionIndex++;
    }

    skipQuestion() {
        // Store skipped question
        this.skippedQuestions.push(this.questions[this.currentQuestionIndex - 1]);
        
        // Move to next question
        this.loadQuestion();
    }

    selectOption(optionEl, option) {
        // Stop the timer
        this.stopTimer();
        
        // Prevent selecting multiple options
        const allOptions = this.optionsEl.querySelectorAll('.option');
        allOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
            if (opt !== optionEl) {
                opt.style.opacity = '0.7';
            }
        });
        
        // Mark selected option
        optionEl.classList.add('selected');
        
        // Check if correct
        if (option.correct) {
            optionEl.classList.add('correct');
            this.feedbackEl.textContent = 'Richtig!';
            this.feedbackEl.style.color = '#2ecc71';
            this.score++;
            this.correctQuestions++;
        } else {
            optionEl.classList.add('incorrect');
            this.feedbackEl.textContent = 'Falsch!';
            this.feedbackEl.style.color = '#e74c3c';
            this.incorrectQuestions++;
            
            // Highlight the correct answer
            allOptions.forEach(opt => {
                const optionData = this.questions[this.currentQuestionIndex - 1].options[
                    Array.from(allOptions).indexOf(opt)
                ];
                if (optionData && optionData.correct) {
                    opt.classList.add('correct');
                }
            });
        }
        
        // Show feedback and explanation
        this.feedbackEl.style.display = 'block';
        
        // Show explanation if available
        const currentQuestion = this.questions[this.currentQuestionIndex - 1];
        if (currentQuestion.explanation) {
            this.explanationEl.textContent = `Erklärung: ${currentQuestion.explanation}`;
            this.explanationEl.style.display = 'block';
        }
        
        // Update total questions and score display
        this.totalQuestions++;
        this.scoreEl.textContent = `Punktzahl: ${this.score}/${this.totalQuestions}`;
        
        // Update progress bar
        this.updateProgressBar();
    }

    updateProgressBar() {
        const totalAttempted = this.correctQuestions + this.incorrectQuestions;
        const correctPercentage = (this.correctQuestions / totalAttempted) * 100 || 0;
        const incorrectPercentage = (this.incorrectQuestions / totalAttempted) * 100 || 0;

        this.progressCorrectEl.style.width = `${correctPercentage}%`;
        this.progressIncorrectEl.style.width = `${incorrectPercentage}%`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}