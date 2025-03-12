import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { Product } from '../model/products';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) {

    }

    //create products in the db
    createProduct(products: { pName: string, desc: string, price: string }) {
        console.log(products);

        const headers = new HttpHeaders({ 'myHeader': 'Eva' });
        //post method takes minimum 2 arguments (url and body), 3rd argumemts is options which is body
        this.http.post<{ name: string }>('https://project-1-29cec-default-rtdb.firebaseio.com/products.json', products, { headers: headers }).subscribe((res) => { //res-> response
            console.log(res);
        })
    }

    //fetch products from the db
    fetchProduct() {
        //get method takes a minimum of 1 argument (url)
        return this.http.get<{ [key: string]: Product }>('https://project-1-29cec-default-rtdb.firebaseio.com/products.json') //get is a generic type
            .pipe(map((res) => { //res -> response which the get method is going to get/give
                //.pipe(map((res : {[key: string]: Product}) //or we can also do it this way, instead of specifying for get method
                const products = [];
                for (const key in res) { //key means OL4B... in firebase database
                    if (res.hasOwnProperty(key)) { // this returns a boolean indicating whether that keh has the specified property as its won property( as opposed to inherited property)
                        products.push({ ...res[key], id: key }) //... is the spread operator which expands the properities of the response object (key) into individual properties, we are wrapping those individual properties into square brackets; i.e, creating another object from this object
                    }
                }
                return products; //map method return an observable and that observable will return the products
            }))
    }

    //delete a single product in the db
    deleteProduct(id: string) {
        this.http.delete('https://project-1-29cec-default-rtdb.firebaseio.com/products/' + id + '.json') //delete has 1 or only mandatory argument, the url is form the firebase url of that specific product url
            .subscribe();
    }

    //delete all the products in the db
    deleteProducts() {
        this.http.delete('https://project-1-29cec-default-rtdb.firebaseio.com/products.json')
            .subscribe();
    }

    updateProduct(id: string, value: Product){
        this.http.put('https://project-1-29cec-default-rtdb.firebaseio.com/products/' + id + '.json', value) //put takes 2 mandatory arguments, the url and also the value, it returns an observable
        .subscribe();
    }
}