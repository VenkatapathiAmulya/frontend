import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'pb-add-edit-data',
  templateUrl: './add-edit-data.component.html'
})
export class AddEditDataComponent implements OnInit {
  form: FormGroup;
    id: String;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}


    ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      console.log("&&&&&&&&&&&&&&&&&& this.id",this.id);
      this.isAddMode = !this.id;

      // password not required in edit mode
      const passwordValidators = [Validators.minLength(6)];
      if (this.isAddMode) {
          passwordValidators.push(Validators.required);
      }

      this.form = this.formBuilder.group({
          title: ['', Validators.required],
          budget: ['', Validators.required],
          expense: ['', Validators.required],
          color: ['', Validators.required]
      });

      if (!this.isAddMode) {
          this.accountService.getById(this.id)
              .pipe(first())
              .subscribe(x => {
                console.log("*********** x = ",x[0].title);
                 this.form.patchValue(x[0])
              });
      }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
        console.log("*************** form data ",this.form.value);
          this.addData();
      } else {
          this.updateData();
      }
  }

  private addData() {
    const username = localStorage.getItem('user');
      this.accountService.add(this.form.value,username)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Data added successfully', { keepAfterRouteChange: true });
                  this.router.navigate(['../'], { relativeTo: this.route });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

  private updateData() {
    const username = localStorage.getItem('user');
      this.accountService.update(this.id, this.form.value,username)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Update successful', { keepAfterRouteChange: true });
                  this.router.navigate(['../../'], { relativeTo: this.route });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

}

