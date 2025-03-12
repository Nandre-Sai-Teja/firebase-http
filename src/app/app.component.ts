import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
//import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';  // Correct import
import { map } from 'rxjs';
import { Product } from './model/products';
import { CommonModule } from '@angular/common';
import { ProductService } from './Service/products.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    //HttpClientModule, //this is deprecated, we use providehttpclient instead in app.config.ts 
    CommonModule
  ],
  //providers: [provideHttpClient()], // This is correct now, returns EnvironmentProviders
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'http-firebase';

  //constructor(private http: HttpClient, private productService: ProductService) {} // Inject HttpClient
  constructor(private productService: ProductService) {} // Inject HttpClient

  allProducts: Product[]= [];

  isFetching: boolean = false; //to display the loading part

  editMode: boolean = false;

  currentProductId: string;

  @ViewChild('productsForm') form: NgForm

  ngOnInit(){ //a decorator, this will assign form with local reference variable (productsForm) to form (form) property
    this.fetchProducts(); //inside ngoninit becase we want to display them everytime the page loads
  }

  onProductsFetch(){ //public method
    this.fetchProducts();
  }

  // onProductCreate(products: { pName: string, desc: string, price: string }) {
  //   console.log(products);

  //   const headers = new HttpHeaders({'myHeader': 'Eva'});
  //   //post method takes minimum 2 arguments (url and body), 3rd argumemts is options which is body
  //   this.http.post<{name: string}>('https://project-1-29cec-default-rtdb.firebaseio.com/products.json', products, {headers: headers}).subscribe((res) => { //res-> response
  //     console.log(res);
  //   })
  // }

  onProductCreate(products: { pName: string, desc: string, price: string }){
    if(!this.editMode){
      this.productService.createProduct(products);
    }else{
      this.productService.updateProduct(this.currentProductId, products);
    }
  }

  // private fetchProducts(){
  //   this.isFetching = true; 
  //   //get method takes a minimum of 1 argument (url)
  //   this.http.get<{[key: string]: Product}>('https://project-1-29cec-default-rtdb.firebaseio.com/products.json') //get is a generic type
  //   .pipe(map((res) => { //res -> response which the get method is going to get/give
  //     //.pipe(map((res : {[key: string]: Product}) //or we can also do it this way, instead of specifying for get method
  //     const products = [];
  //     for(const key in res){ //key means OL4B... in firebase database
  //       if(res.hasOwnProperty(key)) { // this returns a boolean indicating whether that keh has the specified property as its won property( as opposed to inherited property)
  //         products.push({...res[key], id: key}) //... is the spread operator which expands the properities of the response object (key) into individual properties, we are wrapping those individual properties into square brackets; i.e, creating another object from this object
  //       }
  //     }
  //     return products; //map method return an observable and that observable will return the products
  //   }))
  //   .subscribe((products) => {
  //     console.log(products);
  //     this.allProducts = products; 
  //     this.isFetching = false; //after the products are fetched / observable has returned the response/data
  //   })
  // }

  private fetchProducts(){
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products) => { //products is the response that we will get
      this.allProducts = products;
      this.isFetching = false;
    })
  }

  // onDeleteProduct(id: string){
  //   this.http.delete('https://project-1-29cec-default-rtdb.firebaseio.com/products/'+id+'.json') //delete has 1 or only mandatory argument, the url is form the firebase url of that specific product url
  //   .subscribe();
  // }

  onDeleteProduct(id: string){
    this.productService.deleteProduct(id);
  }

  // onProductsDelete(){
  //   this.http.delete('https://project-1-29cec-default-rtdb.firebaseio.com/products.json')
  //   .subscribe(); 
  // }

  onProductsDelete(){
    this.productService.deleteProducts();
  }

  onEditClicked(id: string){
    //get the product based on the id
    this.currentProductId = id;
    let currentProduct =  this.allProducts.find((p) => {
      return p.id === id
    })
    //console.log(this.form)
    //find method finds the first match in that array and on a condition, p is the current element

    //populate the form with the product details
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price
    })

    //change the button value from Add Product to Update Product
    this.editMode = true
  }
}
