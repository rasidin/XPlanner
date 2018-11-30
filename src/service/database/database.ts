import { DatePipe } from '@angular/common';

interface DataTableInterface {
	getProjectList():any;
	getProjectItems(project):any;
	getJSONString():any;
}

export class DateFilter {
	static filter(date) {
		var year = date.getYear();
		var month = date.getMonth();
		var day = date.getDay();
		return '' + (year + 1900) + '-' + (month<10?('0'+month):month) + '-' + (day<10?('0'+day):day);
	}
}

export class TestDataTable implements DataTableInterface {
	projects = [
	{
		"ID":1,
		"SortOrder":1,
		"Name":"TestPeriod", 
		"Type":"Period", 
		"Progress":0,
		"ItemCount":1,
		"CompleteItemCount":0,
		"Desc":"",
		"StartDate":"2018-01-20",
		"EndDate":"2019-02-23",
	},
	];
	perioditems = [
	{
		"ParentID":1,
		"Name":"TestItem0",
		"Category":"TestCategory",
		"StartDate":"2018-10-01",
		"EndDate":"2020-03-02",
	},
	];
	getProjectList() {
		return this.projects;
	}
	getProjectItems(project) {
		project.Data = [];
		if (project.Type == "Period") {
			for (var piidx=0;piidx<this.perioditems.length;piidx++) {
				var piitem = this.perioditems[piidx];
				if (piitem.ParentID == project.ID) {
					project.Data.push(piitem);
				}
			}
		}
	}
	addProject(name, type, desc) {
		var newID = this.projects[this.projects.length-1].ID + 1;
		var datetext = DateFilter.filter(new Date());
		this.projects.push({
			"ID":newID,
			"SortOrder":this.project.length,
			"Name":name,
			"Type":type,
			"Desc":desc,
			"Progress":0,
			"ItemCount":0,
			"CompleteItemCount":0,
			"StartDate":datetext,
			"EndDate":datetext,
		});
	}
	addItem(project, name, category, startdate, enddate) {
		if (project.Type == "Period") {
			this.perioditems.push({
				"ParentID":project.ID,
				"SortOrder":project.Data.length,
				"Name":name,
				"Category":category,
				"StartDate":startdate,
				"EndDate":enddate,
			});
		} else if (project.Type == "Check") {
		} else if (project.Type == "Ticket") {
		}
	}
	getJSONString() {
		return JSON.stringify(this);
	}
}

export class DataBase {
	DataTable: any;
	
	constructor(testMode=false) {
		if (testMode) {
			this.DataTable = new TestDataTable();
		}
	}
	getProjectList() {
		return this.DataTable.getProjectList();
	}
	getProjectItems(project) {
		return this.DataTable.getProjectItems(project);
	}
	addProject(name, type, desc) {
		this.DataTable.addProject(name, type, desc);
		this.printJSON();
	}
	addItem(project, name, category, startdate, enddate) {
		this.DataTable.addItem(project, name, category, startdate, enddate);
		this.getProjectItems(project);
		this.printJSON();
	}
	printJSON() {
		console.log(this.DataTable.getJSONString());
	}
}