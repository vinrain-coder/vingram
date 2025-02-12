import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import GoogleSignInButton from "./google/GoogleSignUpButton";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[30rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to vingram</h1>
            <p className="text-muted-foreground mb-2">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
            <GoogleSignInButton /> 
             <div className="flex items-center gap-3"> 
               <div className="h-px flex-1 bg-muted" /> 
               <span>OR</span> 
               <div className="h-px flex-1 bg-muted" /> 
             </div> 
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
