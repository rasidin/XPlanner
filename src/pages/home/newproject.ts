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
	
	Title:any;
	OKButtonName:any;
	
	db:any;
	loader:any;
	newID:any;
	project:any;
	constructor(public navParams:NavParams, public navCtrl:NavController) {
		this.db = this.navParams.data.database;
		this.loader = this.navParams.data.loader;
		this.newID = this.navParams.data.id;
		this.project = this.navParams.data.project;
		
		if (this.project)
			this.OKButtonName = 'Update';
		else
			this.OKButtonName = 'Add';
		
		console.log(this.project);
	}
	ngOnInit() {
		if (this.project) {
			this.Title = "Edit project";
			this.Name.value = this.project.Name;
			this.Type.value = this.project.Type;
			this.Desc.value = this.project.Desc;
		} else {
			this.Title = "Add project";
		}
	}
	addProject() {
		this.loader.present();
		if (this.project) {
			this.db.setProject(this.project.ID, this.Name.value, this.Type.value, this.Desc.value);
		} else {
			this.db.addProject(this.newID, this.Name.value, this.Type.value, this.Desc.value);
		}
		this.navCtrl.pop();
	}
}