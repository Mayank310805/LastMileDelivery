import { Toaster as HotToaster } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: 'var(--color-surface-900)',
          border: '1px solid var(--color-surface-200)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: 'var(--shadow-md)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success-500)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger-500)',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};
