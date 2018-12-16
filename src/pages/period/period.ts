import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NewPeriodPage } from '../period/newperiod';

@Component({
	selector: 'page-period',
	templateUrl: 'period.html',
})
export class PeriodPage {
	project: any;
	database: any;
	items: any;
	loader: any;
	firstRun: any;
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
		this.project = this.navParams.data.project;
		this.database = this.navParams.data.database;
		this.firstRun = true;
		
		this.createLoader('Loading...');
		this.loader.present();
		this.setupData();
	}
	ionViewWillEnter() {
		if(this.firstRun == false && this.loader)
			this.setupData();
	}
	createLoader(text) {
		this.loader = this.loadingCtrl.create({
			content: text,
		}); 
	}
	setupData() {
		this.database.getProjectItems(this.project, (rs)=>{
			this.project.Data = [];
			for(var projidx=0;projidx<rs.rows.length;projidx++) {
				this.project.Data.push(rs.rows.item(projidx));
			}
			
			this.items = this.project.Data;

			if (this.items == null) return;
			var todayDate = Date.now();
			for(var itemidx=0;itemidx<this.items.length;itemidx++) {
				var item = this.items[itemidx];
				item.StartDateObj = new Date(Date.parse(item["StartDate"]));
				item.EndDateObj = new Date(Date.parse(item["EndDate"]));
				
				var duration = Math.ceil((item.EndDateObj - item.StartDateObj)  / (1000 * 60 * 60 * 24));
				var leftDays = Math.ceil((item.EndDateObj - todayDate)  / (1000 * 60 * 60 * 24));
				
				// Info line 0
				item.InfoTexts = [];
				
				if (leftDays < 0) {
					item.InfoTexts.push("Complete");
					item.Progress = 100;
				}
				else if (item.StartDateObj > todayDate) {
					item.InfoTexts.push("Not in progress");
					item.Progress = 0;
				}
				else {
				item.InfoTexts.push("" + leftDays + " days left");			
					item.Progress = Math.ceil(leftDays * 100 / duration);
				}
			}
			this.loader.dismiss();
			this.loader = null;
			this.firstRun = false;
		});
	}
	addPeriod() {
		this.createLoader('Adding...'); 
		var categoryList = [];
		for (var itemidx=0;itemidx<this.items.length;itemidx++) {
			if (!(this.items[itemidx].Category in categoryList))
				categoryList.push(this.items[itemidx].Category);
		}
		this.navCtrl.push(NewPeriodPage, {loader:this.loader, project:this.project, categories:categoryList, database:this.database});
	}
	modifyPeriod(item) {
		this.createLoader('Updaing...'); 
		var categoryList = [];
		for (var itemidx=0;itemidx<this.items.length;itemidx++) {
			if (!(this.items[itemidx].Category in categoryList))
				categoryList.push(this.items[itemidx].Category);
		}
		this.navCtrl.push(NewPeriodPage, {loader:this.loader, project:this.project, categories:categoryList, database:this.database, perioditem:item});
	}
	removePeriod(item) {
		this.database.removeItem(this.project, item.ID);
		this.setupData();
	}
}