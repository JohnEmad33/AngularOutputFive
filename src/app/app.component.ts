import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Product } from './model/products';
import { ProductService } from './Service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularHttpRequest';
  allProducts: Product[] = [];
  isFetching: boolean = false;
  @ViewChild('productsForm') form: NgForm;
  editMode: boolean = false;
  currentProductId: string;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreate(products: { pName: string; desc: string; price: string }) {
    this.isFetching = true;
    if (!this.editMode) {
      this.productService.createProduct(products).subscribe((res) => {
        console.log(res);
        products = Object.assign(products, { id: res['name'] });

        this.allProducts.push(products);
        this.isFetching = false;
        this.form.setValue({
          pName:'',
          desc: '',
          price: '',
        });
      });
    } else {
      this.productService
        .UpdateProduct(this.currentProductId, products)
        .subscribe(() => {
          this.isFetching = false;
          products = Object.assign(products, { id: this.currentProductId });
          console.log(products);
          console.log(this.currentProductId);
          let updatedAllProducts=this.allProducts.map(p => {
            if (p.id == this.currentProductId) {
              console.log(products);
              p = products;
              console.log(p);
              console.log('ooooooooo', products);
            }
            return p
          });
          console.log(updatedAllProducts);
          console.log(this.allProducts);
          this.allProducts=updatedAllProducts;
          this.editMode=false;
          this.form.setValue({
            pName:'',
            desc: '',
            price: '',
          });
        });
    }
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products) => {
      console.log(products);
      this.allProducts = products;
      this.isFetching = false;
    });
  }

  onDeleteProduct(id: string) {
    this.isFetching = true;
    this.productService.deleteProduct(id).subscribe(() => {
      const objWithIdIndex = this.allProducts.findIndex((obj) => obj.id === id);
      console.log(objWithIdIndex);
      if (objWithIdIndex !== -1) {
        this.allProducts.splice(objWithIdIndex, 1);
        this.isFetching = false;
      }
    });
  }

  onDeleteAllProduct() {
    this.isFetching = true;
    this.productService.deleteAllProduct().subscribe(()=>{
      let emptyProducts=[];
      this.allProducts=emptyProducts
      if(this.allProducts.length==0){
        console.log(this.allProducts)
        this.isFetching = false;
      }
    });
  }
  onEditProduct(id: string) {
    this.currentProductId = id;
    let currentProduct = this.allProducts.find((p) => {
      return p.id === id;
    });
    console.log(currentProduct);

    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price,
    });

    this.editMode = true;
  }
}
