import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  projects: any;
  constructor(public navCtrl: NavController) {
    this.projects = [
	  {
		  "Name":"TestPeriod", 
		  "Type":"Period", 
		  "Progress":30,
		  "Data":[]
	  },
	  {"Name":"TestCheckList", "Type":"Check", "Data":[]},
	  {"Name":"TestTicket", "Type":"Ticket", "Data":[]},
	];
  }
  openProjectPage(item) {
	  console.log(item);
  }
}
