import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Hero from '../components/Hero';

const Features = lazy(() => import('../components/Features'));
const RecentActivities = lazy(() => import('../components/RecentActivities'));

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-none">
        <Suspense fallback={<LoadingSpinner />}>
          <Hero 
            title="Beşiktaş Kartalları Derneği"
            description="Beşiktaş Kartalları Derneği'ne üye olarak siz de bu büyük ailenin bir parçası olun. Gücümüze güç katın!"
          />
        </Suspense>
      </div>

      <div className="-mt-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Features />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <RecentActivities />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;