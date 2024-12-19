# Chatbot Model

This project provides a simple pipeline for creating and training a chatbot model using TensorFlow.js in Node.js. The project processes a dataset of input-output pairs, trains a model, and saves the trained model and necessary resources for future use.

## Project Structure

```
chatbot-model/
├── dataset.json     # Dataset containing input-output pairs
├── index.js         # Main script to train and save the chatbot model
├── package.json     # Node.js dependencies and scripts
└── README.md        # Documentation
```

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. You can download it from [Node.js official website](https://nodejs.org/).

## Getting Started

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd chatbot-model
   ```

2. **Install dependencies**:
   Navigate to the project root and install the required dependencies by running:
   ```bash
   npm install
   ```

3. **Prepare the dataset**:
   Ensure the `dataset.json` file is properly formatted. It should contain an array of objects with `input` and `output` fields:
   ```json
   [
     { "input": "Hello", "output": "Hi there!" },
     { "input": "How are you?", "output": "I'm doing great, thank you!" }
   ]
   ```

4. **Run the training script**:
   Execute the `index.js` file to start training the model:
   ```bash
   node index.js
   ```

5. **Monitor training progress**:
   The script will display the training progress in the terminal. Once the epochs are completed, the trained model and resources (vocabulary and response index) will be saved in a directory named `modelo_chatbot`.

6. **Verify output**:
   After training, the following files will be generated in the `modelo_chatbot` directory:
   - `model.json`: The trained model.
   - `vocab.json`: Vocabulary used by the model.
   - `indexToResponse.json`: Mapping of indices to responses.
   - `weights.bin`: Weights of the trained model.

## Example Output

During training, you will see logs indicating the progress of the epochs. For example:

```
Epoch 1/10
loss: 1.2345 - accuracy: 0.56
Epoch 2/10
loss: 0.9876 - accuracy: 0.72
...
Entrenamiento completado.
Recursos guardados: vocab.json, indexToResponse.json
```

## Usage

After training, the saved model and resources can be used in a chatbot application (e.g., React, Angular, or any other frontend/backend framework). Refer to the relevant documentation for integrating TensorFlow.js models.

## Notes

- Ensure the dataset is representative and clean for optimal results.
- Adjust the number of epochs and batch size in `index.js` based on your dataset size and computational power.
- Use normalization techniques (e.g., removing punctuation, handling case sensitivity) for better generalization.

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.
