const QUESTIONS = {
    'affective-disorders': [
        {
            question: "Ein 35-jähriger Mann zeigt seit 6 Monaten anhaltende depressive Stimmung, Anhedonie und Schlafstörungen. Was ist die wahrscheinlichste Diagnose?",
            options: [
                { text: "Major Depression", correct: true },
                { text: "Bipolare Störung", correct: false },
                { text: "Anpassungsstörung", correct: false },
                { text: "Dysthymie", correct: false }
            ],
            explanation: "Major Depression ist gekennzeichnet durch anhaltende depressive Stimmung und Interessenverlust für mindestens 2 Wochen, mit erheblichen Auswirkungen auf die tägliche Funktionsfähigkeit.",
            difficulty: "medium"
        },
        {
            question: "Welches ist ein entscheidendes Unterscheidungsmerkmal der Bipolaren Störung I?",
            options: [
                { text: "Anhaltende depressive Stimmung", correct: false },
                { text: "Mindestens eine manische Episode", correct: true },
                { text: "Saisonale Stimmungsschwankungen", correct: false },
                { text: "Ausschließlich depressive Episoden", correct: false }
            ],
            explanation: "Die Bipolare Störung I ist durch das Auftreten von mindestens einer manischen Episode definiert, der hypomane oder depressive Episoden vorausgehen oder folgen können.",
            difficulty: "hard"
        },
        {
            question: "Welcher Neurotransmitter wird am häufigsten mit Depression in Verbindung gebracht?",
            options: [
                { text: "Dopamin", correct: false },
                { text: "Serotonin", correct: true },
                { text: "Glutamat", correct: false },
                { text: "GABA", correct: false }
            ],
            explanation: "Serotonin ist ein wichtiger Neurotransmitter, der an der Stimmungsregulation beteiligt ist und häufig das Ziel von Antidepressiva ist.",
            difficulty: "easy"
        }
    ],
    'psychopharmacology': [
        {
            question: "Welches Medikament ist die erste Wahl bei der Behandlung von Zwangsstörungen (OCD)?",
            options: [
                { text: "Risperidon", correct: false },
                { text: "Fluoxetin", correct: true },
                { text: "Alprazolam", correct: false },
                { text: "Lithium", correct: false }
            ],
            explanation: "Selektive Serotonin-Wiederaufnahmehemmer (SSRI), insbesondere Fluoxetin, gelten als Erstlinienbehandlung für Zwangsstörungen.",
            difficulty: "easy"
        },
        {
            question: "Welches Antidepressivum verursacht am wahrscheinlichsten eine Gewichtszunahme?",
            options: [
                { text: "Mirtazapin", correct: true },
                { text: "Bupropion", correct: false },
                { text: "Fluoxetin", correct: false },
                { text: "Venlafaxin", correct: false }
            ],
            explanation: "Mirtazapin ist bekannt für seine Nebenwirkung der Gewichtszunahme aufgrund seiner antihistaminergen Wirkung und der Stimulation des Appetits.",
            difficulty: "medium"
        },
        {
            question: "Welche Nebenwirkung ist am stärksten mit Clozapin assoziiert?",
            options: [
                { text: "Akathisie", correct: false },
                { text: "Prolaktinerhöhung", correct: false },
                { text: "Agranulozytose", correct: true },
                { text: "Tardive Dyskinesie", correct: false }
            ],
            explanation: "Clozapin kann Agranulozytose verursachen, eine potenziell lebensbedrohliche Verringerung der weißen Blutkörperchen, die eine regelmäßige Überwachung des Blutbildes erfordert.",
            difficulty: "hard"
        }
    ],
    'psychotherapy': [
        {
            question: "Welche Therapieform konzentriert sich auf die Identifizierung und Veränderung dysfunktionaler Gedankenmuster?",
            options: [
                { text: "Psychoanalyse", correct: false },
                { text: "Kognitive Verhaltenstherapie (KVT)", correct: true },
                { text: "Gestalttherapie", correct: false },
                { text: "Interpersonelle Therapie", correct: false }
            ],
            explanation: "Die Kognitive Verhaltenstherapie (KVT) zielt darauf ab, negative oder verzerrte Denkmuster zu identifizieren und zu verändern, um emotionale Belastungen zu reduzieren und adaptiveres Verhalten zu fördern.",
            difficulty: "easy"
        },
        {
            question: "Welche Technik wird in der Dialektisch-Behavioralen Therapie (DBT) verwendet, um Patienten zu helfen, belastende Situationen zu bewältigen?",
            options: [
                { text: "Freie Assoziation", correct: false },
                { text: "Systematische Desensibilisierung", correct: false },
                { text: "Achtsamkeitsübungen", correct: true },
                { text: "Psychodrama", correct: false }
            ],
            explanation: "Achtsamkeitsübungen sind eine Kernkomponente der DBT, die Patienten hilft, im gegenwärtigen Moment zu bleiben und ihre Emotionen ohne Urteil zu beobachten.",
            difficulty: "medium"
        },
        {
            question: "Welcher therapeutische Ansatz wurde von Carl Rogers entwickelt?",
            options: [
                { text: "Klientenzentrierte Therapie", correct: true },
                { text: "Rational-Emotive Verhaltenstherapie", correct: false },
                { text: "Systemische Therapie", correct: false },
                { text: "Existenzielle Therapie", correct: false }
            ],
            explanation: "Carl Rogers entwickelte die klientenzentrierte Therapie, die auf den Prinzipien der bedingungslosen positiven Wertschätzung, Empathie und Kongruenz basiert.",
            difficulty: "hard"
        }
    ],
    'schizophrenia': [
        {
            question: "Welches sind Positivsymptome der Schizophrenie?",
            options: [
                { text: "Affektverflachung und Alogie", correct: false },
                { text: "Halluzinationen und Wahnvorstellungen", correct: true },
                { text: "Anhedonie und Apathie", correct: false },
                { text: "Aufmerksamkeitsdefizite und Gedächtnisprobleme", correct: false }
            ],
            explanation: "Positivsymptome der Schizophrenie sind Verhaltensweisen oder Erfahrungen, die bei gesunden Menschen nicht vorhanden sind, wie Halluzinationen und Wahnvorstellungen.",
            difficulty: "easy"
        },
        {
            question: "Welcher Neurotransmitter wird am häufigsten mit der Pathophysiologie der Schizophrenie in Verbindung gebracht?",
            options: [
                { text: "Serotonin", correct: false },
                { text: "GABA", correct: false },
                { text: "Dopamin", correct: true },
                { text: "Noradrenalin", correct: false }
            ],
            explanation: "Die Dopaminhypothese der Schizophrenie besagt, dass die Symptome mit einer Überaktivität der dopaminergen Transmission verbunden sind, insbesondere im mesolimbischen Pfad.",
            difficulty: "medium"
        },
        {
            question: "Welches Antipsychotikum hat das geringste Risiko für extrapyramidale Nebenwirkungen?",
            options: [
                { text: "Haloperidol", correct: false },
                { text: "Clozapin", correct: true },
                { text: "Fluphenazin", correct: false },
                { text: "Chlorpromazin", correct: false }
            ],
            explanation: "Clozapin, ein atypisches Antipsychotikum, hat das geringste Risiko für extrapyramidale Nebenwirkungen aufgrund seines einzigartigen Rezeptorbindungsprofils.",
            difficulty: "hard"
        }
    ],
    'anxiety-disorders': [
        {
            question: "Welche Angststörung ist durch wiederkehrende, unerwünschte Gedanken und repetitive Verhaltensweisen gekennzeichnet?",
            options: [
                { text: "Generalisierte Angststörung", correct: false },
                { text: "Panikstörung", correct: false },
                { text: "Zwangsstörung", correct: true },
                { text: "Soziale Angststörung", correct: false }
            ],
            explanation: "Die Zwangsstörung ist durch wiederkehrende, unerwünschte Gedanken (Zwangsgedanken) und repetitive Verhaltensweisen (Zwangshandlungen) gekennzeichnet, die zur Angstreduktion durchgeführt werden.",
            difficulty: "easy"
        },
        {
            question: "Welche Behandlung gilt als erste Wahl bei Panikstörung?",
            options: [
                { text: "Benzodiazepine", correct: false },
                { text: "Kognitive Verhaltenstherapie", correct: true },
                { text: "Beta-Blocker", correct: false },
                { text: "Antikonvulsiva", correct: false }
            ],
            explanation: "Kognitive Verhaltenstherapie, insbesondere Expositionstherapie und kognitive Umstrukturierung, gilt als Erstlinienbehandlung für Panikstörung.",
            difficulty: "medium"
        },
        {
            question: "Welches Merkmal unterscheidet die Posttraumatische Belastungsstörung (PTBS) von anderen Angststörungen?",
            options: [
                { text: "Vermeidungsverhalten", correct: false },
                { text: "Exposition gegenüber einem traumatischen Ereignis", correct: true },
                { text: "Schlafstörungen", correct: false },
                { text: "Übermäßige Sorgen", correct: false }
            ],
            explanation: "Das Hauptunterscheidungsmerkmal der PTBS ist die Exposition gegenüber einem traumatischen Ereignis, das tatsächlichen oder drohenden Tod, schwere Verletzung oder sexuelle Gewalt beinhaltet.",
            difficulty: "hard"
        }
    ]
};
