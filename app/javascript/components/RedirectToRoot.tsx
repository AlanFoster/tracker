import { useEffect } from 'react';

export default function RedirectToRoot() {
  useEffect(() => {
    window.location.href = '/'
  });

  return null; // nothing to render
}
