import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignUpForm from '@/components/SignUpForm';

const UpdateProfile = () => {
  return (
    <div className='flex-1'>
      <div className='flex items-center justify-center w-full h-screen'>
        <Card className='p-2 '>
          <CardHeader>
            <CardTitle className='text-4xl'>Update Profile</CardTitle>
            <CardDescription>
              Enter your details to update your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm type='update' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProfile;
