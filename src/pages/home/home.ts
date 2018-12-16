import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, LoadingController } from 'ionic-angular';
import { DataBase } from '../../service/database/database';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject, SQLiteTransaction } from '@ionic-native/sqlite';

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
  firstRun: any;
  loader: any;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public storage: Storage, public sqlite:SQLite, platform:Platform) {	
	this.projects = [];
	this.loader = null;
	this.firstRun = true;
	
	this.loader = this.loadingCtrl.create({
		content:"Loading...",
	});
	this.loader.present();
	this.database = new DataBase(false, sqlite, platform, () => {
		this.setupProjectList();
	});
  }
  ionViewDidEnter() {
	  if (this.loader && this.firstRun == false) {
		this.setupProjectList();
	  }
  }
  setupProjectList() {
	this.database.getProjectList((rs)=>{
		this.projects = [];
		for(var projidx=0;projidx<rs.rows.length;projidx++) {
			this.projects.push(rs.rows.item(projidx));
		}
		for(var projidx=0;projidx<this.projects.length;projidx++) {
			var project = this.projects[projidx];
			if (project["Type"] == "Period") {
				var startDate = Date.parse(project["StartDate"]);
				var endDate = Date.parse(project["EndDate"]);
				var todayDate = Date.now();
				var duration = (startDate && endDate)?(Math.ceil((endDate - todayDate) / (1000 * 60 * 60 * 24))):0;
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
		this.loader.dismiss();
		this.loader = null;
		this.firstRun = false;
	});
  }
  openProjectPage(item) {
    this.database.getProjectItems(item);
	if (item["Type"] == "Period")
		this.navCtrl.push(PeriodPage, {project: item, database: this.database});
	else if (item["Type"] == "Check")
		this.navCtrl.push(CheckPage, {project: item, database: this.database});
  }
  addProject() {
	var newID = 0;
	for(var i=0;i<this.projects.length;i++) {
		if (this.projects[i].ID && this.projects[i].ID > newID) 
			newID = this.projects[i].ID;
	}
	newID++;
	this.loader = this.loadingCtrl.create({
		content:"Saving...",
	});
	this.navCtrl.push(NewProjectPage, {loader:this.loader, id:newID, database:this.database});
  }
  modifyProject(item) {
	this.loader = this.loadingCtrl.create({
		content:"Adding...",
	});
	this.navCtrl.push(NewProjectPage, {loader:this.loader, database:this.database, project:item});
  }
  removeProject(item) {
	  if (item.ID)
		this.database.removeProject(item.ID);
	  else
		this.database.removeProjectUsingName(item.Name);
	  this.setupProjectList();
  }
}
