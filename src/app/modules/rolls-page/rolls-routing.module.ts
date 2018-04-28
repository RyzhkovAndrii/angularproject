import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  RollsPageComponent
} from './rolls-page.component';

const rollsRoutes: Routes = [{
  path: '',
  component: RollsPageComponent
}]

@NgModule({
  imports: [RouterModule.forChild(rollsRoutes)],
  exports: [RouterModule]
})
export class RollsRouting {}
