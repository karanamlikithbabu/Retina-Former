import React, { useState, useEffect, useCallback } from 'react';

/**
 * Simple hash-based router — zero dependencies.
 * Routes are defined as { path, component } where path matches location.hash.
 */

export function useRoute() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

function getRoute() {
  const hash = window.location.hash || '#/';
  // Remove query params from hash
  const path = hash.split('?')[0];
  return path;
}

export function navigate(path) {
  window.location.hash = path;
  // Scroll to top on navigation
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Link({ to, children, className, onClick, ...props }) {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  }, [to, onClick]);

  return (
    <a href={`#${to}`} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function Router({ routes }) {
  const currentRoute = useRoute();
  
  const matchedRoute = routes.find(r => r.path === currentRoute);
  
  if (matchedRoute) {
    const Component = matchedRoute.component;
    return <Component />;
  }
  
  // Fallback: find default route or first route
  const defaultRoute = routes.find(r => r.path === '#/') || routes[0];
  if (defaultRoute) {
    const Component = defaultRoute.component;
    return <Component />;
  }
  
  return null;
}

export default Router;
