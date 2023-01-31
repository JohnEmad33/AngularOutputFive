import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, map } from 'rxjs';

import { Product } from '../model/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  //Create product in database
  createProduct(products: { pName: string; desc: string; price: string }) {
    console.log(products);
    const headers = new HttpHeaders({ myHeader: "John's products" });
    return this.http.post<{ name: string }>(
      'https://angularlearninghttp-default-rtdb.firebaseio.com/products.json',
      products,
      { headers: headers }
    );
  }

  //Fetch product in database
  fetchProduct() {
    return this.http
      .get<{ [key: string]: Product }>(
        'https://angularlearninghttp-default-rtdb.firebaseio.com/products.json'
      )
      .pipe(
        map((res) => {
          const Products = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              Products.push({ ...res[key], id: key });
            }
          }
          return Products;
        })
      );
  }

  //Delete product in database
  deleteProduct(id: string) {
    return this.http.delete(
      'https://angularlearninghttp-default-rtdb.firebaseio.com/products/' +
        id +
        '.json'
    );
  }

  //Delete all product in database
  deleteAllProduct() {
    return this.http.delete(
      'https://angularlearninghttp-default-rtdb.firebaseio.com/products.json'
    );
  }

    //Update product in database
    UpdateProduct(id: string,value:Product) {
        return this.http.put('https://angularlearninghttp-default-rtdb.firebaseio.com/products/' +id +'.json',value);
      }
}
