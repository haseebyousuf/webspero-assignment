import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import dummyImage from '@/assets/user-profile.png';
import { Button } from './ui/button';
import { setLogout } from '@/state';
import toast from 'react-hot-toast';

const sidebarLinks = [
  {
    route: '/dashboard',
    label: 'Nearby Users',
    imgURL: 'https://avatars.githubusercontent.com/u/31572317?v=4',
  },
  {
    route: '/update-profile',
    label: 'Update Profile',
    imgURL: 'https://avatars.githubusercontent.com/u/31572317?v=4',
  },
];
const Sidebar = () => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.global.user);
  const dispatch = useDispatch();

  return (
    <>
      {user && (
        <section className='bg-light-900 border-light-800 custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-start overflow-y-auto border-r p-2 pt-3 shadow-light-300  max-sm:hidden lg:w-[266px]'>
          <div className='flex flex-col justify-start flex-1 gap-6'>
            <article className='flex flex-col items-center justify-center w-full px-8 light-border '>
              <img
                src={
                  user.profile
                    ? `http://localhost:8002/assets/${user.profile}`
                    : dummyImage
                }
                crossOrigin='anonymous'
                alt='user profile'
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
            </article>
            <hr />
            {sidebarLinks.map((item) => {
              const isActive =
                item.route.substring(1) === pathname.substring(1);
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`${
                    isActive ? ' rounded-lg bg-gray-200' : 'text-dark-300'
                  } flex items-center justify-start gap-2 bg-transparent p-4`}
                >
                  <img
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <p
                    className={`${
                      isActive
                        ? 'text-[18px] font-bold leading-[140%] '
                        : 'text-[18px] font-medium leading-[25.2px]'
                    } max-lg:hidden`}
                  >
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>

          <Button
            onClick={() => {
              dispatch(setLogout());
              toast.error('You have been logged out');
            }}
          >
            Log Out
          </Button>

          {/* <SignedOut>
        <div className='flex flex-col gap-3 pt-6'>
          <Link href='/sign-in'>
            <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
              <Image
                src='/assets/icons/account.svg'
                alt='login'
                width={20}
                height={20}
                className='invert-colors lg:hidden'
              />
              <span className='primary-text-gradient max-lg:hidden'>
                Log In
              </span>
            </Button>
          </Link>

          <Link href='/sign-up'>
            <Button className='small-medium btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
              <Image
                src='/assets/icons/sign-up.svg'
                alt='sign-up'
                width={20}
                height={20}
                className='invert-colors lg:hidden'
              />
              <span className='max-lg:hidden'>Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut> */}
        </section>
      )}
    </>
  );
};

export default Sidebar;
