const API_BASE_URL = 'http://localhost:8000';

console.log('API module loaded!');

export const api = {
    async getCategories() {
        console.log('Fetching categories...');
        try {
            const response = await fetch(`${API_BASE_URL}/categories/`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            console.log('Received categories:', data);
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getCategoryId(categoryName) {
        const categories = await this.getCategories();
        const category = categories.find(c => c.name === categoryName);
        if (!category) {
            throw new Error(`Category "${categoryName}" not found`);
        }
        return category.id;
    },

    async getQuestionsByCategory(categoryName) {
        console.log('Getting questions for category:', categoryName);
        try {
            const categoryId = await this.getCategoryId(categoryName);
            console.log('Found category ID:', categoryId);
            
            const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/questions/`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            console.log('Received questions:', data);
            return data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    },

    async createCategory(categoryData) {
        const response = await fetch(`${API_BASE_URL}/categories/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });
        if (!response.ok) {
            throw new Error('Failed to create category');
        }
        return await response.json();
    },

    async createQuestion(categoryId, questionData) {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/questions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        if (!response.ok) {
            throw new Error('Failed to create question');
        }
        return await response.json();
    }
}; 