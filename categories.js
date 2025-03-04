document.addEventListener('DOMContentLoaded', () => {
    const difficultyCheckboxes = document.querySelectorAll('input[name="difficulty"]');
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            
            // Collect selected difficulties
            const selectedDifficulties = Array.from(difficultyCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            
            // Redirect to the quiz page with category and difficulties
            window.location.href = `quiz.html?category=${category}&difficulties=${selectedDifficulties.join(',')}`;
        });
    });
});