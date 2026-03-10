from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
import os

app = FastAPI()

# Simple hardcoded dataset to train the SVM
training_data = [
    # Q1 Loop Logic
    ("15", "Excellent"),
    ("The output is 15 because 1+2+3+4+5=15", "Excellent"),
    ("I think it is 15", "Good"),
    ("10", "Poor"),
    
    # Q2 Nested Loops
    ("6", "Excellent"),
    ("The output is 6 because the outer loop runs 3 times and the inner loop runs 2 times", "Excellent"),
    ("6 stars", "Good"),
    ("5", "Poor"),
    
    # Q3 Recursion
    ("10", "Excellent"),
    ("10 because it evaluates 4+3+2+1+0", "Excellent"),
    ("It returns 10", "Good"),
    ("4", "Poor"),
        
    # Q4 Modulus Operator
    ("2", "Excellent"),
    ("2 because 17 divided by 5 leaves a remainder of 2", "Excellent"),
    ("The remainder is 2", "Good"),
    ("17", "Poor"),
    
    # Q5 Bitwise Operation
    ("1", "Excellent"),
    ("1 because 101 AND 011 is 001", "Excellent"),
    ("It equals 1", "Good"),
    ("2", "Poor"),
    
    # Q6 Post Increment Trick
    ("12", "Excellent"),
    ("12 because a++ evaluates to 5, then a is 6, then ++a is 7, 5+7 is 12", "Excellent"),
    ("Its 12", "Good"),
    ("10", "Poor"),
    
    # Q7 Pattern Count
    ("6", "Excellent"),
    ("6 stars total", "Excellent"),
    ("6 is the count", "Good"),
    ("3", "Poor"),
    
    # Q8 Array Sum
    ("20", "Excellent"),
    ("20 the sum of the array is 2+4+6+8", "Excellent"),
    ("It is 20", "Good"),
    ("24", "Poor"),
    
    # Q9 While Loop
    ("10", "Excellent"),
    ("10 because 1+2+3+4=10", "Excellent"),
    ("It results in 10", "Good"),
    ("4", "Poor"),
    
    # Q10 Tricky Operator
    ("3", "Excellent"),
    ("3 because division of integers truncates the decimal", "Excellent"),
    ("It's 3", "Good"),
    ("3.33", "Poor"),
    
    # Generic short answers
    ("No idea", "Poor"),
    ("Can I skip this?", "Poor"),
    ("I don't know the answer", "Poor"),
    ("This is a loop", "Poor")
]

X_train = [text for text, label in training_data]
y_train = [label for text, label in training_data]

# Train the SVM text classifier
svm_pipeline = make_pipeline(TfidfVectorizer(), SVC(kernel='linear', probability=True))
svm_pipeline.fit(X_train, y_train)

class EvaluationRequest(BaseModel):
    answers: List[str]

@app.post("/api/evaluate")
def evaluate(req: EvaluationRequest):
    evaluations = []
    for idx, ans in enumerate(req.answers):
        ans_text = ans.strip()
        if not ans_text or len(ans_text) < 5:
            evaluations.append({
                "score": "Poor", 
                "feedback": "Response was exceptionally short or empty. Please elaborate more next time."
            })
            continue
            
        prediction = svm_pipeline.predict([ans_text])[0]
        probabilities = svm_pipeline.predict_proba([ans_text])[0]
        classes = svm_pipeline.classes_
        
        # Calculate confidence from the highest probability
        confidence = float(max(probabilities)) * 100
        
        # Format the probabilities for the breakdown
        metrics = {str(cls): round(float(prob) * 100, 1) for cls, prob in zip(classes, probabilities)}
        
        feedback = ""
        if prediction == "Excellent":
            feedback = "Great depth and accurate use of technical terms."
        elif prediction == "Good":
            feedback = "Solid answer, hits the main points but lacks deep technical detail."
        elif prediction == "Average":
            feedback = "Basic understanding shown, but misses key technical concepts and depth."
        else:
            feedback = "The answer is incorrect, vague, or fundamentally lacking detail."
            
        evaluations.append({
            "score": prediction,
            "feedback": feedback,
            "confidence": round(confidence, 1),
            "metrics": metrics
        })
        
    return {"evaluations": evaluations}

# Serve static frontend files
frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
