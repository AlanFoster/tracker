import UserSessionsIndex from '@views/user_sessions/new';
import RedirectToRoot from '@javascript/components/RedirectToRoot'

const pageIdentifierToPageComponent = {
  'user_sessions/new': UserSessionsIndex,
  // Force a full refresh after successfully acquiring a new user_session
  'sessions/index': RedirectToRoot
};

export { pageIdentifierToPageComponent }
