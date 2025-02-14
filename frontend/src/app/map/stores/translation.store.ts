import {inject} from '@angular/core';
import {signalStore, withMethods, withState} from '@ngrx/signals';
import {TranslateService} from '@ngx-translate/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';

type TranslationState = {
  currentLang: string;
  headerTranslation: {
    home: string;
    statistics: string;
  }
}

const initialState: TranslationState = {
  currentLang: 'en',
  headerTranslation: {
    home: 'Home',
    statistics: 'Statistics'
  }
}

export const TranslationStore = signalStore(
  withState(initialState),
  withMethods((store, translateService = inject(TranslateService)) => {
    const changeLanguage = (language: string) => {
      return "test";
    };

    const getHeaderTranslations = rxMethod<void>(
      pipe(
        switchMap(() => {
          const keys = Object.keys(store.headerTranslation());
          const translations = keys.map((key) => 'app.' + key);
          return translateService.get(translations);
        }),
        tap((val) => console.log(val))
      )
    );

    return {
      changeLanguage,
      getHeaderTranslations
    }
  })
)
