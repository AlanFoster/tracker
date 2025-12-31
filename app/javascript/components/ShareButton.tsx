import { Button } from '@mui/material';
import React, { useState } from 'react';

interface CopyButtonProps {
  onShare: () => string;
  disabled?: boolean;
  label?: string;
}

export default function ShareButton({ onShare, disabled = false, label = 'Share' }: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const shareText = onShare();
      await navigator.clipboard.writeText(shareText);
      setCopied(true); // show "Copied!"
      setTimeout(() => setCopied(false), 2000);
    }
    catch (err) {
      console.error('Failed to copy:', err);
    }
    finally {
      setIsCopying(false);
    }
  };

  return (
    <Button variant="outlined" onClick={handleCopy} disabled={isCopying || disabled}>
      {isCopying ? 'Copying...' : copied ? 'Copied!' : label}
    </Button>
  );
}
