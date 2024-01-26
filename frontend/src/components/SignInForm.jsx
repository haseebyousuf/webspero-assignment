import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/state';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignInForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:8002/user/signin', values);
      console.log(res);
      dispatch(setLogin({ ...res.data }));
      form.reset();
      toast.success('logged In Successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Some Server Error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className='text-[16px] font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                    type='email'
                    placeholder='example@gmail.com'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-3.5'>
                <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className='text-[16px] font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                    type='password'
                    placeholder=''
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='w-full mt-7'>
            <Button
              type='submit'
              className=' w-full min-h-[56px] '
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
