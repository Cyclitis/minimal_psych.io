import { api } from './api.js';

console.log('Quiz module loaded!');

class PsychiatryQuestionBank {
    constructor(categoryName, difficulties, timedMode) {
        // Store references to DOM elements
        this.elements = {
            container: document.getElementById('quiz-container'),
            question: document.getElementById('question'),
            options: document.getElementById('options'),
            feedback: document.getElementById('feedback'),
            explanation: document.getElementById('explanation'),
            score: document.getElementById('score'),
            nextBtn: document.getElementById('next-btn'),
            timer: document.getElementById('timer'),
            // Add progress bar elements
            progressCorrect: document.querySelector('.progress-correct'),
            progressIncorrect: document.querySelector('.progress-incorrect')
        };

        // Verify all required elements exist
        if (!this.elements.container || !this.elements.question || !this.elements.options) {
            throw new Error('Required quiz elements not found. Make sure all HTML elements exist with correct IDs.');
        }

        // Default settings
        this.categoryName = categoryName;
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
        this.questions = [];
        
        // Timer settings
        this.timerDuration = 20; // 20 seconds per question
        this.timeLeft = this.timerDuration;
        this.timerInterval = null;
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize the quiz
        this.initQuiz();
    }

    async initQuiz() {
        try {
            console.log('Initializing quiz for category:', this.categoryName);
            
            // Fetch questions from the API
            const questions = await api.getQuestionsByCategory(this.categoryName);
            console.log('Raw questions data:', JSON.stringify(questions, null, 2));
            
            if (!questions || questions.length === 0) {
                throw new Error('No questions received from the server');
            }

            // Transform the data structure if needed
            this.questions = this.filterQuestions(questions).map(question => ({
                question_text: question.question_text,
                explanation: question.explanation,
                difficulty: question.difficulty,
                options: question.options || []  // Ensure options exists
            }));
            
            console.log('Processed questions:', JSON.stringify(this.questions, null, 2));
            
            this.totalQuestions = this.questions.length;
            
            // Initialize UI
            if (this.timedMode) {
                this.startTimer();
            }
            
            // Load the first question
            this.loadQuestion();
        } catch (error) {
            console.error('Failed to initialize quiz:', error);
            if (this.elements.container) {
                this.elements.container.innerHTML = `
                    <div class="error">
                        Failed to load quiz questions. Error: ${error.message}<br>
                        Please try refreshing the page.
                    </div>`;
            }
        }
    }

    initUI() {
        // Initialize your UI elements here
        this.questionEl = document.querySelector('#question');
        this.optionsEl = document.querySelector('#options');
        this.feedbackEl = document.querySelector('#feedback');
        this.explanationEl = document.querySelector('#explanation');
        this.scoreEl = document.querySelector('#score');
        this.nextBtn = document.querySelector('#next-btn');
        this.timerEl = document.querySelector('#timer');

        if (!this.questionEl || !this.optionsEl) {
            throw new Error('Required UI elements not found!');
        }
    }

    filterQuestions(questions) {
        return questions
            .filter(q => this.difficultiesFilter[q.difficulty])
            .sort(() => Math.random() - 0.5);
    }

    initEventListeners() {
        // Add click handler for the next button
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => {
                this.currentQuestionIndex++;
                this.loadQuestion();
                this.elements.nextBtn.disabled = true; // Disable button until next answer
                
                // Clear previous feedback and explanation
                if (this.elements.feedback) {
                    this.elements.feedback.style.display = 'none';
                }
                if (this.elements.explanation) {
                    this.elements.explanation.style.display = 'none';
                }
            });
        }
    }

    startTimer() {
        // Clear any existing timer
        this.stopTimer();

        // Reset time
        this.timeLeft = this.timerDuration;
        
        if (this.elements.timer) {
            this.elements.timer.textContent = `Verbleibende Zeit: ${this.timeLeft}s`;
            this.elements.timer.style.display = 'block';
            this.elements.timer.classList.remove('warning');
        }

        // Start countdown
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            if (this.elements.timer) {
                this.elements.timer.textContent = `Verbleibende Zeit: ${this.timeLeft}s`;
                
                // Add warning class when time is running low (less than 5 seconds)
                if (this.timeLeft <= 5) {
                    this.elements.timer.classList.add('warning');
                }
            }

            if (this.timeLeft <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleTimeOut() {
        this.stopTimer();
        
        // Disable all options
        const options = this.elements.options.querySelectorAll('.option');
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        // Show feedback
        if (this.elements.feedback) {
            this.elements.feedback.textContent = 'Zeit abgelaufen!';
            this.elements.feedback.style.color = '#e74c3c';
            this.elements.feedback.style.display = 'block';
        }
        
        // Show correct answer
        const question = this.questions[this.currentQuestionIndex];
        options.forEach(opt => {
            const optionData = Array.from(question.options).find(o => o.text === opt.textContent);
            if (optionData && optionData.is_correct) {
                opt.classList.add('correct');
            }
        });
        
        // Update score
        this.incorrectQuestions++;
        this.updateProgressBar();
        
        // Enable next button
        if (this.elements.nextBtn) {
            this.elements.nextBtn.disabled = false;
        }
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.handleQuizComplete();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        
        // Update question text
        this.elements.question.textContent = question.question_text;
        
        // Clear previous options
        this.elements.options.innerHTML = '';
        
        // Add new options
        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, index) => {
                const optionEl = document.createElement('div');
                optionEl.className = 'option';
                optionEl.textContent = option.text;
                optionEl.style.pointerEvents = 'auto';
                optionEl.addEventListener('click', () => this.selectOption(optionEl, option));
                this.elements.options.appendChild(optionEl);
            });
        }

        // Clear previous feedback and explanation
        if (this.elements.feedback) {
            this.elements.feedback.style.display = 'none';
        }
        if (this.elements.explanation) {
            this.elements.explanation.style.display = 'none';
        }

        // Start timer if in timed mode
        if (this.timedMode) {
            this.startTimer();
        }

        // Update progress
        this.updateProgressBar();
    }

    skipQuestion() {
        // Store skipped question
        this.skippedQuestions.push(this.questions[this.currentQuestionIndex - 1]);
        
        // Move to next question
        this.loadQuestion();
    }

    selectOption(optionEl, option) {
        // Stop timer when option is selected
        this.stopTimer();

        // Prevent selecting option if already selected
        if (optionEl.classList.contains('selected') || 
            optionEl.classList.contains('correct') || 
            optionEl.classList.contains('incorrect')) {
            return;
        }

        // Disable all options immediately
        const options = this.elements.options.querySelectorAll('.option');
        options.forEach(opt => opt.style.pointerEvents = 'none');

        // Show selected state immediately
        optionEl.classList.add('selected');

        // Process the answer immediately
        const question = this.questions[this.currentQuestionIndex];
        
        // Find correct option and update UI
        options.forEach(opt => {
            const optionData = Array.from(question.options).find(o => o.text === opt.textContent);
            if (optionData && optionData.is_correct) {
                opt.classList.add('correct');
            }
        });

        if (option.is_correct) {
            this.correctQuestions++;
            this.score += this.timedMode ? this.timeLeft : 1;
            if (this.elements.feedback) {
                this.elements.feedback.textContent = 'Richtig!';
                this.elements.feedback.style.color = '#2ecc71';
                this.elements.feedback.style.display = 'block';
            }
        } else {
            this.incorrectQuestions++;
            optionEl.classList.add('incorrect');
            if (this.elements.feedback) {
                this.elements.feedback.textContent = 'Falsch!';
                this.elements.feedback.style.color = '#e74c3c';
                this.elements.feedback.style.display = 'block';
            }
        }

        // Show explanation
        if (this.elements.explanation) {
            this.elements.explanation.textContent = question.explanation;
            this.elements.explanation.style.display = 'block';
        }

        // Update score and progress
        if (this.elements.score) {
            this.elements.score.textContent = `Punktzahl: ${this.score}/${this.totalQuestions}`;
        }
        this.updateProgressBar();

        // Enable next button
        if (this.elements.nextBtn) {
            this.elements.nextBtn.disabled = false;
        }
    }

    updateProgressBar() {
        const totalAttempted = this.correctQuestions + this.incorrectQuestions;
        if (totalAttempted === 0) {
            // Reset progress bar
            if (this.elements.progressCorrect) {
                this.elements.progressCorrect.style.width = '0%';
            }
            if (this.elements.progressIncorrect) {
                this.elements.progressIncorrect.style.width = '0%';
            }
            return;
        }

        const correctPercentage = (this.correctQuestions / totalAttempted) * 100;
        const incorrectPercentage = (this.incorrectQuestions / totalAttempted) * 100;

        if (this.elements.progressCorrect) {
            this.elements.progressCorrect.style.width = `${correctPercentage}%`;
        }
        if (this.elements.progressIncorrect) {
            this.elements.progressIncorrect.style.width = `${incorrectPercentage}%`;
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    handleQuizComplete() {
        if (this.elements.container) {
            // Replace the entire container content
            document.body.innerHTML = `
                <div class="container">
                    <div class="quiz-complete">
                        <h2>Quiz abgeschlossen!</h2>
                        <p>Ihre Endpunktzahl: ${this.score}/${this.totalQuestions}</p>
                        <p>Richtig beantwortet: ${this.correctQuestions}</p>
                        <p>Falsch beantwortet: ${this.incorrectQuestions}</p>
                        <button onclick="window.location.href='index.html'">Zurück zur Übersicht</button>
                    </div>
                </div>
            `;
        }
    }
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing quiz...');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryName = urlParams.get('category') || 'affective-disorders';
        const difficulties = urlParams.get('difficulties') ? urlParams.get('difficulties').split(',') : ['easy', 'medium', 'hard'];
        const timedMode = urlParams.get('timed') === 'true';

        console.log('Quiz parameters:', { categoryName, difficulties, timedMode });
        new PsychiatryQuestionBank(categoryName, difficulties, timedMode);
    } catch (error) {
        console.error('Error initializing quiz:', error);
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    Failed to initialize quiz. Error: ${error.message}<br>
                    Please try refreshing the page.
                </div>`;
        }
    }
});