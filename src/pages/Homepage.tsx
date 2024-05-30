import PostRepository from '@/api/repositories/PostRepository';
import AppCard from '@/components/common/AppCard';
import { useCallApi } from '@/hooks/useCallApi';
import { GetAllPostResponse } from '@/typings/post';
import { useEffect, useState } from 'react';
import { map } from 'rxjs';

const Homepage = () => {
  const [posts, setPosts] = useState<GetAllPostResponse | undefined>();

  const { run: getPosts } = useCallApi(() => {
    return PostRepository.getPosts(1, 8).pipe(map(response => {
      if (response.status === 200) {
        setPosts(response.data);
      }
    }))
  })

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className='my-5'>
      <div className='grid grid-cols-4 gap-4'>
        {
          posts && posts.items.length !== 0 ? posts.items.map(post => {
            return <AppCard post={post} />
          }) : null
        }
      </div>
    </div>
  );
};

export default Homepage;
