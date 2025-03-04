const QUESTIONS = {
    'affective-disorders': [
        {
            question: "A 35-year-old male presents with persistent depressed mood, anhedonia, and sleep disturbances for the past 6 months. What is the most likely diagnosis?",
            options: [
                { text: "Major Depressive Disorder", correct: true },
                { text: "Bipolar Disorder", correct: false },
                { text: "Adjustment Disorder", correct: false },
                { text: "Dysthymia", correct: false }
            ],
            explanation: "Major Depressive Disorder is characterized by persistent depressed mood and loss of interest lasting at least 2 weeks, with significant impact on daily functioning.",
            difficulty: "medium"
        },
        {
            question: "Which of the following is a key distinguishing feature of Bipolar I Disorder?",
            options: [
                { text: "Persistent low mood", correct: false },
                { text: "At least one manic episode", correct: true },
                { text: "Seasonal mood changes", correct: false },
                { text: "Exclusively depressive episodes", correct: false }
            ],
            explanation: "Bipolar I Disorder is defined by the occurrence of at least one manic episode, which may be preceded or followed by hypomanic or major depressive episodes.",
            difficulty: "hard"
        }
    ],
    'psychopharmacology': [
        {
            question: "Which medication is first-line treatment for Obsessive-Compulsive Disorder (OCD)?",
            options: [
                { text: "Risperidone", correct: false },
                { text: "Fluoxetine", correct: true },
                { text: "Alprazolam", correct: false },
                { text: "Lithium", correct: false }
            ],
            explanation: "Selective Serotonin Reuptake Inhibitors (SSRIs), particularly Fluoxetine, are considered first-line treatment for OCD.",
            difficulty: "easy"
        },
        {
            question: "Which antidepressant is most likely to cause weight gain?",
            options: [
                { text: "Fluoxetine", correct: false },
                { text: "Sertraline", correct: false },
                { text: "Paroxetine", correct: true },
                { text: "Escitalopram", correct: false }
            ],
            explanation: "Paroxetine is known to have the highest risk of weight gain among SSRIs due to its pharmacological properties.",
            difficulty: "medium"
        }
    ],
    'schizophrenia': [
        {
            question: "A patient with Schizophrenia is most likely to experience which type of hallucination?",
            options: [
                { text: "Olfactory hallucinations", correct: false },
                { text: "Tactile hallucinations", correct: false },
                { text: "Auditory hallucinations", correct: true },
                { text: "Gustatory hallucinations", correct: false }
            ],
            explanation: "Auditory hallucinations, particularly hearing voices, are the most common type of hallucinations in Schizophrenia.",
            difficulty: "medium"
        }
    ],
    'psychotherapy': [
        {
            question: "Which type of psychotherapy is most effective for Cognitive Behavioral Therapy (CBT)?",
            options: [
                { text: "Treating personality disorders", correct: false },
                { text: "Long-term psychodynamic work", correct: false },
                { text: "Treating anxiety and depression", correct: true },
                { text: "Family systems therapy", correct: false }
            ],
            explanation: "CBT is particularly effective for treating anxiety disorders and depression by focusing on changing negative thought patterns and behaviors.",
            difficulty: "easy"
        }
    ],
    'anxiety-disorders': [
        {
            question: "What is the first-line psychological treatment for Panic Disorder?",
            options: [
                { text: "Psychodynamic therapy", correct: false },
                { text: "Cognitive Behavioral Therapy", correct: true },
                { text: "Group therapy", correct: false },
                { text: "Art therapy", correct: false }
            ],
            explanation: "Cognitive Behavioral Therapy (CBT) is the most effective psychological intervention for Panic Disorder, helping patients identify and change anxiety-producing thought patterns.",
            difficulty: "medium"
        }
    ]
};