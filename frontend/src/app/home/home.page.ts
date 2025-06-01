import { Component } from '@angular/core';
import { ApiService } from '../services/api/api.service';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonIcon,
  IonCol,
  IonThumbnail,
  IonImg,
  IonCard,
  IonLabel,
  IonText,
  IonCardContent
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonHeader, IonTitle,
    IonToolbar, IonRow, IonIcon, IonThumbnail, IonCol, IonImg, IonCard, IonLabel, IonText, IonCardContent],
})
export class HomePage {
  motorCycles: any[] = []; // Tipa correctamente según tu API (ej: Motorcycle[])
  constructor( private apiService: ApiService) {}

  
  ngOnInit(){
    console.log('ngOnInit home page')
    this.getMotorcycles()
  }
  getMotorcycles(){
    this.motorCycles = this.apiService.motorCycles;
  }
}
