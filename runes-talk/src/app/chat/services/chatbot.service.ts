import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { training_data } from '../../../../public/training_data.json';
import { Data } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private model!: tf.Sequential;
  private vocab: string[] = [];
  private trained: boolean = false;
  private intenciones: string [] = ["saludo", "despedida", "preguntar_hora"];
  constructor() { }

  async trainModel() {
    if (this.trained) return;
    const data: Data[] = training_data;
    if (!data) {
      throw new Error('No se encontraron datos de entrenamiento.');
    }
    const train = data;
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
    this.model.add(tf.layers.dense({inputShape: [this.vocab.length], units: 8, activation: 'relu'}));
    this.model.add(tf.layers.dense({units: this.intenciones.length, activation: 'softmax'}));
    this.model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy']});

    await this.model.fit(xs, ys, {
      epochs: 50,
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
    const prediction = this.model!.predict(inputTensor) as tf.Tensor;
    const data = prediction.dataSync();
    const maxIndex = data.indexOf(Math.max(...data));
    return this.intenciones[maxIndex];
  }

  tokenize(text: string): string[] {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/);
  }

  buildVocabulary(dataset: Data[]): string[] {
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
