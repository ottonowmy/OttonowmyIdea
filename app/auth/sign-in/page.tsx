import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
    }}>
      <SignIn path="/auth/sign-in" routing="path" redirect_url="/auth/setup" />
    </div>
  );
}
