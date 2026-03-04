import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';
import { NavigationDemoUI } from './navigation-demo-presentational.tsx';

export function NavigationDemo() {
  const { falcon } = useFalconApiContext();

  const handleExternalNavigation = (event: any) => {
    // Prevent default navigation
    event.preventDefault();

    const url = event.currentTarget.href;

    // Use Falcon navigation to open external links
    if (falcon?.navigation?.onClick) {
      // falcon.navigation.onClick expects a native Event, not React's synthetic event
      // We need to pass the native event
      falcon.navigation.onClick(event.nativeEvent);
    } else {
      // Fallback if not in Falcon Console
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <NavigationDemoUI
      onExternalNavigation={handleExternalNavigation}
    />
  );
}