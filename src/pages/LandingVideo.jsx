import React from "react";
import Hero from "../components/Hero";
import SEO from "../components/SEO";

const LandingVideo = () => {
  return (
    <main>
      <SEO
        title="Transport et sorties des seniors à Bourg-la-Reine"
        description="La Reinette met à disposition des habitants de Bourg-la-Reine, les Réginaburgiens et les Réginaburgiennes, un service de transport pour leurs sorties et leurs déplacements du quotidien."
      />
      <Hero />
      {/* On this page, we only show the Hero as requested */}
    </main>
  );
};

export default LandingVideo;
