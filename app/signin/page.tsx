import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">☁️</div>
        <h1 className="text-3xl font-black text-sky-700">
          Cloud<span className="text-blue-500">Peek</span>
        </h1>
        <p className="text-sky-600 font-semibold mt-1 text-sm">
          Welcome back, cloud spotter!
        </p>
      </div>

      {/* Clerk SignIn component wrapped in sky-blue styling */}
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'rounded-3xl shadow-2xl border-4 border-sky-200 bg-white/95',
              headerTitle: 'text-sky-700 font-black',
              headerSubtitle: 'text-sky-500 font-semibold',
              formButtonPrimary:
                'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-black rounded-2xl',
              socialButtonsBlockButton: 'rounded-2xl border-2 border-sky-200 font-bold',
              formFieldInput: 'rounded-2xl border-2 border-sky-200 focus:border-sky-400',
              footerActionLink: 'text-sky-600 font-bold',
            },
          }}
          redirectUrl="/"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}
