import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/routeSeo';

const SITE_TITLE = 'La Reinette | Transport pour seniors à Bourg-la-Reine';
const DEFAULT_DESCRIPTION =
  "Service de transport et d'accompagnement dédié aux seniors à Bourg-la-Reine par l'association ASAD.";

const SEO = ({ title, description, keywords, url, noindex = false }) => {
  const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  const siteDescription = description || DEFAULT_DESCRIPTION;
  const canonical = url || SITE_URL;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet htmlAttributes={{ lang: 'fr' }}>
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="La Reinette — ASAD" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
    </Helmet>
  );
};

export default SEO;
