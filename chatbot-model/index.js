const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const readline = require("readline");
const path = require('path');

const data = JSON.parse(fs.readFileSync("dataset.json", "utf8"));

const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?¿¡]/g, "")
      .trim();
  };
  

const preprocessData = (data) => {
  return data.map(pair => ({ input: normalizeText(pair.input), output: normalizeText(pair.output) }));
};

const pairs = preprocessData(data);


const createVocabulary = (data) => {
  const vocab = new Set();
  data.forEach(({ input }) => {
    input.split(" ").forEach((word) => vocab.add(word.toLowerCase()));
  });
  return Array.from(vocab);
};

const vocab = createVocabulary(pairs);
const vocabSize = vocab.length;


const uniqueResponses = Array.from(new Set(pairs.map((pair) => pair.output)));
const responseToIndex = uniqueResponses.reduce((obj, response, index) => {
  obj[response] = index;
  return obj;
}, {});
const indexToResponse = Object.fromEntries(
  Object.entries(responseToIndex).map(([k, v]) => [v, k])
);


const encodeText = (text, vocab) => {
  const encoded = Array(vocabSize).fill(0);
  normalizeText(text).toLowerCase().split(" ").forEach((word) => {
    const index = vocab.indexOf(word);
    if (index !== -1) {
      encoded[index] = 1;
    }
  });
  return encoded;
};


const inputs = pairs.map((pair) => encodeText(pair.input, vocab));
const outputs = pairs.map((pair) => responseToIndex[pair.output]);


const outputsOneHot = tf.oneHot(tf.tensor1d(outputs, "int32"), uniqueResponses.length);


const createModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [vocabSize], units: 240, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: uniqueResponses.length, activation: "softmax" }));
  model.compile({
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });
  return model;
};

const model = createModel();

// Ruta para guardar el modelo entrenado y recursos adicionales
const modelPath = path.join(__dirname, 'modelo_chatbot', 'model.json');
const dirPath = path.dirname(modelPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}


const saveResources = () => {
  fs.writeFileSync(path.join(dirPath, 'vocab.json'), JSON.stringify(vocab, null, 2));
  fs.writeFileSync(path.join(dirPath, 'indexToResponse.json'), JSON.stringify(indexToResponse, null, 2));
  console.log("Recursos guardados: vocab.json, indexToResponse.json");
};


const train = async () => {
  const inputTensors = tf.tensor2d(inputs);
  await model.fit(inputTensors, outputsOneHot, {
    epochs: 800, // cambiar a un valor mas grande
    batchSize: 16,
  }).then(async () => {
    await model.save('file://' + dirPath);
    saveResources();
  });
  console.log("Entrenamiento completado.");
};


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

train().then(() => {
  console.log("Escribe tu pregunta (escribe 'salir' para finalizar)");

  rl.on("line", (input) => {
    if (input.toLowerCase() === "salir") {
      console.log("Adiós");
      rl.close();
    } else {
      const encodedInput = encodeText(normalizeText(input), vocab);
      const prediction = model.predict(tf.tensor2d([encodedInput]));

      prediction.array().then((array) => {
        const responseIndex = array[0].indexOf(Math.max(...array[0]));
        console.log(indexToResponse[responseIndex] || "No entiendo eso.");
      });
    }
  });
});
