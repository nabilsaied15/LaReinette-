import { useLocation } from 'react-router-dom';
import SEO from './SEO';
import { getRouteSeo, SITE_URL } from '../config/routeSeo';

/**
 * SEO automatique pour chaque route (complète les pages qui ont déjà leur propre <SEO />).
 */
const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta = getRouteSeo(pathname);

  if (!meta) return null;

  const canonical = `${SITE_URL.replace(/\/$/, '')}${pathname === '/' ? '' : pathname}`;

  return (
    <SEO
      title={meta.title}
      description={meta.description}
      keywords={meta.keywords}
      url={canonical}
      noindex={meta.noindex}
    />
  );
};

export default RouteSeo;
