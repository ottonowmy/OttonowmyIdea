import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
    }}>
      <SignUp path="/auth/sign-up" routing="path" redirect_url="/auth/setup" />
    </div>
  );
}
