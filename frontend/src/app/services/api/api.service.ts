import { Injectable } from '@angular/core';
import { Product } from './product/product';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  motorCycles: Array<Product> = [
    {
      id: 1,
      name: 'Moto esperolada',
      price: 0.00004,
      status: true,
      rating: 4,
      image: './assets/motorcycle/moto1.png',
      description: 'La moto esta toda desbaratada pero funcional'
    },
    {
      id: 2,
      name: 'Moto factory new',
      price: 0.00004,
      status: true,
      rating: 3,
      image: './assets/motorcycle/moto2.jpg',
      description: 'La moto esta toda desbaratada pero funcional'
    },
    {
      id: 3,
      name: 'Moto chavista',
      price: 0.00004,
      status: true,
      rating: 5,
      image: './assets/motorcycle/moto3.png',
      description: 'La moto esta toda desbaratada pero funcional'
    },
    {
      id: 4,
      name: 'Moto no silve',
      price: 0.00004,
      status: true,
      rating: 1,
      image: './assets/motorcycle/moto4.png',
      description: 'La moto esta toda desbaratada pero funcional'
    },
    {
      id: 5,
      name: 'Moto china',
      price: 0.00004,
      status: true,
      rating: 1,
      image: './assets/motorcycle/moto5.png',
      description: 'La moto esta toda desbaratada pero funcional'
    },
  ]
  constructor() {}
}
