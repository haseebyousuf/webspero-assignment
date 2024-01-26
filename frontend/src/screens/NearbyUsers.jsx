import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dummyImage from '@/assets/user-profile.png';

const NearbyUsers = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.global.user?.token);
  useEffect(() => {
    const getUsers = async () => {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8002/user/nearby-users',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setUsers(response.data);
    };
    getUsers();
  }, [token]);
  return (
    <div className='flex-1 px-20 pt-10'>
      <h1 className='text-[30px] font-bold leading-[42px] tracking-tighter text-dark-100'>
        Users near you.
      </h1>

      <section className='flex flex-wrap gap-4 mt-12'>
        {users.length > 0 ? (
          users.map((user) => (
            <article
              key={user.name}
              className='flex flex-col items-center justify-center p-8 border w-60 light-border rounded-2xl'
            >
              <img
                src={
                  user.profile
                    ? `http://localhost:8002/assets/${user.profile}`
                    : dummyImage
                }
                alt='user profile picture'
                className='object-cover rounded-full w-[100px] h-[100px]'
              />
              <div className='mt-4 text-center'>
                <h3 className='text-[20px] font-bold leading-[26px] text-dark-200 line-clamp-1'>
                  {user.name}
                </h3>
                <p className='mt-2 text-[14px] font-normal leading-[19.6px] text-dark-500'>
                  {user.email}
                </p>
              </div>
              <div className='mt-5'>
                <Badge className='text-[10px] font-medium  bg-gray-300 text-dark-400 rounded-md border-none px-4 py-2 uppercase hover:!bg-gray-200 '>
                  {user.zipCode}
                </Badge>
              </div>
            </article>
          ))
        ) : (
          <div className='max-w-4xl mx-auto text-center paragraph-regular text-dark200_light800'>
            <p className='mt-2 text-lg font-bold text-accent-blue'>
              {' '}
              No User near you!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default NearbyUsers;
