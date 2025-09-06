import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Continue your learning journey"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;