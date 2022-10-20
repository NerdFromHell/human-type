import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextComponent } from './components/text/text.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CalculateComponent } from './components/calculate/calculate.component';


const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'cal', component: CalculateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
