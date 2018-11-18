import { Component, OnInit, Input ,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core'




@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
 

  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 2 characters long.'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL
  ) { }

  ngOnInit() {
  //  let id = this.route.snapshot.params['id'];
   // this.dish = this.dishservice.getDish(id);
   //this.dishservice.getDish(id)
   //.subscribe(dish => this.dish = dish);

   this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
   this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
   .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });

   this.commentForm = this.fb.group({
    author: ['', [Validators.required, Validators.minLength(2)]],
    comment: ['', [Validators.required, Validators.minLength(2)]],
    rating: 5
  });

  this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }

  

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);

    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    let date: Date = new Date();
    this.comment = this.commentForm.value;
    this.comment.date = date.toISOString();
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      firstname: '',
      lastname: '',
      rating: 5
    });

  }
}