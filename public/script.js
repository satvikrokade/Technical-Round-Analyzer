const questionData = [
    { q: "> What is the output of the following C++ code?\n\nint sum = 0;\nfor(int i = 1; i <= 5; i++)\n{\n    sum += i;\n}\ncout << sum;", t: "Loop Logic" },
    { q: "> What is the output of this nested loop sequence?\n\nint count = 0;\nfor(int i = 1; i <= 3; i++)\n{\n    for(int j = 1; j <= 2; j++)\n    {\n        count++;\n    }\n}\ncout << count;", t: "Nested Loops" },
    { q: "> What is the output of this recursive function call `fun(4)`?\n\nint fun(int n)\n{\n    if(n == 0)\n        return 0;\n    return n + fun(n-1);\n}\ncout << fun(4);", t: "Recursion" },
    { q: "> What is the output of this modulus operation?\n\nint x = 17;\nint y = 5;\ncout << x % y;", t: "Modulus" },
    { q: "> What is the output of this bitwise AND operation?\n\nint a = 5;\nint b = 3;\ncout << (a & b);", t: "Bitwise AND" },
    { q: "> What is the output of this increment trick sequence?\n\nint a = 5;\ncout << a++ + ++a;", t: "Post Increment" },
    { q: "> How many `*` stars are printed in this pattern?\n\nint i, j;\nfor(i=1;i<=3;i++)\n{\n    for(j=1;j<=i;j++)\n    {\n        cout<<\"*\";\n    }\n}", t: "Pattern Count" },
    { q: "> What is the output of this array sum calculation?\n\nint arr[] = {2,4,6,8};\nint sum = 0;\nfor(int i=0;i<4;i++)\n{\n    sum += arr[i];\n}\ncout << sum;", t: "Array Sum" },
    { q: "> What is the output of this while loop calculation?\n\nint i = 1;\nint sum = 0;\nwhile(i <= 4)\n{\n    sum += i;\n    i++;\n}\ncout << sum;", t: "While Loop" },
    { q: "> What is the output of this tricky division operation?\n\nint x = 10;\ncout << x/3;", t: "Tricky Operator" }
];

let answers = [];
let currentQuestionIndex = 0;
let typingInterval;
let radarChartInstance = null;
let doughnutChartInstance = null;
let svmChartInstance = null;

// UI Elements
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');

const startScreen = document.getElementById('startScreen');
const interviewScreen = document.getElementById('interviewScreen');
const loadingScreen = document.getElementById('loadingScreen');
const scorecardScreen = document.getElementById('scorecardScreen');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionBadge = document.getElementById('questionBadge');
const topicBadge = document.getElementById('topicBadge');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const resultsList = document.getElementById('resultsList');
const terminalLogs = document.getElementById('terminalLogs');

// Transition Helper
function switchScreen(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        from.classList.add('hide');
        to.classList.remove('hide');
        setTimeout(() => {
            to.classList.add('active');
        }, 50);
    }, 500);
}

// Update Progress Header
function updateProgress() {
    if (currentQuestionIndex === -1) {
        progressBar.style.width = '0%';
        statusText.innerText = 'System Ready • Awaiting Initializer';
    } else if (currentQuestionIndex >= questionData.length) {
        progressBar.style.width = '100%';
        progressBar.style.boxShadow = '0 0 15px var(--score-excellent)';
        statusText.innerText = 'Evaluation complete • Generating report';
    } else {
        const percent = ((currentQuestionIndex) / questionData.length) * 100;
        progressBar.style.width = `${percent}%`;
        statusText.innerText = `Interrogating node ${currentQuestionIndex + 1} of ${questionData.length}`;
    }
}

// Typing Animation
function typeText(element, text, speed = 20) {
    clearInterval(typingInterval);
    element.innerHTML = '';
    let i = 0;
    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, speed);
}

// Load Question
function loadQuestion() {
    const data = questionData[currentQuestionIndex];
    questionBadge.innerHTML = `<i class="fa-solid fa-terminal"></i> Q: ${currentQuestionIndex + 1}/${questionData.length}`;
    topicBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i> Topic: ${data.t}`;

    typeText(questionText, data.q, 30);

    answerInput.value = '';
    answerInput.style.transform = 'translateY(10px)';
    answerInput.style.opacity = '0';
    setTimeout(() => {
        answerInput.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        answerInput.style.transform = 'translateY(0)';
        answerInput.style.opacity = '1';
        answerInput.focus();
    }, 100);

    if (currentQuestionIndex === questionData.length - 1) {
        nextBtn.innerHTML = 'Initialize Final Assessment <i class="fa-solid fa-satellite-dish arrow"></i>';
    } else {
        nextBtn.innerHTML = 'Transmit Data <i class="fa-solid fa-satellite-dish arrow"></i>';
    }
}

// Submit Answer
function submitAnswer() {
    const text = answerInput.value.trim();
    answers.push(text);

    currentQuestionIndex++;
    updateProgress();

    if (currentQuestionIndex < questionData.length) {
        loadQuestion();
    } else {
        finishInterview();
    }
}

// Simulate Terminal logs
function runTerminalLogs() {
    const logs = [
        "> Tokenizing linguistic patterns...",
        "> Analyzing vector space semantics...",
        "> Comparing against knowledge base...",
        "> Computing hyperplane distances...",
        "> Aggregating confidence scores...",
        "> Rendering diagnostic UI..."
    ];
    terminalLogs.innerHTML = '';
    logs.forEach((log, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.innerText = log;
            terminalLogs.appendChild(p);
        }, index * 800);
    });
}

// Mapping Score to Numeric
function getNumericScore(score) {
    switch (score) {
        case 'Excellent': return 100;
        case 'Good': return 75;
        case 'Average': return 50;
        case 'Poor': return 25;
        default: return 0;
    }
}

// Render Default Chart
function renderRadarChart(evaluations) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    const labels = questionData.map(d => d.t);
    const dataPoints = evaluations.map(e => getNumericScore(e.score));

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aptitude Score',
                data: dataPoints,
                backgroundColor: 'rgba(88, 166, 255, 0.2)',
                borderColor: 'rgba(88, 166, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(88, 166, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(88, 166, 255, 1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: { family: 'Outfit', size: 12 }
                    },
                    ticks: {
                        display: false,
                        min: 0,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleFont: { family: 'Outfit' },
                    bodyFont: { family: 'Outfit' }
                }
            }
        }
    });
}

// Render Doughnut Chart
function renderDoughnutChart(evaluations) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');

    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }

    const counts = { 'Excellent': 0, 'Good': 0, 'Average': 0, 'Poor': 0 };
    evaluations.forEach(e => {
        if (e.score && counts[e.score] !== undefined) counts[e.score]++;
        else counts['Poor']++;
    });

    doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent', 'Good', 'Average', 'Poor'],
            datasets: [{
                data: [counts['Excellent'], counts['Good'], counts['Average'], counts['Poor']],
                backgroundColor: [
                    '#00ff88', // score-excellent
                    '#ffd900', // score-good
                    '#ff8800', // score-average
                    '#ff0044'  // score-poor
                ],
                borderColor: 'rgba(10, 10, 25, 0.8)',
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'Outfit', size: 12 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleFont: { family: 'Outfit', size: 14 },
                    bodyFont: { family: 'Outfit', size: 13 }
                }
            },
            cutout: '65%'
        }
    });
}

// Render SVM Scatter Chart (Simulated 2D feature space for HR Visualization)
function renderSVMChart(evaluations) {
    const ctx = document.getElementById('svmChart').getContext('2d');

    if (svmChartInstance) {
        svmChartInstance.destroy();
    }

    // Yellow circles for Class A (Positive/Good)
    const dataClassA = [
        { x: 1, y: 7 }, { x: 2, y: 8 }, { x: 2.5, y: 5.5 }, { x: 3, y: 9 }, { x: 3.5, y: 6.5 }, { x: 1.5, y: 4.5 }, { x: 4, y: 8 }
    ];

    // Green squares for Class B (Negative/Poor)
    const dataClassB = [
        { x: 6, y: 1 }, { x: 7, y: 3 }, { x: 8, y: 1.5 }, { x: 5, y: 2 }, { x: 9, y: 4 }, { x: 6.5, y: 0.5 }, { x: 7.5, y: 4 }
    ];

    // Map user answers dynamically based on their actual classification
    // Let's position "Good" things near Class A, and "Poor" things near Class B to visually show how the SVM groups them
    const userPoints = evaluations.map((e, idx) => {
        let x, y;
        if (e.score === 'Excellent' || e.score === 'Good') {
            x = 2 + Math.random() * 2;
            y = 6 + Math.random() * 3;
        } else {
            x = 6 + Math.random() * 3;
            y = 1 + Math.random() * 3;
        }
        return { x, y, label: `Q${idx + 1}: ${e.score}` };
    });

    svmChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Class A (Positive)',
                    data: dataClassA,
                    backgroundColor: '#ffd900', // Yellow to match image
                    pointStyle: 'circle',
                    pointRadius: 6,
                },
                {
                    label: 'Class B (Negative)',
                    data: dataClassB,
                    backgroundColor: '#00af50', // Green sq to match image
                    pointStyle: 'rect', // Draw as squares exactly like screenshot
                    pointRadius: 6,
                },
                {
                    label: 'User Responses',
                    data: userPoints,
                    backgroundColor: '#00e5ff',
                    borderColor: '#fff',
                    borderWidth: 2,
                    pointStyle: 'triangle',
                    pointRadius: 9, // Larger to stand out
                },
                {
                    type: 'line',
                    label: 'Hyperplane (Decision Boundary)',
                    data: [{ x: 0, y: 1 }, { x: 10, y: 10 }],
                    borderColor: 'rgba(255, 255, 255, 0.8)', // Solid white-ish line
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                },
                {
                    type: 'line',
                    label: 'Margin',
                    data: [{ x: 0, y: 3 }, { x: 8, y: 10.2 }],
                    borderColor: '#00e5ff',
                    borderWidth: 1.5,
                    borderDash: [5, 5], // Dashed line
                    fill: false,
                    pointRadius: 0
                },
                {
                    type: 'line',
                    label: '',
                    data: [{ x: 2, y: -0.8 }, { x: 10, y: 6.4 }],
                    borderColor: '#00e5ff',
                    borderWidth: 1.5,
                    borderDash: [5, 5], // Dashed line
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0,
                    max: 10,
                    title: { display: true, text: 'X (Feature Dimension 1)', color: '#8b949e', font: { family: 'Outfit' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8b949e' }
                },
                y: {
                    min: 0,
                    max: 10,
                    title: { display: true, text: 'Y (Feature Dimension 2)', color: '#8b949e', font: { family: 'Outfit' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8b949e' }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'Outfit', size: 12 }, usePointStyle: true, boxWidth: 8 }
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleFont: { family: 'Outfit', size: 14 },
                    bodyFont: { family: 'Outfit', size: 13 },
                    callbacks: {
                        label: function (context) {
                            if (context.raw.label) {
                                return context.raw.label; // Return User Label
                            }
                            return `Point: (${context.raw.x}, ${context.raw.y})`;
                        }
                    }
                }
            }
        }
    });
}

// End of Interview
async function finishInterview() {
    switchScreen(interviewScreen, loadingScreen);
    runTerminalLogs();

    try {
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Ensure delay for artificial feel of processing
        setTimeout(() => {
            renderScorecard(data.evaluations);
            renderRadarChart(data.evaluations);
            renderDoughnutChart(data.evaluations);
            renderSVMChart(data.evaluations);
            switchScreen(loadingScreen, scorecardScreen);
        }, 4000);

    } catch (error) {
        console.error('Error evaluating answers:', error);
        alert('CRITICAL ERROR: AI server offline or unreachable.');
        switchScreen(loadingScreen, startScreen);
        currentQuestionIndex = -1;
        answers = [];
        updateProgress();
    }
}

// Render Results
function renderScorecard(evaluations) {
    resultsList.innerHTML = '';

    evaluations.forEach((evaluationItem, i) => {
        const { score, feedback, confidence, metrics } = evaluationItem;
        const scoreClass = score ? score.toLowerCase() : 'poor';

        const card = document.createElement('div');
        card.className = 'result-card glass-panel';
        card.style.animationDelay = `${i * 0.15 + 0.5}s`;

        // Icon logic based on score
        let iconHtml = '';
        if (score === 'Excellent') iconHtml = '<i class="fa-solid fa-star"></i>';
        else if (score === 'Good') iconHtml = '<i class="fa-solid fa-check"></i>';
        else if (score === 'Average') iconHtml = '<i class="fa-solid fa-minus"></i>';
        else iconHtml = '<i class="fa-solid fa-xmark"></i>';

        let metricsHtml = '';
        if (metrics) {
            metricsHtml = `<div class="metrics-panel">
                <div class="metrics-title">
                    <span><i class="fa-solid fa-chart-bar"></i> SVM Classification Confidence Matrix</span>
                    <span class="confidence-badge">Overall Confidence: ${confidence}%</span>
                </div>
                <div class="metrics-grid">
                    ${Object.keys(metrics).map(k => `
                        <div class="metric-row">
                            <span class="metric-lbl">${k}</span>
                            <div class="metric-bar-bg">
                                <div class="metric-bar-fill ${k.toLowerCase()}" style="width: ${metrics[k]}%"></div>
                            </div>
                            <span class="metric-val">${metrics[k]}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        card.innerHTML = `
            <div class="result-header">
                <div class="result-topic">${questionData[i].t} Node</div>
                <div class="score-badge ${scoreClass}">${iconHtml} ${score}</div>
            </div>
            <div class="result-q">Q: ${questionData[i].q}</div>
            <div class="result-feedback">
                <strong><i class="fa-solid fa-robot"></i> System Output:</strong> ${feedback}
            </div>
            ${metricsHtml}
        `;

        resultsList.appendChild(card);
    });
}

// Events
startBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    answers = [];
    updateProgress();
    loadQuestion();
    switchScreen(startScreen, interviewScreen);
});

nextBtn.addEventListener('click', () => {
    submitAnswer();
});

// Handle Ctrl+Enter to submit
answerInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        submitAnswer();
    }
});

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = -1;
    answers = [];
    updateProgress();
    switchScreen(scorecardScreen, startScreen);
});

// Init
updateProgress();
