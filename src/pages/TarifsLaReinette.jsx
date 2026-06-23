import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { CONTACT_MOTIF_TARIFS } from "../data/contactSubjects";
import logo from "../assets/la-reinette-logo.png";
import mascotImg from "../assets/contact-grenouille.jpg";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./TarifsLaReinette.clean.css";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const darkEmeraldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iIzA2MjExOSIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzBhM2QyZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTIiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMSIgZmlsbD0iIzBhM2QyZSIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iMTYiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiMwYTNkMmUiLz48L3N2Zz4=",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  shadowSize: [41, 41],
});

const goldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iI2M5YTIyNyIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const emeraldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iIzEyNUI0NiIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const COMMUNES_92 = [
  "Antony",
  "Châtenay-Malabry",
  "Sceaux",
  "Bourg-la-Reine",
  "Bagneux",
  "Fontenay-aux-Roses",
  "Le Plessis-Robinson",
  "Clamart",
  "Châtillon",
  "Montrouge",
  "Malakoff",
  "Vanves",
];

const COMMUNES_LIMITROPHES_BOURG_LA_REINE = [
  "Sceaux",
  "Antony",
  "Bagneux",
];

const AUTRES_COMMUNES_92 = [
  "Fontenay-aux-Roses",
  "Le Plessis-Robinson",
  "Châtenay-Malabry",
  "Clamart",
  "Châtillon",
  "Montrouge",
  "Vanves",
];
const COMMUNES_94 = [
  "Cachan",
  "L'Haÿ-les-Roses",
  "Villejuif",
  "Fresnes",
  "Gentilly",
  "Arcueil",
  "Le Kremlin-Bicêtre",
];

const HOSPITAUX_92 = [
  "Hôpital Antoine Béclère",
  "Hôpital Foch",
  "Hôpital Corentin Celton",
  "Hôpital Raymond Poincaré",
  "Hôpital Ambroise Paré",
  "Hôpital Beaujon",
];

const HOSPITAUX_94 = [
  "Hôpital Henri Mondor",
  "Hôpital Bicêtre",
  "Hôpital Sainte-Périne",
  "Hôpital Paul Brousse",
  "Hôpital Emile Roux",
];

const COMMUNES_COORDINATES = {
  "Bourg-la-Reine": [48.7875, 2.3292],
  Antony: [48.7539, 2.3025],
  "Châtenay-Malabry": [48.7667, 2.2833],
  Sceaux: [48.7792, 2.2958],
  Bagneux: [48.8083, 2.3167],
  "Fontenay-aux-Roses": [48.7917, 2.275],
  "Le Plessis-Robinson": [48.7708, 2.2333],
  Clamart: [48.8083, 2.225],
  Châtillon: [48.8083, 2.2917],
  Montrouge: [48.8167, 2.3167],
  Malakoff: [48.825, 2.2917],
  Vanves: [48.8292, 2.2917],
  Cachan: [48.7917, 2.3333],
  "L'Haÿ-les-Roses": [48.775, 2.35],
  Villejuif: [48.7917, 2.3667],
  Fresnes: [48.7583, 2.3167],
  Gentilly: [48.8167, 2.35],
  Arcueil: [48.8, 2.3333],
  "Le Kremlin-Bicêtre": [48.8167, 2.3667],
  Paris: [48.8566, 2.3522],
  Orly: [48.7261, 2.3796],
};

const HOSPITAUX_COORDINATES = {
  "Hôpital Antoine Béclère": [48.8083, 2.225],
  "Hôpital Raymond Poincaré": [48.845, 2.205],
  "Hôpital Foch": [48.875, 2.22],
  "Hôpital Ambroise Paré": [48.84, 2.25],
  "Hôpital Beaujon": [48.9, 2.3],
  "Hôpital Corentin Celton": [48.82, 2.27],
  "Hôpital Henri Mondor": [48.81, 2.42],
  "Hôpital Bicêtre": [48.81, 2.35],
  "Hôpital Sainte-Périne": [48.82, 2.38],
  "Hôpital Paul Brousse": [48.8, 2.36],
  "Hôpital Emile Roux": [48.79, 2.37],
};

const TarifsLaReinette = () => {
  const { settings, isSettingsLoading } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSettingsLoading || !settings || !settings.laReinette) {
    return <div style={{ minHeight: "100vh", background: "#fff" }} />;
  }

  const { laReinette } = settings;
  const pricing = laReinette.pricing || [];

  const zoneKeyByZone = {
    "Zone Locale": "local",
    "Zone Limitrophe 92": "zone92",
    "Zone Limitrophe 92 Autres": "zone92autres",
    "Zone Limitrophe 94": "zone94",
    "Longue Distance": "paris",
    "Zone Hospitalière": "hospital",
  };

  const preferredOrder = [
    "Bourg-la-Reine",
    ...COMMUNES_LIMITROPHES_BOURG_LA_REINE,
    ...AUTRES_COMMUNES_92,
    ...COMMUNES_94,
    "Paris",
    "Orly",
  ];

  const getZoneKey = (destination) => {
    const location = destination?.location || "";

    if (/paris/i.test(location) || /orly/i.test(location) || destination?.callOnly || destination?.call_only) return "paris";

    // Check if location is in neighboring municipalities of Bourg-la-Reine
    if (COMMUNES_LIMITROPHES_BOURG_LA_REINE.includes(location)) {
      return "zone92";
    }

    // Check if location is in other 92 municipalities
    if (AUTRES_COMMUNES_92.includes(location)) {
      return "zone92autres";
    }

    return zoneKeyByZone[destination?.zone] || "paris";
  };

  // Créer des objets de coordonnées dynamiques à partir des settings
  const dynamicCoordinates = pricing.reduce((acc, dest) => {
    if (dest.latitude && dest.longitude) {
      acc[dest.location] = [dest.latitude, dest.longitude];
    }
    return acc;
  }, {});

  // Fusionner avec les coordonnées hardcoded pour les destinations par défaut
  const allCoordinates = {
    ...COMMUNES_COORDINATES,
    ...HOSPITAUX_COORDINATES,
    ...dynamicCoordinates,
  };

  const destinationCards = pricing
    .filter((dest) => dest?.location)
    .map((dest, index) => ({
      id: `${dest.location}-${index}`,
      zoneKey: getZoneKey(dest),
      zoneLabel: dest.zone,
      title: dest.location,
      tier: dest,
      mapQuery: dest.location,
    }))
    .sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a.title);
      const bIndex = preferredOrder.indexOf(b.title);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.title.localeCompare(b.title, "fr");
    });

  const zoneSections = [
    { id: "local", title: "Commune locale", zoneKey: "local" },
    { id: "92", title: "Communes limitrophes de Bourg-la-Reine du 92", zoneKey: "zone92" },
    { id: "92autres", title: "Autres communes du 92", zoneKey: "zone92autres" },
    { id: "94", title: "Communes limitrophes du 94", zoneKey: "zone94" },
    {
      id: "paris",
      title: "Paris et autres communes sur devis",
      zoneKey: "paris",
    },
  ]
    .map((section) => ({
      ...section,
      cards: destinationCards.filter(
        (card) => card.zoneKey === section.zoneKey,
      ),
    }))
    .filter((section) => section.cards.length > 0);

  const getPriceLabel = (tier) => {
    if (!tier) return "";
    if (tier.callOnly || tier.call_only) return "Sur devis";

    const parts = [];
    if (tier.aller) parts.push(`${tier.aller} aller`);
    if (tier.ar) parts.push(`${tier.ar} A-R`);
    return parts.join(" / ");
  };

  return (
    <div className="tarifs-page">
      <div className="container tarifs-container">
        <button
          type="button"
          className="tarifs-back-btn"
          onClick={() => navigate("/la-reinette")}
        >
          <ArrowLeft size={20} />
          Retour à La Reinette
        </button>

        <div className="tarifs-hero">
          <div className="tarifs-hero-content">
            <div className="section-label" style={{ justifyContent: "center" }}>
              TARIFS & DESTINATIONS
            </div>
            <h1 className="font-serif">
              Une tarification <br />
              <span
                style={{
                  color: "var(--primary-gold)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                claire et solidaire.
              </span>
            </h1>
            <p className="tarifs-hero-sub">
              Retrouvez les destinations desservies par zone.
            </p>
          </div>
          <div className="tarifs-mascot-container">
            <div className="tarifs-mascot-halo" aria-hidden="true" />
            <img
              src={mascotImg}
              alt="Mascot La Reinette"
              className="tarifs-mascot-img"
            />
          </div>
        </div>

        <section
          className="tarifs-map-section"
          aria-label="Carte des zones desservies"
        >
          <div className="tarifs-map-head">
            <h2 className="font-serif tarifs-map-title">
              Carte simplifiée des zones desservies
            </h2>
            <p className="tarifs-map-sub">
              Visualisez nos secteurs d'intervention autour de Bourg-la-Reine,
              Paris et Orly.
            </p>
          </div>

          <div className="tarifs-zone-map">
            <MapContainer
              center={[48.7875, 2.3292]}
              zoom={11}
              style={{ height: "100%", width: "100%", minHeight: "280px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {destinationCards.map((card) => {
                const coordinates = allCoordinates[card.title];
                if (!coordinates) return null;

                const markerIcon =
                  card.zoneKey === "local" || card.zoneKey === "zone92"
                    ? goldIcon
                    : card.zoneKey === "zone94"
                      ? emeraldIcon
                      : card.zoneKey === "hospital"
                        ? hospitalIcon
                        : darkEmeraldIcon;

                return (
                  <Marker
                    key={card.id}
                    position={coordinates}
                    icon={markerIcon}
                  >
                    <Popup>
                      {card.title} ({card.zoneLabel})
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            <div className="tarifs-map-overlay tarifs-map-overlay--brand">
              <img src={logo} alt="" aria-hidden />
              <span>Zone couverte</span>
            </div>

            <div className="tarifs-map-overlay tarifs-map-overlay--local">
              Locale : Bourg-la-Reine
            </div>
            <div className="tarifs-map-overlay tarifs-map-overlay--nearby">
              Limitrophe : 92
            </div>
            <div className="tarifs-map-overlay tarifs-map-overlay--nearby-94">
              Limitrophe : 94
            </div>
            <div className="tarifs-map-overlay tarifs-map-overlay--hospital">
              Zone hospitalière
            </div>
            <div className="tarifs-map-overlay tarifs-map-overlay--distance">
              Paris / Orly
            </div>
          </div>
        </section>

        <div className="tarifs-zones-grid">
          {zoneSections.map((section) => (
            <section
              key={section.id}
              className="tarifs-zone-section"
              aria-label={section.title}
            >
              <div className="tarifs-zone-header">
                <h2 className="font-serif tarifs-zone-title">
                  {section.title}
                </h2>
                <span className="tarifs-zone-count">
                  {section.cards.length} destination
                  {section.cards.length > 1 ? "s" : ""}
                </span>
              </div>
              <ul
                className="tarifs-dash-list"
                aria-label={`Destinations ${section.title}`}
              >
                {section.cards.map((card) => (
                  <li
                    key={`dash-${section.id}-${card.id}`}
                    className={`tarifs-dash-item--${card.zoneKey}`}
                  >
                    <span>{card.title}</span>
                    <span className="tarifs-dash-price">
                      {getPriceLabel(card.tier)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section
          className="tarifs-quote-cta"
          aria-label="Demande de tarif personnalisé"
        >
          <div>
            <h2 className="font-serif tarifs-quote-cta__title">
              Un trajet hors grille tarifaire ?
            </h2>
            <p className="tarifs-quote-cta__text">
              Pour Paris, Orly ou un parcours particulier, envoyez votre demande
              : notre équipe vous répond avec un tarif adapté.
            </p>
          </div>
          <button
            type="button"
            className="tarifs-quote-cta__btn"
            onClick={() => navigate(`/contact?motif=${CONTACT_MOTIF_TARIFS}`)}
          >
            <MessageCircle size={22} aria-hidden />
            Demander un tarif
          </button>
        </section>

        <aside
          className="tarifs-disclaimer"
          aria-label="Mention sur les tarifs"
        >
          <div className="tarifs-disclaimer-logo">
            <img src={logo} alt="Logo La Reinette" width={56} height={56} />
          </div>
          <p className="tarifs-disclaimer-text">
            Les tarifs indiqués sont donnés à titre indicatif et peuvent varier
            selon les spécificités de votre trajet. Une prise en charge dédiée
            est toujours garantie.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default TarifsLaReinette;
