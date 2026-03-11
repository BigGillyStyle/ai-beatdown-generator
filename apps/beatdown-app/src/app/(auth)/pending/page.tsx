export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Access Pending</h1>
        <p className="text-sm text-muted-foreground">Your request has been received. An admin will review your request and send you an email when you&apos;re approved.</p>
        <p className="text-sm text-muted-foreground">
          Already received your approval email?{" "}
          <a href="/sign-in" className="underline hover:text-foreground">
            Sign in here
          </a>
          .
        </p>
      </div>
    </main>
  );
}
