import { Component, OnInit, Inject} from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand ,visibility} from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    visibility() ,flyInOut() , expand() 
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;

  dishErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL
   ) { }

  ngOnInit() {
  // this.dish = this.dishservice.getFeaturedDish();
    this.dishservice.getFeaturedDish()
    .subscribe(dish => this.dish = dish,  errmess => this.dishErrMess = <any>errmess);
    //this.promotion = 
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion =promotion);
   // this.leader = 
    this.leaderService.getFeaturedLeader().subscribe(leader=> this.leader=leader);
  }

}
