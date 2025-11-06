import { useAppSelector } from '@javascript/store';
import { NavigationContext } from '@thoughtbot/superglue';
import { useContext, useState } from 'react';

// TODO: This won't work for multiple forms on a single page that go to different URLs, revisit.
export default function useFormSubmitState() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(-1);

  const { pageKey } = useContext(NavigationContext);
  const currentSavedAt = useAppSelector(state => state.pages[pageKey].savedAt);

  if (lastSavedAt !== -1 && currentSavedAt !== lastSavedAt) {
    setLastSavedAt(-1);
    setIsLoading(false);
  }

  const handleSubmit = async (_e) => {
    setLastSavedAt(currentSavedAt);
    setIsLoading(true);
  };

  const handleSubmitProps = {
    onSubmit: handleSubmit,
  };

  return [isLoading, handleSubmitProps];
}
