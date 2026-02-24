import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localBn from '@angular/common/locales/bn';

registerLocaleData(localBn);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
