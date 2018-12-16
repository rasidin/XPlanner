import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject, SQLiteTransaction } from '@ionic-native/sqlite';

interface DataTableInterface {
	getProjectList(inputFunc):any;
	getProjectItems(id, resultFunc):any;
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

export class SqliteDataTable implements DataTableInterface {
	projects: any;
	db: any;
	constructor(public sqlite:SQLite, public platform:Platform) {
	}
	readyDatabase(readyFunc) {
		this.platform.ready().then(()=>{
			this.sqlite.create({
				name:'xplanner.db',
				location:'default',
			}).then((db: SQLiteObject)=>{
				this.db = db;
				this.db.transaction((tr: SQLiteTransaction) => {
					tr.executeSql('create table if not exists projects(ID integer primary key autoincrement, SortOrder integer, Name text, Type text, Desc text, ItemCount integer, CompleteItemCount integer, StartDate text, EndDate text)', [], () => {
						readyFunc();
					}, (tr, e)=>{alert('create table error' + e.message);});
					tr.executeSql('create table if not exists perioditems(ID integer primary key autoincrement, ParentID integer, Name text, SortOrder integer, Category text, Memo text, StartDate text, EndDate text)', [], 
					()=> {}, (tr, e)=>{alert('create table error' + e.message);});
					tr.executeSql('create table if not exists checkitems(ID integer primary key autoincrement, ParentID integer, Name text, SortOrder integer, Category text, Memo text, Checked text)', [],
					null, (tr, e)=>{alert('create table error' + e.message);});
				});
			});
		});
	}
	getProjectList(inputFunc) {
		if (this.db == null)
			return;
		this.db.transaction((tx:SQLiteTransaction)=>{
			tx.executeSql('select * from projects', null, (tx: SQLiteTransaction,rs)=>{
				inputFunc(rs);
			});
		});
		return this.projects;
	}
	getProjectItems(project, resultFunc) {
		if (this.db == null)
			return;
		if (project.Type == "Period") {
			this.db.transaction((tx:SQLiteTransaction)=>{
				tx.executeSql('select * from perioditems where ParentID = ?', [project.ID], (tx: SQLiteTransaction, rs)=>{
					resultFunc(rs);
				});
			});
		} else if (project.Type == "Check") {
			this.db.transaction((tx:SQLiteTransaction)=>{
				tx.executeSql('select * from checkitems where ParentID = ?', [project.ID], (tx: SQLiteTransaction, rs)=>{
					resultFunc(rs);
				});
			});
		}
	}
	addProject(id, name, type, desc) {
		this.db.transaction((tx: SQLiteTransaction) => {
			tx.executeSql('insert or replace into projects(ID, Name, Type) values(?, ?, ?)', [id, name, type], ()=>{
			}, (tx, e)=>{alert('insert error ' + e.message);});
		});
	}
	setProject(ID, name, type, desc) {
		this.db.transaction((tx: SQLiteTransaction) => {
			tx.executeSql('update projects set Name = ? where ID = ?', [name, ID], ()=>{
			}, (tx, e)=>{alert('insert error ' + e.message);});
		});
	}
	removeProject(ID) {
		this.db.transaction((tx: SQLiteTransaction) => {
			tx.executeSql('delete from projects where ID = ?', [ID], ()=>{},
			(tx, e)=>{alert('remove projects error ' + e.message);});
		});
	}
	removeProjectUsingName(name) {
		this.db.transaction((tx: SQLiteTransaction) => {
			tx.executeSql('delete from projects where Name = ?', [name], ()=>{},
			(tx, e)=>{alert('remove projects error ' + e.message);});
		});
	}
	addItem(project, name, category, startdate, enddate) {
		var itemNum = project.Data?project.Data.length:0;
		if (project.Type == "Period") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('insert or replace into perioditems(ParentID, Name, Category, StartDate, EndDate) values(?, ?, ?, ?, ?)', [project.ID, name, category, startdate, enddate],
				() => {},
				(tr, e)=>{alert('add item error' + e.message);});
			});
		} else if (project.Type == "Check") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('insert or replace into checkitems(ParentID, Name, Category, Checked) values(?, ?, ?, "False")', [project.ID, name, category],
				() => {},
				(tr, e)=>{alert('add item error' + e.message);});
			});
		} else if (project.Type == "Ticket") {
		}
	}
	setItem(project, ID, name, category, startdate, enddate) {
		if (project.Type == "Period") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('update perioditems set Name = ?, Category = ?, StartDate = ?, EndDate =? where ID = ?', [name, category, startdate, enddate, ID],
				() => {},
				(tr, e)=>{alert('set item error' + e.message);});
			});			
		} else if (project.Type == "Check") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('update checkitems set Name = ?, Category = ? where ID = ?', [name, category, ID],
				() => {},
				(tr, e)=>{alert('set item error' + e.message);});
			});						
		}
	}
	checkItem(project, ID, checked) {
		if (project.Type == "Check") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('update checkitems set Checked = ? where ID = ?', [checked, ID],
				() => {},
				(tr, e)=>{alert('check item error' + e.message);});
			});									
		}
	}
	removeItem(project, ID) {
		if (project.Type == "Period") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('delete from perioditems where ID = ?', [ID],
				() => {},
				(tr, e)=>{alert('remove item error' + e.message);});
			});
		} else if (project.Type == "Check") {
			this.db.transaction((tx: SQLiteTransaction) => {
				tx.executeSql('delete from checkitems where ID = ?', [ID],
				() => {},
				(tr, e)=>{alert('remove item error' + e.message);});
			});			
		}
	}
	getJSONString() {
		return '';
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
	{
		"ID":2,
		"SortOrder":2,
		"Name":"TestCheck",
		"Type":"Check", 
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
		"ID":1,
		"ParentID":1,
		"Name":"TestItem0",
		"SortOrder":1,
		"Category":"TestCategory",
		"StartDate":"2018-10-01",
		"EndDate":"2020-03-02",
	},
	];
	checkitems = [
	{
		"ID":2,
		"ParentID":2,
		"Name":"TestCheck0",
		"SortOrder":1,
		"Category":"TestCategory",
		"Checked":false,
	},
	];
	getProjectList(inputFunc) {
		return this.projects;
	}
	getProjectItems(id, func) {
		// project.Data = [];
		// if (project.Type == "Period") {
			// for (var piidx=0;piidx<this.perioditems.length;piidx++) {
				// var piitem = this.perioditems[piidx];
				// if (piitem.ParentID == project.ID) {
					// project.Data.push(piitem);
				// }
			// }
		// }
		// if (project.Type == "Check") {
			// for (var piidx=0;piidx<this.checkitems.length;piidx++) {
				// var chitem = this.checkitems[piidx];
				// if (chitem.ParentID == project.ID) {
					// project.Data.push(chitem);
				// }
			// }
		// }
	}
	addProject(name, type, desc) {
		var newID = this.projects.length>0?(this.projects[this.projects.length-1].ID + 1):1;
		var datetext = DateFilter.filter(new Date());
		this.projects.push({
			"ID":newID,
			"SortOrder":this.projects.length,
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
	setProject(ID, name, type, desc) {
		for(var projIdx=0;projIdx<this.projects.length;projIdx++) {
			if (this.projects[projIdx].ID == ID) {
				this.projects[projIdx].Name = name;
				this.projects[projIdx].Type = type;
				this.projects[projIdx].Desc = desc;
				console.log(this.projects[projIdx]);
				return;
			}
		}
	}
	removeProject(ID) {
		for(var projIdx=0;projIdx<this.projects.length;projIdx++) {
			if (this.projects[projIdx].ID == ID) {
				this.projects.splice(projIdx, 1);
				console.log('Removed project');
				return;
			}
		}
	}
	addItem(project, name, category, startdate, enddate) {
		var itemNum = project.Data?project.Data.length:0;
		if (project.Type == "Period") {
			var newPeriodID = this.perioditems.length>0?this.perioditems[this.perioditems.length-1].ID:1;
			this.perioditems.push({
				"ID":newPeriodID,
				"ParentID":project.ID,
				"SortOrder":itemNum,
				"Name":name,
				"Category":category,
				"StartDate":startdate,
				"EndDate":enddate,
			});
		} else if (project.Type == "Check") {
			var newCheckID = this.checkitems.length>0?this.checkitems[this.checkitems.length-1].ID:1;
			this.checkitems.push({
				"ID":newCheckID,
				"ParentID":project.ID,
				"SortOrder":itemNum,
				"Name":name,
				"Category":category,
				"Checked":false,
			});
		} else if (project.Type == "Ticket") {
		}
	}
	setItem(project, ID, name, category, startdate, enddate) {
		if (project.Type == "Period") {
			for(var itemidx=0;itemidx<this.perioditems.length;itemidx++) {
				if (this.perioditems[itemidx].ID == ID) {
					this.perioditems[itemidx].Name = name;
					this.perioditems[itemidx].Category = category;
					this.perioditems[itemidx].StartDate = startdate;
					this.perioditems[itemidx].EndDate = enddate;
				}
			}
		} else if (project.Type == "Check") {
			for(var itemidx=0;itemidx<this.checkitems.length;itemidx++) {
				if (this.checkitems[itemidx].ID == ID) {
					this.checkitems[itemidx].Name = name;
					this.checkitems[itemidx].Category = category;
				}
			}
		}
	}
	removeItem(project, ID) {
		if (project.Type == "Period") {
			for(var itemidx=0;itemidx<this.perioditems.length;itemidx++) {
				if (this.perioditems[itemidx].ID == ID) {
					this.perioditems.splice(itemidx, 1);
					break;
				}
			}
		} else if (project.Type == "Check") {
			for(var itemidx=0;itemidx<this.checkitems.length;itemidx++) {
				if (this.checkitems[itemidx].ID == ID) {
					this.checkitems.splice(itemidx, 1);
					break;
				}
			}
		}
	}
	getJSONString() {
		return JSON.stringify(this);
	}
}

export class DataBase {
	DataTable: any;
	
	constructor(testMode=false, sqlite=null, platform=null, postLoad=null) {
		if (testMode) {
			this.DataTable = new TestDataTable();
		} else {
			this.DataTable = new SqliteDataTable(sqlite, platform);
			this.DataTable.readyDatabase(postLoad);
		}
	}
	getProjectList(inputFunc) {
		return this.DataTable.getProjectList(inputFunc);
	}
	getProjectItems(project, func) {
		return this.DataTable.getProjectItems(project, func);
	}
	addProject(id, name, type, desc) {
		this.DataTable.addProject(id, name, type, desc);
	}
	setProject(ID, name, type, desc) {
		this.DataTable.setProject(ID, name, type, desc);
	}
	removeProject(ID) {
		this.DataTable.removeProject(ID);
	}
	removeProjectUsingName(name) {
		this.DataTable.removeProjectUsingName(name);
	}
	addItem(project, name, category, startdate, enddate) {
		this.DataTable.addItem(project, name, category, startdate, enddate);
	}
	setItem(project, ID, name, category, startdate, enddate) {
		this.DataTable.setItem(project, ID, name, category, startdate, enddate);
	}
	checkItem(project, ID, checked) {
		this.DataTable.checkItem(project, ID, checked);
	}
	removeItem(project, ID) {
		this.DataTable.removeItem(project, ID);
	}
	printJSON() {
		console.log(this.DataTable.getJSONString());
	}
}