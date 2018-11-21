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
		"InfoText":"",
		"StartDate":"2018-01-20",
		"EndDate":"2019-02-23",
	  },
	  {
		"Name":"TestCheckList", 
		"Type":"Check", 
		"Progress":80,
		"InfoText":"",
		"Data":[
		{
			"Text":"Check list 1",
			"Checked":false
		},
		{
			"Text":"Check list 2",
			"Checked":true
		},
		{
			"Text":"Check list 3",
			"Checked":false
		},
		]
	  },
	  {
		"Name":"TestTicket", 
		"Type":"Ticket", 
		"Progress":50,
		"InfoText":"",
		"Data":[
		{
			"Title":"A",
			"StartDate":"2018-03-10",
			"EndDate":"2018-10-10",
			"Progress":30,
		},
		{
			"Title":"B",
			"StartDate":"2018-10-10",
			"EndDate":"2018-11-10",
			"Progress":100,
		},
		{
			"Title":"C",
			"StartDate":"2018-11-03",
			"EndDate":"2019-01-10",
			"Progress":60,
		},
		]
	  },
	];
	
	for(var projidx=0;projidx<this.projects.length;projidx++) {
		var project = this.projects[projidx];
		if (project["Type"] == "Period") {
			var startDate = new Date(project["StartDate"]);
			var endDate = new Date(project["EndDate"]);
			var todayDate = Date.now();
			var duration = Math.ceil((endDate - todayDate) / (1000 * 60 * 60 * 24));
			project["Progress"] = Math.ceil((todayDate - startDate) * 100 / (endDate - startDate));
			project["InfoText"] = String(duration) + " days left";
		} else if (project["Type"] == "Check") {
			var checkedCount = 0;
			for(var itemidx=0;itemidx<project["Data"].length;itemidx++) {
				if (project["Data"][itemidx]["Checked"]) {
					checkedCount = checkedCount+1;
				}
			}
			if (checkedCount < project["Data"].length) {
			  project["Progress"] = Math.ceil(100 * checkedCount / project["Data"].length);
			  project["InfoText"] = String(checkedCount) + " / " + project["Data"].length;
			} else {
			  project["Progress"] = 100;
			  project["InfoText"] = "Complete";
			}
		} else if (project["Type"] == "Ticket") {
			var totalProgress = 0;
			var incompletedTickets = 0;
			for (var dataidx=0;dataidx<project["Data"].length;dataidx++) {
				totalProgress += project["Data"][dataidx]["Progress"];
			if (project["Data"][dataidx]["Progress"] < 100) 
				incompletedTickets = incompletedTickets + 1;
			}
			project["Progress"] = Math.ceil(100 * totalProgress / (project["Data"].length * 100));
			project["InfoText"] = String(incompletedTickets) + " tickets left";
		}
	}
  }
  openProjectPage(item) {
	  console.log(item);
  }
}
