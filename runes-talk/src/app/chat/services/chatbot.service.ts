import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private model!: tf.Sequential; // usamos ! para indicar que se asignará más tarde
  private vocab: string[] = [];
  private entrenado = false;

  constructor(private http: HttpClient) {}

  async entrenarModelo() {
    if (this.entrenado) return;

    // const data = await lastValueFrom(
    //   this.http.get<{training_data: {texto: string; intencion: string}[]}>('assets/training_data.json')
    // );

    const data ={
        "training_data": [
          { "texto": "hola", "intencion": "saludo" },
          { "texto": "buenos días", "intencion": "saludo" },
          { "texto": "qué tal", "intencion": "saludo" },
          { "texto": "adiós", "intencion": "despedida" },
          { "texto": "hasta luego", "intencion": "despedida" },
          { "texto": "qué hora es", "intencion": "preguntar_hora" },
          { "texto": "me dices la hora", "intencion": "preguntar_hora" }
        ]
      }
      

    if (!data || !data.training_data) {
      throw new Error('No se encontraron datos de entrenamiento');
    }

    const entrenamiento = data.training_data;

    this.vocab = buildVocabulary(entrenamiento);

    const xsData: number[][] = [];
    const ysData: number[][] = [];

    for (const ej of entrenamiento) {
      xsData.push(textToVector(ej.texto, this.vocab));
      ysData.push(intencionToOneHot(ej.intencion));
    }

    const xs = tf.tensor2d(xsData);
    const ys = tf.tensor2d(ysData);

    this.model = tf.sequential();
    this.model.add(tf.layers.dense({inputShape: [this.vocab.length], units: 8, activation: 'relu'}));
    this.model.add(tf.layers.dense({units: intenciones.length, activation: 'softmax'}));
    this.model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy']});

    await this.model.fit(xs, ys, {
      epochs: 50,
      shuffle: true,
      verbose: 0
    });

    this.entrenado = true;
  }

  predecirIntencion(texto: string): string {
    if (!this.entrenado) {
      throw new Error('El modelo aún no está entrenado');
    }
    const inputVec = textToVector(texto, this.vocab);
    const inputTensor = tf.tensor2d([inputVec]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const data = prediction.dataSync();
    const maxIndex = data.indexOf(Math.max(...data));
    return intenciones[maxIndex];
  }
}

// Funciones auxiliares
const intenciones = ["saludo", "despedida", "preguntar_hora"];

function tokenize(text: string): string[] {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/);
}

function buildVocabulary(dataset: {texto: string; intencion: string}[]): string[] {
  const vocabSet = new Set<string>();
  for (const item of dataset) {
    const tokens = tokenize(item.texto);
    for (const token of tokens) {
      vocabSet.add(token);
    }
  }
  return Array.from(vocabSet);
}

function intencionToOneHot(intencion: string): number[] {
  const vector = new Array(intenciones.length).fill(0);
  const idx = intenciones.indexOf(intencion);
  if (idx !== -1) {
    vector[idx] = 1;
  }
  return vector;
}

function textToVector(text: string, vocab: string[]): number[] {
  const tokens = tokenize(text);
  const vector = new Array(vocab.length).fill(0);
  for (const token of tokens) {
    const idx = vocab.indexOf(token);
    if (idx !== -1) {
      vector[idx] = 1;
    }
  }
  return vector;
}
