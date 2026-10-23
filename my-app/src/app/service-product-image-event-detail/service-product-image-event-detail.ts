import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../classes/IProduct';

@Component({
  selector: 'app-service-product-image-event-detail',
  standalone: false,
  styleUrl: './service-product-image-event-detail.css',
  templateUrl: './service-product-image-event-detail.html',
})
export class ServiceProductImageEventDetail {
  selectedProduct: Product | undefined;

  constructor(private activateRoute:ActivatedRoute,private _fs:ProductService,
  private router:Router)
  {
  activateRoute.paramMap.subscribe(
  (param)=>{
  let id=param.get('id')
  if(id!=null)
  {
  this.selectedProduct = _fs.getProducts().find((product) => String(product.id) === id);
  }
  }
  )
  }
  goBack(){
  this.router.navigate(['service-product-image-event']);
  }
}
