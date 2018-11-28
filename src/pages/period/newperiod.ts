import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-newperiod',
	templateUrl: 'newperiod.html',
})
export class NewPeriodPage {
	@ViewChild('Title') TitleVC;
	@ViewChild('Begin') BeginVC;
	@ViewChild('End') EndVC;
	
	project: any;
	constructor(public navCtrl:NavController, public navParams:NavParams)
	{
		this.project = this.navParams.data.project;
	}
	ngOnInit() {
		var todayDate = Date.now();
		this.BeginVC.value = todayDate;
		console.log(this.BeginVC.value);
	}
	addPeriod() {
		if (this.project) {
			this.project.Data.push({
			"Title":this.TitleVC.value,
			"StartDate":this.BeginVC.value,
			"EndDate":this.EndVC.value,
			});
		}
		this.navCtrl.pop();
	}
}