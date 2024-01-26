import SignUpForm from '@/components/SignUpForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Card className='p-2 '>
        <CardHeader>
          <CardTitle className='text-4xl'>Sign Up</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm type='signup' />
        </CardContent>
        <CardFooter>
          <p className='font-bold'>
            Already Registered?{' '}
            <Link to={'/'} className='underline cursor-pointer'>
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
