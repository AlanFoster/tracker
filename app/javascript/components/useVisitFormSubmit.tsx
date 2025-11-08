import { NavigationContext } from '@thoughtbot/superglue';
import { useContext, useState } from 'react';

export default function useVisitFormSubmit() {
  const useSuperglueAttributes = false;

  if (useSuperglueAttributes) {
    const isLoading = false;
    const formProps = {
      'data-sg-visit': true,
    };
    return [isLoading, formProps] as const;
  }
  else {
    const [isLoading, setIsLoading] = useState(false);
    const { visit, pageKey } = useContext(NavigationContext);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const form = event.target as HTMLElement;
      const url = form.getAttribute('action');
      const method = (form.getAttribute('method') || 'POST').toUpperCase();

      visit(url, {
        method,
        body: new FormData(form),
        pageKey,
        // dataset: {
        //   sgRemote: 'true',
        // },
      }).finally(() => {
        setIsLoading(false);
      });
    };

    const handleSubmitProps = {
      onSubmit: handleSubmit,
    };

    return [isLoading, handleSubmitProps] as const;
  }
}
