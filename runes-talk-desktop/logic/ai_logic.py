import tensorflow as tf
import pickle
import unicodedata
from nltk.corpus import stopwords
#import nltk
import numpy as np

#nltk.download("stopwords")

#spanish_stopwords = set(stopwords.words("spanish"))
#english_stopwords = set(stopwords.words("english"))
#combined_stopwords = spanish_stopwords.union(english_stopwords)

def normalize_text(text):
    text = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("utf-8")
    words = text.lower().strip().split()
    #filtered_words = [word for word in words if word not in combined_stopwords]
    return " ".join(words)

model = None
vectorizer = None
index_to_response = None

def load_model_and_resources():
    global model, vectorizer, index_to_response
    model = tf.keras.models.load_model("models/model.h5")
    with open("models/vectorizer.pkl", "rb") as f:
        data = pickle.load(f)
        vectorizer = data["vectorizer"]
        index_to_response = data["index_to_response"]

def predict_response(text):
    if model is None or vectorizer is None or index_to_response is None:
        load_model_and_resources()

    normalized_text = normalize_text(text)
    encoded_text = vectorizer.transform([normalized_text]).toarray()
    predictions = model.predict(encoded_text)
    response_index = np.argmax(predictions)
    return index_to_response[response_index]

class AILogic:
    @staticmethod
    def get_ai_response(message):
        return predict_response(message)
