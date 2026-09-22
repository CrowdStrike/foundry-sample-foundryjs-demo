import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';
import { NavigationDemoUI } from './navigation-demo-presentational.tsx';

export function NavigationDemo() {
  const { falcon } = useFalconApiContext();

  const handleExternalNavigation = (event: any) => {
    event.preventDefault();

    const url = event.currentTarget.href;

    if (falcon?.navigation?.navigateTo) {
      falcon.navigation.navigateTo({ path: url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <NavigationDemoUI
      onExternalNavigation={handleExternalNavigation}
    />
  );
}