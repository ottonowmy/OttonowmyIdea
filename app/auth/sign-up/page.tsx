import { SignUp } from '@clerk/nextjs';
import styles from '../auth.module.css';

export default function SignUpPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h1>S'inscrire</h1>
          <SignUp
            path="/auth/sign-up"
            routing="path"
            fallbackRedirectUrl="/auth/setup"
            appearance={{
              elements: {
                rootBox: { width: '100%' },
                card: {
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                },
                formButtonPrimary: {
                  backgroundColor: 'var(--accent)',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                },
                formFieldInput: {
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--font-size-sm)',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
