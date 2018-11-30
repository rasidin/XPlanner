import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { DateFilter } from '../../service/database/database';

@Component({
	selector: 'page-newperiod',
	templateUrl: 'newperiod.html',
})
export class NewPeriodPage {
	@ViewChild('Name') NameVC;
	@ViewChild('CategorySelect') CategoryVC;
	@ViewChild('Begin') BeginVC;
	@ViewChild('End') EndVC;
	
	database: any;
	categories: any;
	project: any;
	constructor(public navCtrl:NavController, public navParams:NavParams, public alertCtrl:AlertController)
	{
		this.database = this.navParams.data.database;
		this.project = this.navParams.data.project;
		this.categories = this.navParams.data.categories;
	}
	ngOnInit() {
		this.BeginVC.value = DateFilter.filter(new Date());
		this.EndVC.value = DateFilter.filter(new Date());
	}
	onCategoryChange(event) {
		if (event == "Add category") {
			const prompt = this.alertCtrl.create({
				title: 'Add category',
				message: 'Type new category name',
				inputs: [
				{
					name: 'Name'
				},
				],
				buttons: [
				{
					text: 'Add',
					handler: data=>{
						this.categories.push(data.Name);
						this.CategoryVC.value = data.Name;
						this.CategoryVC.selectedText = data.Name;
					}
				},
				{
					text: 'Cancel',
				}
				]
			});
			prompt.present();
		}
	}
	addPeriod() {
		this.database.addItem(this.project, this.NameVC.value, this.CategoryVC.value, this.BeginVC.value, this.EndVC.value);
		this.navCtrl.pop();
	}
}