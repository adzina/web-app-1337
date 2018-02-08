import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app.module';


import 'jquery/dist/jquery.js';


//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.js'

platformBrowserDynamic().bootstrapModule(AppModule);
