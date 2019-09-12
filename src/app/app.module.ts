import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DualListboxComponent } from './dual-listbox/dual-listbox.component';
import { ListboxComponent } from './listbox/listbox.component';
import { FilterComponent } from './filter/filter.component';
import { ArrayFilterPipe } from './utils/array-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DualListboxComponent,
    ListboxComponent,
    FilterComponent,
    ArrayFilterPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
