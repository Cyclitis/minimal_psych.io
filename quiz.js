document.addEventListener('DOMContentLoaded', () => {
    // Only initialize the question bank if we're on the quiz page
    if (window.location.pathname.includes('quiz.html')) {
        new PsychiatryQuestionBank();
    }
});

class PsychiatryQuestionBank {
    constructor() {
        // Get category, difficulties, and timed mode from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.category = urlParams.get('category') || 'affective-disorders';
        const selectedDifficulties = urlParams.get('difficulties')?.split(',') || ['easy', 'medium', 'hard'];
        this.timedMode = urlParams.get('timed') === 'true';
        
        // Set category title
        const categoryTitleMap = {
            'affective-disorders': 'Affective Disorders',
            'psychopharmacology': 'Psychopharmacology',
            'psychotherapy': 'Psychotherapy',
            'schizophrenia': 'Schizophrenia & Psychotic Disorders',
            'anxiety-disorders': 'Anxiety Disorders'
        };
        document.getElementById('category-title').textContent = categoryTitleMap[this.category];

        // Set initial difficulty filters based on URL
        this.difficultiesFilter = {
            easy: selectedDifficulties.includes('easy'),
            medium: selectedDifficulties.includes('medium'),
            hard: selectedDifficulties.includes('hard')
        };

        // Get questions for this category
        this.questions = QUESTIONS[this.category] || [];
        
        // Quiz state tracking
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.correctQuestions = 0;
        this.incorrectQuestions = 0;

        // New properties for difficulty and skipping
        this.skippedQuestions = [];

        // Timer variables
        this.timerDuration = 20; // 20 seconds per question
        this.timerInterval = null;

        // DOM Elements
        this.questionEl = document.getElementById('question');
        this.optionsEl = document.getElementById('options');
        this.feedbackEl = document.getElementById('feedback');
        this.explanationEl = document.getElementById('explanation');
        this.scoreEl = document.getElementById('score');
        this.nextBtn = document.getElementById('next-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.timerEl = document.getElementById('timer');

        // Progress bar elements
        this.progressCorrectEl = document.querySelector('.progress-correct');
        this.progressIncorrectEl = document.querySelector('.progress-incorrect');

        this.initEventListeners();
        this.filterQuestions();
        this.loadQuestion();
        
        // Initialize timer based on URL parameter
        if (this.timedMode) {
            this.startTimer();
        }
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
        this.resetBtn.addEventListener('click', () => this.resetQuiz());
    }

    startTimer() {
        // Clear any existing timer
        this.stopTimer();

        // Set initial time
        let timeLeft = this.timerDuration;
        this.timerEl.textContent = `Time left: ${timeLeft}s`;
        this.timerEl.style.display = 'block';

        // Start countdown
        this.timerInterval = setInterval(() => {
            timeLeft--;
            this.timerEl.textContent = `Time left: ${timeLeft}s`;

            // Time ran out
            if (timeLeft <= 0) {
                this.stopTimer();
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
        // Simulate an incorrect answer when time runs out
        this.feedbackEl.textContent = 'Time\'s up!';
        this.feedbackEl.style.backgroundColor = '#f2dede';
        this.incorrectQuestions++;
        this.updateProgressBar();
        this.loadQuestion();
    }

    loadQuestion() {
        // Stop previous timer if exists
        this.stopTimer();

        // Start new timer if timed mode is on
        if (this.timedMode) {
            this.startTimer();
        }

        // Clear previous question state
        this.optionsEl.innerHTML = '';
        this.feedbackEl.innerHTML = '';
        this.explanationEl.innerHTML = '';

        // Remove any existing difficulty badge or skip button
        const existingDifficultyBadge = this.questionEl.querySelector('.difficulty-badge');
        if (existingDifficultyBadge) {
            existingDifficultyBadge.remove();
        }
        const existingSkipBtn = document.querySelector('.skip-btn');
        if (existingSkipBtn) {
            existingSkipBtn.remove();
        }

        // If we've gone through all questions, restart
        if (this.currentQuestionIndex >= this.questions.length) {
            this.currentQuestionIndex = 0;
        }

        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.questionEl.textContent = currentQuestion.question;

        // Add difficulty badge to question
        const difficultyBadge = document.createElement('span');
        difficultyBadge.className = `difficulty-badge ${currentQuestion.difficulty}`;
        difficultyBadge.textContent = currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1);
        this.questionEl.appendChild(difficultyBadge);

        // Shuffle options
        const shuffledOptions = this.shuffleArray(currentQuestion.options);

        // Create option buttons
        shuffledOptions.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            optionEl.textContent = option.text;
            optionEl.addEventListener('click', () => this.selectOption(optionEl, option));
            this.optionsEl.appendChild(optionEl);
        });

        // Add skip button
        const skipBtn = document.createElement('button');
        skipBtn.textContent = 'Skip Question';
        skipBtn.className = 'btn btn-secondary skip-btn';
        skipBtn.addEventListener('click', () => this.skipQuestion());
        
        // Insert skip button
        const controlsContainer = document.querySelector('.controls');
        controlsContainer.insertBefore(skipBtn, controlsContainer.firstChild);

        this.currentQuestionIndex++;
        this.totalQuestions++;
    }

    skipQuestion() {
        // Store skipped question
        this.skippedQuestions.push(this.questions[this.currentQuestionIndex - 1]);
        
        // Move to next question
        this.loadQuestion();
    }

    selectOption(optionEl, option) {
        // Stop timer if in timed mode
        this.stopTimer();

        // Prevent multiple selections
        if (this.optionsEl.querySelector('.correct, .incorrect')) return;

        // Highlight selected option
        optionEl.classList.add('selected');

        // Check if correct
        if (option.correct) {
            this.score++;
            this.correctQuestions++;
            this.feedbackEl.textContent = 'Correct!';
            this.feedbackEl.style.backgroundColor = '#dff0d8';
            optionEl.classList.add('correct');
        } else {
            this.incorrectQuestions++;
            this.feedbackEl.textContent = 'Incorrect.';
            this.feedbackEl.style.backgroundColor = '#f2dede';
            optionEl.classList.add('incorrect');

            // Highlight the correct answer
            const correctOption = Array.from(this.optionsEl.children)
                .find(el => this.questions[this.currentQuestionIndex - 1].options
                    .find(opt => opt.correct && opt.text === el.textContent));
            if (correctOption) correctOption.classList.add('correct');
        }

        // Show explanation
        this.explanationEl.textContent = this.questions[this.currentQuestionIndex - 1].explanation;

        // Update score and progress bar
        this.scoreEl.textContent = `Score: ${this.score}/${this.totalQuestions}`;
        this.updateProgressBar();
    }

    updateProgressBar() {
        const totalAttempted = this.correctQuestions + this.incorrectQuestions;
        const correctPercentage = (this.correctQuestions / totalAttempted) * 100 || 0;
        const incorrectPercentage = (this.incorrectQuestions / totalAttempted) * 100 || 0;

        this.progressCorrectEl.style.width = `${correctPercentage}%`;
        this.progressIncorrectEl.style.width = `${incorrectPercentage}%`;
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.correctQuestions = 0;
        this.incorrectQuestions = 0;
        this.skippedQuestions = [];
        this.scoreEl.textContent = 'Score: 0/0';
        this.stopTimer();
        this.updateProgressBar();
        this.loadQuestion();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}