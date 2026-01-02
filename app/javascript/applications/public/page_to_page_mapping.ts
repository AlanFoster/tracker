import RedirectToRoot from '@javascript/components/RedirectToRoot';
import PagesHome from '@views/pages/home';
import PagesPrivacy from '@views/pages/privacy';
import PagesTerms from '@views/pages/terms';
import UserSessionsIndex from '@views/user_sessions/new';

const pageIdentifierToPageComponent = {
  'user_sessions/new': UserSessionsIndex,

  // Public pages
  'pages/home': PagesHome,
  'pages/privacy': PagesPrivacy,
  'pages/terms': PagesTerms,

  // Force a full refresh after successfully acquiring a new user_session
  'sessions/index': RedirectToRoot,
};

export { pageIdentifierToPageComponent };
