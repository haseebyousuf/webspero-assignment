/* eslint-disable react/prop-types */
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
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '@/state';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUpForm = ({ type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.global.user);
  const signupSchema = z.object({
    name: z
      .string()
      .max(30, 'Name cannot be longer than 30 characters')
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .min(3, 'Email must be at least 3 characters')
      .max(30, 'Email cannot be longer than 30 characters'),
    password:
      type === 'update'
        ? z.string().optional()
        : z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    mobile: z.string().min(10, 'Invalid Phone number'),
    zipCode: z.string().regex(/^\d{6}$/, 'Invalid Zip Code'),
    profile: z.any(),
  });
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
      zipCode: user?.zipCode || '',
      phone: user?.phone || '',
      mobile: user?.mobile || '',
      profile: '',
    },
  });

  async function onSubmit(values) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          if (key === 'profile' && values[key].length > 0) {
            formData.append(key, values[key][0], values[key][0].name);
          } else {
            formData.append(key, values[key]);
          }
        }
      }
      if (type === 'update') {
        const res = await axios({
          method: 'put',
          url: 'http://localhost:8002/user/update',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        });
        dispatch(setLogin({ ...res.data }));
        toast.success('Profile Updated');

        navigate('/dashboard');
      } else {
        const res = await axios({
          method: 'post',
          url: 'http://localhost:8002/user/signup',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(setLogin({ ...res.data }));
        toast.success('logged In Successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Some Server Error');
    } finally {
      form.reset();

      setIsSubmitting(false);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
          <div className='flex flex-col gap-4 sm:gap-6 sm:items-end sm:flex-row'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='text'
                      placeholder='John Doe'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Email <span className='text-orange-700'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='email'
                      placeholder='example@gmail.com'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col gap-4 sm:gap-4 sm:items-end sm:flex-row'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Password <span className='text-orange-700'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='password'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='zipCode'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Zip Code <span className='text-orange-700'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='text'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col gap-4 sm:gap-6 sm:items-end sm:flex-row'>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='text'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='mobile'
              render={({ field }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Mobile <span className='text-orange-700'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] sm:w-64 font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      type='text'
                      placeholder=''
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=''>
            <FormField
              control={form.control}
              name='profile'
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem className='space-y-3.5'>
                  <FormLabel className='text-[15px] font-semibold leading-[20.8px]'>
                    Profile Photo
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='text-[16px] flex items-center w-full font-normal leading-[22.4px] border-light-700 min-h-[56px] border bg-gray-100 text-dark-300'
                      accept='image/png, image/jpeg, image/jpg'
                      type='file'
                      onBlur={onBlur}
                      onChange={(e) => {
                        // Use the onChange callback from Controller
                        // to update the form state with the selected file
                        console.log(e.target.files);
                        onChange(e.target.files);
                      }}
                      name={name}
                      ref={ref}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='w-full mt-7'>
            <Button
              type='submit'
              className=' w-full min-h-[56px] text-xl'
              disabled={isSubmitting}
            >
              {type === 'update'
                ? isSubmitting
                  ? 'Updating...'
                  : 'Update'
                : isSubmitting
                ? 'Submitting...'
                : 'Sign Up'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
