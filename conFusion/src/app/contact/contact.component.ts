import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    style: 'display:block;'
  },
  animations: [flyInOut(), expand(), visibility()]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  errMess: string;
  showspinner = false;
  showform = true;
  showfeedback = false;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    firstname: '',
    lastname: '',
    telnum: '',
    email: ''
  };

  validationMessages = {
    firstname: {
      required: 'first name is requied',
      minlength: 'first name must be 2 chars long',
      maxlength: 'first name cannnot be more than 25 chars long'
    },
    lastname: {
      required: 'last name is requied',
      minlength: 'last name must be 2 chars long',
      maxlength: 'last name cannnot be more than 25 chars long'
    },
    telnum: {
      required: 'tel num is requied',
      pattern: 'tel num must contain only numbers'
    },
    email: { required: 'email is requied', email: 'email not in valid format' }
  };

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      lastname: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contactType: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // reset form validation messages
  }

  onValueChanged(data?) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.showform = false;
    this.showspinner = true;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackService.submitFeedback(this.feedback).subscribe(
      feedback => {
        this.feedback = feedback;
        this.showspinner = false;
        this.showfeedback = true;

        setTimeout(() => {
          this.feedback = null;
          this.showfeedback = false;
          this.showform = true;
        }, 5000);
      },
      errmess => {
        this.feedback = null;
        this.errMess = <any>errmess;
      }
    );
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
