import { motion } from "framer-motion";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <section
      className="hero-section"
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "#000",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <img
          src={heroBg}
          alt="La Reinette Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 25%",
            opacity: 0.6,
            filter: "brightness(0.8) contrast(1.1)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: -1,
        }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: "100%", textAlign: "center" }}
        >
          <motion.h1
            variants={itemVariants}
            className="font-serif hero-title"
            style={{
              color: "#fff",
              fontSize: "clamp(2.1rem, 4.2vw, 3.8rem)",
              lineHeight: 1.12,
              margin: "0 auto 2rem",
              maxWidth: "1400px",
              padding: "0 1.5rem",
              textAlign: "center",
              fontWeight: 900,
              letterSpacing: "-1px",
              textShadow: "0 4px 15px rgba(0,0,0,0.5)",
            }}
          >
            Votre spécialiste réginaburgien du transport au services des <br />
            <span style={{ color: "var(--primary-gold)", fontStyle: "italic" }}>
              reginaburgiennes et réginaburgiens
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              color: "rgba(255,255,255,0.95)",
              margin: "0 auto 3rem",
              maxWidth: "800px",
              fontWeight: 400,
              lineHeight: 1.6,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Nous offrons l’indépendance et la tranquillité d’esprit dont les
            seniors ont besoin au quotidien.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-badges-container"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "4rem",
              color: "rgba(255,255,255,0.8)",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: ShieldCheck, text: "Sécurité Certifiée" },
              { icon: Heart, text: "Accompagnement Humain" },
              { icon: Sparkles, text: "Service Premium" },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <item.icon size={20} />
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          .hero-section {
            height: auto !important;
            min-height: 100vh;
            padding-top: 140px !important;
            padding-bottom: 60px !important;
          }
          .hero-section h1 {
            font-size: 2.2rem !important;
            line-height: 1.2 !important;
            margin-bottom: 1.5rem !important;
          }

          .hero-section p {
            font-size: 1.05rem !important;
            line-height: 1.6 !important;
            padding: 0 1rem;
            margin-bottom: 2.5rem !important;
          }
          .hero-badges-container {
            flex-direction: column !important;
            gap: 1.5rem !important;
            align-items: center !important;
          }
          .hero-badges-container span {
            font-size: 0.95rem !important;
          }
        }
      `,
        }}
      />
    </section>
  );
};

export default Hero;
