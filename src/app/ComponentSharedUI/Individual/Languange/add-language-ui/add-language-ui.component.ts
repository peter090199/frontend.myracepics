import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-language-ui',
  templateUrl: './add-language-ui.component.html',
  styleUrls: ['./add-language-ui.component.css']
})
export class AddLanguageUIComponent {
  constructor(private dataService: ProfessionalService,
    private alert: NotificationsService, private languageService: CurriculumVitaeService
  ) {

  }
  separatorKeysCodes: number[] = [ENTER, COMMA];
  languageCtrl = new FormControl('');
  languages: string[] = [];
  allLanguages: string[] = [
    'Afrikaans',
    'Albanian',
    'Amharic',
    'Arabic',
    'Armenian',
    'Azerbaijani',
    'Basque',
    'Belarusian',
    'Bengali',
    'Bosnian',
    'Bulgarian',
    'Burmese',
    'Catalan',
    'Chinese',
    'Croatian',
    'Czech',
    'Danish',
    'Dutch',
    'English',
    'Esperanto',
    'Estonian',
    'Filipino',
    'Finnish',
    'French',
    'Georgian',
    'German',
    'Greek',
    'Gujarati',
    'Haitian Creole',
    'Hausa',
    'Hebrew',
    'Hindi',
    'Hungarian',
    'Icelandic',
    'Igbo',
    'Indonesian',
    'Irish',
    'Italian',
    'Japanese',
    'Javanese',
    'Kannada',
    'Kazakh',
    'Khmer',
    'Korean',
    'Kurdish',
    'Kyrgyz',
    'Lao',
    'Latvian',
    'Lithuanian',
    'Macedonian',
    'Malay',
    'Malayalam',
    'Maltese',
    'Maori',
    'Marathi',
    'Mongolian',
    'Nepali',
    'Norwegian',
    'Pashto',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Romanian',
    'Russian',
    'Serbian',
    'Sinhalese',
    'Slovak',
    'Slovenian',
    'Somali',
    'Spanish',
    'Swahili',
    'Swedish',
    'Tagalog',
    'Tamil',
    'Telugu',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Uzbek',
    'Vietnamese',
    'Welsh',
    'Xhosa',
    'Yiddish',
    'Yoruba',
    'Zulu'
  ];



  @Output() saveData = new EventEmitter<string[]>(); // Output event for Save button

  filteredLanguages = this.languageCtrl.valueChanges.pipe(
    startWith(null),
    map((language: string | null) =>
      language ? this._filter(language) : this.allLanguages.slice()
    )
  );

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the language
    if (value && !this.languages.includes(value)) {
      this.languages.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.languageCtrl.setValue(null);
  }

  remove(language: string): void {
    const index = this.languages.indexOf(language);

    if (index >= 0) {
      this.languages.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.languages.includes(value)) {
      this.languages.push(value);
    }
    this.languageCtrl.setValue(null);
  }

  save(): void {
    const languages = this.languages.map(language => ({ language }));
    this.languageService.saveLanguages(languages).subscribe({
      next: (res) => {
        this.alert.toastrSuccess(res.message);
        this.resetForm(); // ✅ Move reset after success
        //console.log('✅ Saved languages:', res);
      },
      error: (err) => {
      }
    });
  }
  resetForm(): void {
    this.languages = [];  // Clear selected skills
    this.languageCtrl.setValue('');  // Clear the input field
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allLanguages.filter(language => language.toLowerCase().includes(filterValue));
  }
}
