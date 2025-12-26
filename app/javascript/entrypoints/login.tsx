import type { SaveResponse } from '@thoughtbot/superglue';
import { buildVisitAndRemote } from '@javascript/applications/login/application_visit';
import { pageIdentifierToPageComponent } from '@javascript/applications/login/page_to_page_mapping';
import { store } from '@javascript/applications/login/store';
import { Application } from '@thoughtbot/superglue';
import React from 'react';
import { createRoot } from 'react-dom/client';

declare global {
  interface Window {
    SUPERGLUE_INITIAL_PAGE_STATE: SaveResponse;
  }
}

if (typeof window !== 'undefined' && window.SUPERGLUE_INITIAL_PAGE_STATE) {
  document.addEventListener('DOMContentLoaded', () => {
    const appEl = document.getElementById('app');
    const location = window.location;

    if (appEl) {
      const root = createRoot(appEl);
      root.render(
        <Application
          // The base url prefixed to all calls made by the `visit`
          // and `remote` thunks.
          baseUrl={location.origin}
          // The global var SUPERGLUE_INITIAL_PAGE_STATE is set by your erb
          // template, e.g., index.html.erb
          initialPage={window.SUPERGLUE_INITIAL_PAGE_STATE}
          // The initial path of the page, e.g., /foobar
          path={location.pathname + location.search + location.hash}
          // Callback used to setup visit and remote
          buildVisitAndRemote={buildVisitAndRemote}
          // Callback used to setup the store
          store={store}
          // Mapping between the page identifier to page component
          mapping={pageIdentifierToPageComponent}
        />,
      );
    }
  });
}
