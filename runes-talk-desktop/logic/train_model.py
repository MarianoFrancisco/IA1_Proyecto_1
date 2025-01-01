import tensorflow as tf
import json
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import unicodedata
from nltk.corpus import stopwords
import nltk
import pickle

nltk.download('stopwords')

spanish_stopwords = set(stopwords.words("spanish"))
english_stopwords = set(stopwords.words("english"))
combined_stopwords = spanish_stopwords.union(english_stopwords)

def normalize_text(text):
    text = unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode("utf-8")
    words = text.lower().strip().split()
    filtered_words = [word for word in words if word not in combined_stopwords]
    return " ".join(filtered_words)

def load_data(filepath):
    with open(filepath, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

def preprocess_data(data):
    pairs = []
    for key, content in data.items():
        for variation in content["variations"]:
            normalized_variation = normalize_text(variation)
            pairs.append({"input": normalized_variation, "output": content["response"]})
    return pairs

def train_model(dataset_path, model_save_path, vectorizer_save_path):
    data = load_data(dataset_path)
    pairs = preprocess_data(data)

    input_texts = [pair["input"] for pair in pairs]
    output_texts = [pair["output"] for pair in pairs]

    vectorizer = TfidfVectorizer(max_features=5000)
    inputs = vectorizer.fit_transform(input_texts).toarray()

    unique_responses = list(set(output_texts))
    response_to_index = {response: idx for idx, response in enumerate(unique_responses)}
    index_to_response = {idx: response for response, idx in response_to_index.items()}
    outputs = np.array([response_to_index[output] for output in output_texts])

    ohe = OneHotEncoder(sparse_output=False)
    outputs_one_hot = ohe.fit_transform(outputs.reshape(-1, 1))

    x_train, x_val, y_train, y_val = train_test_split(inputs, outputs_one_hot, test_size=0.2, random_state=42)

    def create_model(input_size, output_size):
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(240, activation="relu", input_shape=(input_size,)),
            tf.keras.layers.Dense(120, activation="relu"),
            tf.keras.layers.Dense(output_size, activation="softmax")
        ])
        model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
        return model

    model = create_model(x_train.shape[1], len(unique_responses))

    model.fit(x_train, y_train, epochs=400, batch_size=128, validation_data=(x_val, y_val))

    model.save(model_save_path)
    with open(vectorizer_save_path, "wb") as f:
        pickle.dump({"vectorizer": vectorizer, "index_to_response": index_to_response}, f)

    print("Modelo entrenado y guardado correctamente.")

if __name__ == "__main__":
    dataset_path = "dataset/python_javascript.json"
    model_save_path = "models/python_javascript/model.h5"
    vectorizer_save_path = "models/python_javascript/vectorizer.pkl"
    train_model(dataset_path, model_save_path, vectorizer_save_path)
