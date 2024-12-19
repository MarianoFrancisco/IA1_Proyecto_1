import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as tf from '@tensorflow/tfjs';
import { forkJoin, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private httpClient = inject(HttpClient);

  private vocab = signal<string[]>([]);
  private _model = signal<tf.LayersModel | null>(null);
  private indexToRes = signal<{ [key: number]: string }>({});

  public model = computed(() => this._model());

  constructor() { }

  loadResources(): Observable<void> {
    const model$ = tf.loadLayersModel('modelo_chatbot/model.json');
    const vocab$ = this.httpClient.get<string[]>('modelo_chatbot/vocab.json');
    const responses$ = this.httpClient.get<{ [key: number]: string }>('modelo_chatbot/indexToResponse.json');
    return forkJoin([model$, vocab$, responses$]).pipe(
      map(([model, vocab, responses]) => {
        this._model.set(model);
        this.vocab.set(vocab);
        this.indexToRes.set(responses);
      })
    );
  }

  private encodeText(text: string): number[] {
    const encoded = Array(this.vocab().length).fill(0);
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?¿¡]/g, "")
      .trim()
      .split(' ')
      .forEach((word) => {
        const index = this.vocab().indexOf(word);
        if (index !== -1) {
          encoded[index] = 1;
        }
      });
    return encoded;
  }

  predictIntent(userInput: string): Observable<string> {
    if (!this._model()) {
      throw new Error('El modelo no está cargado.');
    }
    if (!userInput) {
      return new Observable((observer) => {
        observer.next('No se ingresó texto para analizar.');
        observer.complete();
      });
    }
    const encodedInput = this.encodeText(userInput);
    const inputTensor = tf.tensor2d([encodedInput]);
    const prediction = this.model()!.predict(inputTensor) as tf.Tensor;
    return new Observable<string>((observer) => {
      prediction.array().then((predictionArray: any) => {
        inputTensor.dispose();
        prediction.dispose();
        const responseIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
        observer.next(this.indexToRes()[responseIndex] || 'No entiendo eso.');
        observer.complete();
      });
    });
  }

}
