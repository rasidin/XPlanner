import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { NewCheckPage } from '../check/newcheck';

@Component({
	selector: 'page-check',
	templateUrl: 'check.html',
})
export class CheckPage {
	totalProgress: any;
	database: any;
	project: any;
	items: any;
	categories: any;
	loader: any;
	firstRun: any;
	
	constructor(public navCtrl:NavController, public navParams:NavParams, public loadingCtrl: LoadingController) {
		this.totalProgress = 0;
		this.database = this.navParams.data.database;
		this.project = this.navParams.data.project;
		
		this.firstRun = true;
		this.createLoader('Loading...');
		this.setupList();
	}
	ionViewWillEnter() {
		if (this.loader && this.firstRun == false)
			this.setupList();
	}
	createLoader(text) {
		this.loader = this.loadingCtrl.create({
			content:text,
		});
	}
	findCategory(name) {
		for(var catidx=0;catidx<this.categories.length;catidx++) {
			if (this.categories[catidx]["Name"] == name) {
				return this.categories[catidx];
			}
		}
		this.categories.push({
			"Name":name,
			"Data":[],
		});
		return this.categories[this.categories.length-1];
	}
	setupList() {
		this.database.getProjectItems(this.project, (rs)=>{
			this.project.Data = [];
			for(var projidx=0;projidx<rs.rows.length;projidx++) {
				this.project.Data.push(rs.rows.item(projidx));
			}
			this.items = this.project.Data;
			this.categories = [];
			this.setupData();
			this.loader.dismiss();
			this.loader = null;
			this.firstRun = false;
		});
	}
	setupData() {
		if (this.items == null || this.items.length == 0)
			return;
		
		var category = null;
		for(var itemidx=0;itemidx<this.items.length;itemidx++) {
			category = this.findCategory(this.items[itemidx]["Category"]);
			category.Data.push(this.items[itemidx]);
		}
		var totalCheckedCount = 0;
		var totalCheckCount = 0;
		for(var cateidx=0;cateidx<this.categories.length;cateidx++) {
			category = this.categories[cateidx];
			var checkedCount = 0;
			for(var itidx=0;itidx<category.Data.length;itidx++) {
				checkedCount += (category.Data[itidx]["Checked"] == "true")?1:0;
				totalCheckedCount += (category.Data[itidx]["Checked"] == "true")?1:0;
				totalCheckCount++;
			}
			category.Progress = Math.round(checkedCount * 100 / category.Data.length);
		}
		this.totalProgress = Math.round(100 * totalCheckedCount / totalCheckCount);
	}
	addCheck() {
		this.createLoader('Adding...');
		var categoryNames = [];
		for(var cateidx=0;cateidx<this.categories.length;cateidx++) {
			categoryNames.push(this.categories[cateidx]["Name"]);
		}
		this.navCtrl.push(NewCheckPage, {loader:this.loader, categories:categoryNames, database:this.database, project:this.project});
	}
	modifyItem(item) {
		this.createLoader('Updating...');
		var categoryNames = [];
		for(var cateidx=0;cateidx<this.categories.length;cateidx++) {
			categoryNames.push(this.categories[cateidx]["Name"]);
		}
		this.navCtrl.push(NewCheckPage, {loader:this.loader, categories:categoryNames, database:this.database, project:this.project, checkItem:item});
	}
	removeItem(item) {
		this.database.removeItem(this.project, item.ID);
		this.setupList();
	}
	updateChecked(event, item) {
		item.Checked = event.value?"true":"false";
		this.database.checkItem(this.project, item.ID, item.Checked);
	}
}