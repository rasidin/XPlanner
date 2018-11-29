import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { DataBase } from '../../service/database/database';

import { NewProjectPage } from '../home/newproject';
import { PeriodPage } from '../period/period';
import { CheckPage } from '../check/check';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  database: any;
  projects: any;
  constructor(public navCtrl: NavController, public storage: Storage) {	
	this.database = new DataBase(true);
	this.projects = this.database.getProjectList();
	console.log(this.projects);
	
//	this.makeSampleData();
	for(var projidx=0;projidx<this.projects.length;projidx++) {
		var project = this.projects[projidx];
		if (project["Type"] == "Period") {
			var startDate = Date.parse(project["StartDate"]);
			var endDate = Date.parse(project["EndDate"]);
			var todayDate = Date.now();
			var duration = Math.ceil((endDate - todayDate) / (1000 * 60 * 60 * 24));
			project["InfoText"] = String(duration) + " days left";
		} else if (project["Type"] == "Check") {
			var checkedCount = project.CompleteItemCount;
			if (checkedCount < project.ItemCount) {
			  project["InfoText"] = String(checkedCount) + " / " + project.ItemCount;
			} else {
			  project["InfoText"] = "Complete";
			}
		} else if (project["Type"] == "Ticket") {
			var incompletedTickets = project.ItemCount - project.CompleteItemCount;
			project["InfoText"] = String(incompletedTickets) + " tickets left";
		}
	}
  }
  openProjectPage(item) {
    this.database.getProjectItems(item);
	if (item["Type"] == "Period")
		this.navCtrl.push(PeriodPage, {project: item, database: this.database});
	else if (item["Type"] == "Check")
		this.navCtrl.push(CheckPage, {project: item, database: this.database});
  }
  addProject() {
	  this.navCtrl.push(NewProjectPage, {database:this.database});
  }
  
  // makeSampleData() {
    // this.projects = [
	  // {
		// "Name":"TestPeriod", 
		// "Type":"Period", 
		// "Progress":30,
		// "InfoText":"",
		// "StartDate":"2018-01-20",
		// "EndDate":"2019-02-23",
		// "Data":[
		// {
			// "Title":"A",
			// "StartDate":"2018-10-01",
			// "EndDate":"2020-03-02",
		// },
		// ]
	  // },
	  // {
		// "Name":"TestCheckList", 
		// "Type":"Check", 
		// "Progress":80,
		// "InfoText":"",
		// "Category":[
			// "CategoryA",
			// "CategoryB",
		// ],
		// "Data":[
		// {
			// "Title":"Check list 1",
			// "Category":"CategoryA",
			// "Checked":false
		// },
		// {
			// "Title":"Check list 2",
			// "Category":"CategoryA",
			// "Checked":true
		// },
		// {
			// "Title":"Check list 3",
			// "Category":"CategoryB",
			// "Checked":false
		// },
		// ]
	  // },
	  // {
		// "Name":"TestTicket", 
		// "Type":"Ticket", 
		// "Progress":50,
		// "InfoText":"",
		// "Data":[
		// {
			// "Title":"A",
			// "StartDate":"2018-03-10",
			// "EndDate":"2018-10-10",
			// "Progress":30,
		// },
		// {
			// "Title":"B",
			// "StartDate":"2018-10-10",
			// "EndDate":"2018-11-10",
			// "Progress":100,
		// },
		// {
			// "Title":"C",
			// "StartDate":"2018-11-03",
			// "EndDate":"2019-01-10",
			// "Progress":60,
		// },
		// ]
	  // },
	// ];
  // }
}
