import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewPeriodPage } from '../period/newperiod';

@Component({
	selector: 'page-period',
	templateUrl: 'period.html',
})
export class PeriodPage {
	project: any;
	database: any;
	items: any;
	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.project = this.navParams.data.project;
		this.database = this.navParams.data.database;
		this.items = this.project.Data;
		
		this.setupDate();
	}
	ionViewWillEnter() {
		this.database.getProjectItems(this.project);
		this.setupDate();
	}	
	setupDate() {
		if (this.items == null) return;
		console.log(this.items);
		var todayDate = Date.now();
		for(var itemidx=0;itemidx<this.items.length;itemidx++) {
			var item = this.items[itemidx];
			item.StartDateObj = new Date(Date.parse(item["StartDate"]));
			item.EndDateObj = new Date(Date.parse(item["EndDate"]));
			
			var duration = Math.ceil((item.EndDateObj - item.StartDateObj)  / (1000 * 60 * 60 * 24));
			var leftDays = Math.ceil((item.EndDateObj - todayDate)  / (1000 * 60 * 60 * 24));
			
			// Info line 0
			item.InfoTexts = [];
			item.InfoTexts.push("" + leftDays + " days left");			
			
			if (leftDays < 0)
				item.Progress = 100;
			else if (item.StartDateObj > todayDate)
				item.Progress = 0;
			else 
				item.Progress = Math.ceil(leftDays * 100 / duration);
		}
	}
	addPeriod() {
		var categoryList = [];
		for (var itemidx=0;itemidx<this.items.length;itemidx++) {
			if (!(this.items[itemidx].Category in categoryList))
				categoryList.push(this.items[itemidx].Category);
		}
		this.navCtrl.push(NewPeriodPage, {project:this.project, categories:categoryList, database:this.database});
	}
}