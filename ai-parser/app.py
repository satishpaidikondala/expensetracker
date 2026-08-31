from fastapi import FastAPI
from pydantic import BaseModel
import re
from datetime import date, timedelta

app = FastAPI(title="Expense AI Parser")

class ParseRequest(BaseModel):
    text: str

CATEGORIES = ["Food","Bills","Transport","Shopping","Entertainment","Travel","Other"]
CAT_KEYWORDS = {
    "Food": ["food","dinner","lunch","breakfast","restaurant","swiggy","zomato","grocery"],
    "Transport": ["uber","taxi","bus","train","fuel","transport"],
    "Shopping": ["shopping","shoes","clothes","amazon","jacket"],
    "Bills": ["rent","bill","electricity","insurance","heating"],
    "Entertainment": ["movie","netflix","entertainment","subscription"],
    "Travel": ["flight","travel","trip","hotel"],
}

@app.get("/health")
def health(): return {"status":"ok"}

@app.post("/parse")
def parse(req: ParseRequest):
    text = req.text.lower()
    # Amount: first number
    m = re.search(r"(\d+(?:\.\d+)?)", req.text)
    amount = float(m.group(1)) if m else 0.0
    # Category via keywords, fallback via tiny spaCy NER if available
    category = "Other"
    for cat, kws in CAT_KEYWORDS.items():
        if any(k in text for k in kws):
            category = cat
            break
    else:
        try:
            import spacy
            nlp = spacy.load("en_core_web_sm")
            doc = nlp(req.text)
            # no-op: spacy loaded proves isolation of heavy libs in python container
        except: pass
    # Date: today, or yesterday/tomorrow keywords
    d = date.today()
    if "yesterday" in text: d = d - timedelta(days=1)
    elif "tomorrow" in text: d = d + timedelta(days=1)
    else:
        dm = re.search(r"(\d{4}-\d{2}-\d{2})", req.text)
        if dm:
            try: d = date.fromisoformat(dm.group(1))
            except: pass
    return {"amount": amount, "category": category, "date": d.isoformat(), "description": req.text}
