import useSWR from 'swr';
import MainLayout from './MainLayout';


const Users = () => {
  
const userInfo = localStorage.getItem('user');
const user = JSON.parse(userInfo);

  const URL = process.env.REACT_APP_BASE_URL;

  
const fetcher = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
const { data: users, mutate, error, isLoading } = useSWR(`${URL}/users`, fetcher);




  return (
    <MainLayout>
      <div className='my-12 mx-8'> 
        <h2 className='mb-2 font-roboto text-xl font-light tracking-medium text-center'>Users </h2>

        <section className="flex flex-col container mx-auto px-5 py-10">
            <div className=" flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
      
              Users
            </div>
      
          </section>
      </div>
    </MainLayout>
  )
}

export default Users
