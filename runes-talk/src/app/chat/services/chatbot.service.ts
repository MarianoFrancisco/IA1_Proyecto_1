import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private model!: tf.Sequential;
  private vocab: string[] = [];
  private trained: boolean = false;
  private intenciones: string[] = [];
  private responsesMap: { [key: string]: string } = {};

  constructor(private http: HttpClient) { }

  private async loadData() {
    const intentsData = await lastValueFrom(
      this.http.get<{[intent: string]: string[]}>('assets/intents.json')
    );

    const responsesData = await lastValueFrom(
      this.http.get<{[intent: string]: string}>('assets/responses.json')
    );

    if (!intentsData) {
      throw new Error('No se pudo cargar intents.json');
    }
    if (!responsesData) {
      throw new Error('No se pudo cargar responses.json');
    }

    this.responsesMap = responsesData;

    this.intenciones = Object.keys(intentsData);

    const trainDataset = [];
    for (const intent of this.intenciones) {
      const examples = intentsData[intent];
      for (const example of examples) {
        trainDataset.push({ texto: example, intencion: intent });
      }
    }

    return trainDataset;
  }

  async trainModel() {
    if (this.trained) return;

    const train = await this.loadData();
    if (!train || train.length === 0) {
      throw new Error('No se encontraron datos de entrenamiento a partir de intents.json');
    }

    this.vocab = this.buildVocabulary(train);
    const xsData: number[][] = [];
    const ysData: number[][] = [];

    for (const ej of train) {
      xsData.push(this.textToVector(ej.texto, this.vocab));
      ysData.push(this.intencionToOneHot(ej.intencion));
    }

    const xs = tf.tensor2d(xsData);
    const ys = tf.tensor2d(ysData);

    this.model = tf.sequential();
    this.model.add(tf.layers.dense({inputShape: [this.vocab.length], units: 16, activation: 'relu'}));

    this.model.add(tf.layers.dense({units: this.intenciones.length, activation: 'softmax'}));
    this.model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy']});

    await this.model.fit(xs, ys, {
      epochs: 100,
      shuffle: true,
      verbose: 0
    });
    this.trained = true;
  }

  predecirIntencion(texto: string): string {
    if (!this.trained) {
      throw new Error('El modelo aún no está entrenado');
    }
    const inputVec = this.textToVector(texto, this.vocab);
    const inputTensor = tf.tensor2d([inputVec]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const data = prediction.dataSync();
    const maxIndex = data.indexOf(Math.max(...data));
    return this.intenciones[maxIndex];
  }

  getResponseForIntent(intent: string): string {
    const responses = this.responsesMap[intent];
    if (!responses || responses.length === 0) {
      return 'No tengo una respuesta para eso, lo siento.';
    }
  
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  

  tokenize(text: string): string[] {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/);
  }

  buildVocabulary(dataset: {texto: string; intencion: string}[]): string[] {
    const vocabSet = new Set<string>();
    for (const item of dataset) {
      const tokens = this.tokenize(item.texto);
      for (const token of tokens) {
        vocabSet.add(token);
      }
    }
    return Array.from(vocabSet);
  }

  intencionToOneHot(intencion: string): number[] {
    const vector = new Array(this.intenciones.length).fill(0);
    const idx = this.intenciones.indexOf(intencion);
    if (idx !== -1) {
      vector[idx] = 1;
    }
    return vector;
  }

  textToVector(text: string, vocab: string[]): number[] {
    const tokens = this.tokenize(text);
    const vector = new Array(vocab.length).fill(0);
    for (const token of tokens) {
      const idx = vocab.indexOf(token);
      if (idx !== -1) {
        vector[idx] = 1;
      }
    }
    return vector;
  }

}
