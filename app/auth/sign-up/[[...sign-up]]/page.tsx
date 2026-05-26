import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
    }}>
      <SignUp 
        appearance={{
          elements: {
            rootBox: { margin: '0 auto' },
            card: {
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
            },
            formButtonPrimary: {
              backgroundColor: '#1a1a1a',
              fontSize: '14px',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px',
            },
          },
        }}
      />
    </div>
  );
}
