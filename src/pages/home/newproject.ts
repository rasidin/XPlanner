import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular'

@Component({
	selector: 'page-newproject',
	templateUrl: 'newproject.html',
})
export class NewProjectPage
{
	@ViewChild('Name') Name;
	@ViewChild('Type') Type;
	@ViewChild('Desc') Desc;
	
	db:any;
	constructor(public navParams:NavParams, public navCtrl:NavController) {
		this.db = this.navParams.data.database;
	}
	addProject() {
		this.db.addProject(this.Name.value, this.Type.value[0], this.Desc.value);
		this.navCtrl.pop();
	}
}