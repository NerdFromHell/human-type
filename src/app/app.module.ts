import { TextService } from 'src/app/Services/text.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextComponent } from './components/text/text.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CalculateComponent } from './components/calculate/calculate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    MainPageComponent,
    CalculateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  providers: [TextService],
  bootstrap: [AppComponent]
})
export class AppModule { }
