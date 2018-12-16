import { Component, ViewChild } from '@angular/core';
import { AlertController, NavParams, NavController } from 'ionic-angular';

@Component({
	selector: 'page-newcheck',
	templateUrl: 'newcheck.html',	
})
export class NewCheckPage
{
	@ViewChild('Name') nameVC;
	@ViewChild('CategorySelect') categorySelect;
	@ViewChild('Desc') descVC;
	
	database: any;
	project: any;
	categories: any;
	item:any;
	loader:any;
	constructor(public navParams:NavParams, public navCtrl:NavController, public alertCtrl:AlertController) {
		this.database = navParams.data.database;
		this.project = navParams.data.project;
		this.categories = navParams.data.categories;
		this.item = navParams.data.checkItem;
		this.loader = navParams.data.loader;
	}
	ngOnInit() {
		if (this.item) {
			this.nameVC.value = this.item.Name;
			this.categorySelect.value = this.item.Category;
			this.descVC.value = this.item.Desc;
		}
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
						this.categorySelect.value = data.Name;
						this.categorySelect.selectedText = data.Name;
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
	addCheck() {
		this.loader.present();
		if (this.item) {
			this.database.setItem(this.project, this.item.ID, this.nameVC.value, this.categorySelect.value, this.descVC.value);
		} else {
			this.database.addItem(this.project, this.nameVC.value, this.categorySelect.value, this.descVC.value);
		}
		this.navCtrl.pop();
	}
}