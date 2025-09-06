import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthLayout 
      title="Join Ugram" 
      subtitle="Start your personalized learning journey"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;