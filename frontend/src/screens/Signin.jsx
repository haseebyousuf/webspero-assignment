import SignInForm from '@/components/SignInForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Signin = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Card className='p-2 sm:w-[25rem]'>
        <CardHeader>
          <CardTitle className='text-4xl'>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <p className='font-bold'>
            Don&apos;t have an account?{' '}
            <Link to={'/signup'} className='underline cursor-pointer'>
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signin;
