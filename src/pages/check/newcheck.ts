import { Component, ViewChild } from '@angular/core';
import { AlertController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-newcheck',
	templateUrl: 'newcheck.html',	
})
export class NewCheckPage
{
	@ViewChild('CategorySelect') categorySelect;
	
	categories: any;
	constructor(public navParams:NavParams, public alertCtrl:AlertController) {
		this.categories = navParams.data.Categories;
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
}