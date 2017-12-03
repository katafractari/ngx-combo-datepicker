import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form: FormGroup;

  initialDate = new Date(new Date('2017-10-05'));

  customMonths = 'Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre';

  value: string;
  visibleExample: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      visibleExample: new FormControl(null, [Validators.required]),
      control: new FormControl(null, [Validators.required])
    });

    this.form.get('control').valueChanges
      .subscribe((value) => this.value = value);
    this.form.get('visibleExample').valueChanges
      .subscribe((value) => this.visibleExample = value);
  }
}
