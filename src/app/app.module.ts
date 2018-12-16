import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewProjectPage } from '../pages/home/newproject';
import { PeriodPage } from '../pages/period/period';
import { NewPeriodPage } from '../pages/period/newperiod';
import { CheckPage } from '../pages/check/check';
import { NewCheckPage } from '../pages/check/newcheck';
import { ProgressBarComponent } from '../components/progressbar/progressbar'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
	NewProjectPage,
	PeriodPage,
	NewPeriodPage,
	CheckPage,
	NewCheckPage,
	ProgressBarComponent
  ],
  imports: [
    BrowserModule,
	IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	NewProjectPage,
	PeriodPage,
	NewPeriodPage,
	CheckPage,
	NewCheckPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
	SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
