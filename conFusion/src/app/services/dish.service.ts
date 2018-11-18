import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient) { }

/*
 getDishes(): Promise<Dish[]> {
  return new Promise(resolve=> {
    // Simulate server latency with 2 second delay
      setTimeout(() => resolve(DISHES), 2000);
  });
}

getDish(id: string): Promise<Dish> {
  return new Promise(resolve=> {
    // Simulate server latency with 2 second delay
      setTimeout(() => resolve(DISHES.filter((dish) => (dish.id === id))[0]), 2000);
  });
}

getFeaturedDish(): Promise<Dish> {
  return  new Promise(resolve=> {
    // Simulate server latency with 2 second delay
      setTimeout(() => resolve(DISHES.filter((dish) => dish.featured)[0]), 2000);
  });
}
*/

getDishes(): Observable<Dish[]> {
  return this.http.get<Dish[]>(baseURL + 'dishes');
}

getDish(id: number): Observable<Dish> {
  return this.http.get<Dish>(baseURL + 'dishes/' + id);
}

getFeaturedDish(): Observable<Dish> {
  return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]));
}

getDishIds(): Observable<number[] | any> {
  return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)));
}



}
