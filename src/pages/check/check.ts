import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewCheckPage } from '../check/newcheck';

@Component({
	selector: 'page-check',
	templateUrl: 'check.html',
})
export class CheckPage {
	totalProgress: any;
	project: any;
	items: any;
	categories: any;
	
	constructor(public navCtrl:NavController, public navParams:NavParams) {
		this.totalProgress = 0;
		this.project = this.navParams.data.project;
		this.items = this.project.Data;
		this.categories = [];
		this.setupData()		
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
				checkedCount += category.Data[itidx]["Checked"]?1:0;
				totalCheckedCount += category.Data[itidx]["Checked"]?1:0;
				totalCheckCount++;
			}
			category.Progress = Math.round(checkedCount * 100 / category.Data.length);
		}
		this.totalProgress = Math.round(100 * totalCheckedCount / totalCheckCount);
	}
	addCheck() {
		var categoryNames = [];
		for(var cateidx=0;cateidx<this.categories.length;cateidx++) {
			categoryNames.push(this.categories[cateidx]["Name"]);
		}
		this.navCtrl.push(NewCheckPage, {Categories:categoryNames});
	}
}