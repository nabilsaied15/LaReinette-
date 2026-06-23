import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Home,
  Mail,
  Save,
  LogOut,
  Megaphone,
  CheckCircle2,
  Trash2,
  Plus,
  Quote,
  HelpCircle,
  Users,
  Info,
  Layers,
  Layout,
  ArrowRight,
  ExternalLink,
  Image,
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  MousePointer2,
  ListPlus,
  Star,
  Sparkles,
  X,
  ChevronRight,
  Download,
  Search,
  MessageSquare,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  buildNewsletterEmailParams,
  getNewsletterEmailConfig,
} from "../utils/newsletterEmail";
import {
  buildReservationScheduleVarsFromReservation,
  EMAILJS_RESERVATION_SCHEDULE_HINT,
} from "../utils/reservationEmailVars";
import { useSettings } from "../context/SettingsContext";
import { supabase } from "../config/supabase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, logout } = useSettings();
  const [activeTab, setActiveTab] = useState("stats");
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [selectedRes, setSelectedRes] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddResModal, setShowAddResModal] = useState(false);
  const [newRes, setNewRes] = useState({
    name: "",
    phone: "",
    email: "",
    departure: "",
    destination: "",
    appointment_date: "",
    appointment_time: "",
    driver: "",
    status: "Validée",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isRefreshingReviews, setIsRefreshingReviews] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [isRefreshingNewsletters, setIsRefreshingNewsletters] = useState(false);
  const [newsletterSearch, setNewsletterSearch] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [campaign, setCampaign] = useState({ subject: "", message: "" });
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [destinationForm, setDestinationForm] = useState({
    zone: "",
    location: "",
    aller: "",
    ar: "",
    features: "",
    callOnly: false,
    latitude: "",
    longitude: "",
  });
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (activeTab === "reservations") {
      fetchReservations();
    }
    if (activeTab === "reviews") {
      fetchReviews();
    }
    if (activeTab === "newsletter") {
      fetchNewsletters();
    }
    if (activeTab === "destinations") {
      fetchDestinations();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    setIsRefreshingReviews(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setReviews(data);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsRefreshingReviews(false), 500);
  };

  const fetchNewsletters = async () => {
    setIsRefreshingNewsletters(true);
    try {
      const { data, error } = await supabase
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setNewsletters(data);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsRefreshingNewsletters(false), 500);
  };

  const deleteNewsletter = async (id) => {
    if (!window.confirm("Supprimer cet email de la liste ?")) return;
    try {
      const { error } = await supabase
        .from("newsletters")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchNewsletters();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression.");
    }
  };

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDestinations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadNewslettersAsCSV = () => {
    if (newsletters.length === 0) return;
    const headers = ["Email", "Date d'inscription"];
    const csvRows = [
      headers.join(";"),
      ...newsletters.map((n) =>
        [n.email, new Date(n.created_at).toLocaleDateString("fr-FR")].join(";"),
      ),
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob(["\ufeff" + csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `newsletter_emails_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const toggleAllEmails = () => {
    if (
      selectedEmails.length === newsletters.length &&
      newsletters.length > 0
    ) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(newsletters.map((n) => n.email));
    }
  };

  const sendCampaign = async () => {
    if (selectedEmails.length === 0)
      return alert("Veuillez sélectionner au moins un email.");
    if (!campaign.subject || !campaign.message)
      return alert("Veuillez remplir l'objet et le message.");

    const config = getNewsletterEmailConfig(localSettings);
    if (!config?.serviceId || !config?.templateId || !config?.publicKey) {
      return alert(
        "Configurez EmailJS « Newsletter / Confirmations client » dans l'onglet Config EmailJS (champs Service ID, Template ID, Public Key). Le template doit envoyer vers {{to_email}}.",
      );
    }

    if (
      !window.confirm(
        `Envoyer ce message à ${selectedEmails.length} personne(s) à leur adresse email ?`,
      )
    )
      return;

    setIsSendingCampaign(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const recipientEmail of selectedEmails) {
        try {
          const params = buildNewsletterEmailParams({
            toEmail: recipientEmail,
            subject: campaign.subject,
            message: campaign.message,
            siteName: "La Reinette",
            replyTo:
              localSettings.contact?.email ||
              localSettings.contact?.formRecipientEmail ||
              "lareinette@asad-bourg-la-reine.fr",
          });
          await emailjs.send(
            config.serviceId,
            config.templateId,
            params,
            config.publicKey,
          );
          successCount++;
        } catch (err) {
          console.error(`Erreur pour ${recipientEmail}:`, err);
          errorCount++;
        }
      }

      alert(
        `Campagne terminée !\nSuccès : ${successCount}\nÉchecs : ${errorCount}`,
      );
      if (successCount > 0) setCampaign({ subject: "", message: "" });
      setSelectedEmails([]);
    } catch (e) {
      console.error(e);
      alert("Erreur critique lors de l'envoi.");
    } finally {
      setIsSendingCampaign(false);
    }
  };

  const handleApproveReview = async (id, status) => {
    console.log("Mise à jour statut avis:", id, status);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: status })
        .eq("id", id);
      if (error) {
        alert("Erreur Supabase : " + error.message);
        return;
      }
      alert(
        status ? "Avis publié sur le site !" : "Avis retiré du site (archivé).",
      );
      fetchReviews();
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion.");
    }
  };

  const handleDeleteReview = async (id) => {
    console.log("Demande d'archivage pour:", id);
    if (
      !window.confirm(
        "Voulez-vous retirer cet avis du site ? il restera visible uniquement ici dans votre dashboard.",
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: false })
        .eq("id", id);
      if (error) {
        alert("Erreur Supabase : " + error.message);
        return;
      }
      alert("L'avis est maintenant hors-ligne.");
      fetchReviews();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'archivage.");
    }
  };

  const fetchReservations = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setReservations(data);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUpdateReservation = async () => {
    if (!selectedRes) return;
    try {
      await supabase
        .from("reservations")
        .update({
          status: selectedRes.status,
          driver: selectedRes.driver,
        })
        .eq("id", selectedRes.id);

      // Envoi de l'e-mail automatique au client si le statut passe à Validée
      if (
        selectedRes.status === "Validée" &&
        selectedRes.email &&
        settings.emailjs?.reservation?.serviceId
      ) {
        try {
          const { emailjs: emailjsConfig } = settings;
          const reservationConfig = emailjsConfig.reservation;

          const htmlTable = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                     <div style="background: #064e3b; padding: 30px; text-align: center;">
                        <h1 style="color: #d1fae5; margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">La Reinette</h1>
                        <p style="color: #a7f3d0; margin: 10px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Confirmation de Réservation</p>
                     </div>
                     <div style="padding: 40px 30px;">
                        <p style="color: #1f2937; font-size: 18px; line-height: 1.6; margin-top: 0;">
                           Bonjour <strong>${selectedRes.name}</strong>,
                        </p>

                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                           Nous avons le plaisir de vous confirmer votre demande de trajet prévue le <strong>${selectedRes.appointment_date ? new Date(selectedRes.appointment_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Date à confirmer"}</strong>.
                        </p>

                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 5px solid #0284c7; margin: 20px 0;">
                           <p style="margin: 0 0 10px; color: #0f172a; font-size: 16px;">
                              🎯 <strong>Destination :</strong> <span style="color: #0369a1; font-weight: bold;">${selectedRes.destination || "Non spécifiée"}</span>
                           </p>
                           <p style="margin: 0; color: #0f172a; font-size: 16px;">
                              💳 <strong>Paiement :</strong> Merci de préparer votre règlement par <strong>chèque à l'ordre de l'ASAD</strong> à remettre au chauffeur.
                           </p>
                        </div>

                        ${
                          selectedRes.driver
                            ? `
                        <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; border-left: 5px solid #10b981; margin: 20px 0;">
                           <p style="margin: 0; color: #065f46; font-size: 16px; line-height: 1.6;">
                              🚗 <strong>Votre Chauffeur :</strong> C'est <strong>${selectedRes.driver}</strong> qui aura le plaisir de vous accompagner.<br><br>
                              🕒 <strong>Prise en charge :</strong> Il sera présent devant chez vous à <strong>${selectedRes.pickup_time || selectedRes.appointment_time || "l'heure convenue"}</strong>.
                           </p>
                        </div>`
                            : `
                        <div style="background: #fdfce8; padding: 20px; border-radius: 10px; border-left: 5px solid #eab308; margin: 20px 0;">
                           <p style="margin: 0; color: #854d0e; font-size: 16px; line-height: 1.6;">
                              ⏳ <strong>En cours d'organisation :</strong> Le nom de votre chauffeur ainsi que l'heure exacte de prise en charge vous seront confirmés très prochainement.
                           </p>
                        </div>
                        `
                        }

                        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                           Pour toute modification ou urgence, vous pouvez toujours nous joindre au <strong>01 79 71 41 20</strong>.
                        </p>
                     </div>
                     <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} ASAD Bourg-la-Reine — L'excellence au service de la sérénité.</p>
                     </div>
                  </div>
               `;

          await emailjs.send(
            emailjsConfig.clientConfirmation?.serviceId ||
              reservationConfig.serviceId,
            emailjsConfig.clientConfirmation?.templateId ||
              reservationConfig.templateId,
            {
              to_email: selectedRes.email,
              from_name: "La Reinette",
              subject: `Confirmation de votre réservation La Reinette`,
              message_html: htmlTable,
              name: selectedRes.name || "",
              destination: selectedRes.destination || "",
              driver: selectedRes.driver || "",
              pickup_time:
                selectedRes.pickup_time ||
                selectedRes.appointment_time ||
                "l'heure convenue",
              appointment_date: selectedRes.appointment_date
                ? new Date(selectedRes.appointment_date).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )
                : "Date à confirmer",
              appointment_time: selectedRes.appointment_time || "",
              ...buildReservationScheduleVarsFromReservation(selectedRes),
            },
            emailjsConfig.clientConfirmation?.publicKey ||
              reservationConfig.publicKey,
          );
        } catch (err) {
          console.error("Erreur envoi email client", err);
        }
      }

      setSelectedRes(null);
      fetchReservations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNewReservation = async () => {
    try {
      await supabase
        .from("reservations")
        .insert([
          { ...newRes, trip_type: "Aller Simple", motif: "Rendez-vous" },
        ]);
      setShowAddResModal(false);
      setNewRes({
        name: "",
        phone: "",
        email: "",
        departure: "",
        destination: "",
        appointment_date: "",
        appointment_time: "",
        driver: "",
        status: "Validée",
      });
      fetchReservations();
    } catch (e) {
      console.error(e);
    }
  };

  const syncDestinations = async (pricingList) => {
    try {
      const { data: dbDestinations, error: fetchError } = await supabase
        .from("destinations")
        .select("id, location");
      if (fetchError) throw fetchError;

      const updatedPricingList = [];
      for (let i = 0; i < pricingList.length; i++) {
        const dest = { ...pricingList[i] };
        if (!dest.location) continue;

        const destData = {
          zone: dest.zone,
          location: dest.location,
          aller: dest.aller,
          ar: dest.ar,
          features: Array.isArray(dest.features)
            ? dest.features
            : typeof dest.features === "string"
              ? dest.features.split(",").map((f) => f.trim()).filter(Boolean)
              : [],
          call_only: !!(dest.callOnly || dest.call_only),
          latitude: dest.latitude ? parseFloat(dest.latitude) : null,
          longitude: dest.longitude ? parseFloat(dest.longitude) : null,
        };

        if (dest.id) {
          await supabase
            .from("destinations")
            .update(destData)
            .eq("id", dest.id);
        } else {
          const existingInDb = dbDestinations.find(
            (d) => (d.location || "").trim().toLowerCase() === (dest.location || "").trim().toLowerCase()
          );

          if (existingInDb) {
            dest.id = existingInDb.id;
            await supabase
              .from("destinations")
              .update(destData)
              .eq("id", existingInDb.id);
          } else {
            const { data: insertData, error: insertError } = await supabase
              .from("destinations")
              .insert([destData])
              .select();
            if (insertError) {
              console.error("Error inserting destination:", insertError);
            } else if (insertData && insertData[0]) {
              dest.id = insertData[0].id;
            }
          }
        }
        updatedPricingList.push(dest);
      }

      // Supprimer toutes les destinations de la base de données qui ne figurent plus dans la liste mise à jour
      const keptIds = updatedPricingList.map((p) => p.id).filter(Boolean);
      const { data: latestDbDestinations } = await supabase
        .from("destinations")
        .select("id");

      if (latestDbDestinations && latestDbDestinations.length > 0) {
        const toDeleteIds = latestDbDestinations
          .map((d) => d.id)
          .filter((id) => !keptIds.includes(id));

        if (toDeleteIds.length > 0) {
          const { error: deleteError } = await supabase
            .from("destinations")
            .delete()
            .in("id", toDeleteIds);
          if (deleteError) {
            console.error("Error deleting old/duplicate destinations:", deleteError);
          }
        }
      }

      return updatedPricingList;
    } catch (err) {
      console.error("Error syncing destinations table:", err);
      return pricingList;
    }
  };

  const handleSave = async () => {
    let nextSettings = { ...localSettings };

    if (activeTab === "destinations" || activeTab === "reinette") {
      const syncedPricing = await syncDestinations(localSettings.laReinette.pricing);
      nextSettings.laReinette.pricing = syncedPricing;
      setLocalSettings(nextSettings);
    }

    updateSettings(nextSettings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleOpenDestinationModal = (destination = null) => {
    if (destination) {
      setEditingDestination(destination);
      setDestinationForm({
        zone: destination.zone || "",
        location: destination.location || "",
        aller: destination.aller || "",
        ar: destination.ar || "",
        features: (destination.features || []).join(", "),
        callOnly: destination.call_only || destination.callOnly || false,
        latitude: destination.latitude || "",
        longitude: destination.longitude || "",
      });
    } else {
      setEditingDestination(null);
      setDestinationForm({
        zone: "",
        location: "",
        aller: "",
        ar: "",
        features: "",
        callOnly: false,
        latitude: "",
        longitude: "",
      });
    }
    setShowDestinationModal(true);
  };

  const handleCloseDestinationModal = () => {
    setShowDestinationModal(false);
    setEditingDestination(null);
    setDestinationForm({
      zone: "",
      location: "",
      aller: "",
      ar: "",
      features: "",
      callOnly: false,
      latitude: "",
      longitude: "",
    });
  };

  const handleSaveDestination = async () => {
    const featuresArray = destinationForm.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    const destinationData = {
      zone: destinationForm.zone,
      location: destinationForm.location,
      aller: destinationForm.aller,
      ar: destinationForm.ar,
      features: featuresArray,
      call_only: destinationForm.callOnly,
      latitude: destinationForm.latitude
        ? parseFloat(destinationForm.latitude)
        : null,
      longitude: destinationForm.longitude
        ? parseFloat(destinationForm.longitude)
        : null,
    };

    let newId = null;
    try {
      if (editingDestination !== null) {
        // Mise à jour dans Supabase
        const { error } = await supabase
          .from("destinations")
          .update(destinationData)
          .eq("id", editingDestination.id);

        if (error) throw error;
        newId = editingDestination.id;
      } else {
        // Insertion dans Supabase
        const { data, error } = await supabase
          .from("destinations")
          .insert([destinationData])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          newId = data[0].id;
        }
      }

      // Mettre à jour les settings locaux aussi
      const newDestination = {
        id: newId,
        zone: destinationForm.zone,
        location: destinationForm.location,
        aller: destinationForm.aller,
        ar: destinationForm.ar,
        features: featuresArray,
        callOnly: destinationForm.callOnly,
        latitude: destinationForm.latitude
          ? parseFloat(destinationForm.latitude)
          : null,
        longitude: destinationForm.longitude
          ? parseFloat(destinationForm.longitude)
          : null,
      };

      const next = JSON.parse(JSON.stringify(localSettings));
      if (editingDestination !== null) {
        const index = next.laReinette.pricing.findIndex(
          (d) => d.location === editingDestination.location,
        );
        if (index !== -1) {
          next.laReinette.pricing[index] = newDestination;
        }
      } else {
        next.laReinette.pricing.push(newDestination);
      }
      setLocalSettings(next);
      updateSettings(next);

      fetchDestinations();
      handleCloseDestinationModal();
      alert(
        editingDestination !== null
          ? "Destination mise à jour avec succès !"
          : "Destination ajoutée avec succès !",
      );
    } catch (e) {
      console.error("Erreur complète:", e);
      console.error("Message d'erreur:", e.message);
      console.error("Détails:", e.details);
      console.error("Code:", e.code);
      console.error("Hint:", e.hint);
      alert(
        `Erreur lors de la sauvegarde de la destination: ${e.message || e}`,
      );
    }
  };

  const handleDeleteDestination = async (destination) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette destination ?")
    )
      return;

    try {
      // Supprimer de Supabase si c'est une destination de Supabase
      if (destination.id) {
        await supabase
          .from("destinations")
          .delete()
          .eq("id", destination.id);
      }
      
      const { error } = await supabase
        .from("destinations")
        .delete()
        .eq("location", destination.location);
      if (error) throw error;

      // Supprimer des settings locaux
      const next = JSON.parse(JSON.stringify(localSettings));
      const index = next.laReinette.pricing.findIndex(
        (d) => d.location === destination.location,
      );
      if (index !== -1) {
        next.laReinette.pricing.splice(index, 1);
      }
      setLocalSettings(next);
      updateSettings(next);

      fetchDestinations();
      alert("Destination supprimée avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression de la destination.");
    }
  };

  const downloadReservationsAsExcel = () => {
    if (reservations.length === 0) return;

    // Définition des colonnes
    const headers = [
      "Date",
      "Heure",
      "Client",
      "Téléphone",
      "Départ",
      "Destination",
      "Statut",
      "Chauffeur",
      "Type",
      "Motif",
    ];

    // Préparation des données CSV
    const csvRows = [
      headers.join(";"), // Header row
      ...reservations.map((res) =>
        [
          res.appointment_date || "",
          res.appointment_time || "",
          res.name || "",
          `"${res.phone || ""}"`, // Quoted to avoid scientific notation
          `"${res.departure || ""}"`,
          `"${res.destination || ""}"`,
          res.status || "En attente",
          res.driver || "Non assigné",
          res.trip_type || "",
          res.motif || "",
        ].join(";"),
      ),
    ];

    const csvString = csvRows.join("\n");

    // Utilisation de BOM UTF-8 pour que Excel reconnaisse les accents
    const blob = new Blob(["\ufeff" + csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reservations_la_reinette_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: "stats", label: "Dashboard", icon: BarChart3 },
    { id: "reservations", label: "Réservations", icon: ListPlus },
    { id: "destinations", label: "Destinations", icon: MapPin },
    { id: "hero", label: "Accueil (Hero)", icon: Home },
    { id: "about", label: "À Propos", icon: Info },
    { id: "services", label: "Prestations", icon: Layers },
    { id: "highlight", label: "Excellence & Guide", icon: Sparkles },
    { id: "reinette", label: "La Reinette", icon: Layout },
    { id: "testimonials", label: "Témoignages (Fixes)", icon: Quote },
    { id: "reviews", label: "Avis Clients", icon: MessageSquare },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "partners", label: "Partenaires", icon: Users },
    { id: "contact", label: "Contact & Footer", icon: Mail },
    { id: "emailConfig", label: "Config EmailJS", icon: Mail },
    { id: "emailsReservation", label: "Mails Réservation", icon: Mail },
    { id: "emailsContact", label: "Mails Contact", icon: Mail },
    { id: "news", label: "News / Conseils", icon: Megaphone },
    { id: "newsletter", label: "Newsletter Emails", icon: Mail },
  ];

  const inputStyle = {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid var(--border-subtle)",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "var(--bg-creme)",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    marginBottom: "0.8rem",
    color: "var(--emerald-900)",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };
  const groupStyle = {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "32px",
    border: "1px solid var(--border-subtle)",
    marginBottom: "2.5rem",
  };

  const updateArrayItem = (path, index, field, value) => {
    const next = JSON.parse(JSON.stringify(localSettings));
    const parts = path.split(".");
    let ref = next;
    for (const p of parts) {
      ref = ref[p];
    }
    ref[index][field] = value;
    setLocalSettings(next);
  };

  const addArrayItem = (path, defaultItem) => {
    const next = JSON.parse(JSON.stringify(localSettings));
    const parts = path.split(".");
    let ref = next;
    for (const p of parts) {
      ref = ref[p];
    }
    ref.push(defaultItem);
    setLocalSettings(next);
  };

  const safeRemove = (path, index) => {
    const next = JSON.parse(JSON.stringify(localSettings));
    const parts = path.split(".");
    let ref = next;
    for (const p of parts) {
      ref = ref[p];
    }
    ref.splice(index, 1);
    setLocalSettings(next);
  };

  return (
    <div
      className="admin-dashboard"
      style={{
        minHeight: "100vh",
        background: "var(--bg-creme)",
        paddingTop: "180px",
      }}
    >
      <div
        className="container admin-layout"
        style={{
          maxWidth: "1600px",
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "5rem",
          paddingBottom: "100px",
        }}
      >
        <aside
          className="admin-sidebar"
          style={{ position: "sticky", top: "220px", height: "fit-content" }}
          role="complementary"
          aria-label="Menu d'administration"
        >
          <div
            style={{
              background: "var(--emerald-900)",
              padding: "2rem",
              borderRadius: "32px",
              color: "#fff",
              marginBottom: "2rem",
            }}
          >
            <h2 className="font-serif" style={{ fontSize: "1.8rem" }}>
              Espace Admin
            </h2>
            <p
              style={{
                fontSize: "0.7rem",
                opacity: 0.6,
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Gestion Intégrale
            </p>
          </div>
          <nav
            style={{
              display: "grid",
              gap: "0.4rem",
              background: "#fff",
              padding: "0.8rem",
              borderRadius: "32px",
              border: "1px solid var(--border-subtle)",
            }}
            role="tablist"
            aria-orientation="vertical"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                role="tab"
                aria-selected={activeTab === t.id}
                aria-controls={`panel-${t.id}`}
                aria-label={t.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  borderRadius: "16px",
                  border: "none",
                  background:
                    activeTab === t.id
                      ? "var(--primary-green-pale)"
                      : "transparent",
                  color:
                    activeTab === t.id
                      ? "var(--primary-green)"
                      : "var(--text-muted)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                <t.icon size={20} aria-hidden="true" /> {t.label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                navigate("/direction/admin");
              }}
              aria-label="Se déconnecter"
              style={{
                marginTop: "1rem",
                color: "#ef4444",
                border: "none",
                background: "none",
                fontWeight: 700,
                cursor: "pointer",
                padding: "1rem",
              }}
            >
              <LogOut
                size={20}
                style={{ marginRight: "1rem", verticalAlign: "middle" }}
                aria-hidden="true"
              />{" "}
              Déconnexion
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          <div
            className="admin-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4rem",
            }}
          >
            <h1
              className="font-serif admin-title"
              style={{ fontSize: "3.5rem", color: "var(--emerald-900)" }}
            >
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            {activeTab !== "stats" && activeTab !== "reservations" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="btn btn-primary admin-save-btn"
                style={{ padding: "1.2rem 3.5rem", borderRadius: "50px" }}
              >
                <Save size={20} /> Enregistrer tout
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {/* STATS */}
            {activeTab === "stats" && (
              <motion.div
                key="st"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-stats"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                    marginBottom: "3rem",
                  }}
                >
                  <div
                    style={{
                      ...groupStyle,
                      marginBottom: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--primary-green-pale)",
                        color: "var(--primary-green)",
                        padding: "1.5rem",
                        borderRadius: "20px",
                      }}
                    >
                      <TrendingUp size={32} aria-hidden="true" />
                    </div>
                    <div>
                      <p style={labelStyle}>Total Réservations</p>
                      <h2
                        style={{
                          fontSize: "3rem",
                          fontWeight: 900,
                          color: "var(--emerald-900)",
                        }}
                      >
                        {reservations.length}
                      </h2>
                    </div>
                  </div>
                </div>
                <div style={groupStyle}>
                  <h3 style={{ marginBottom: "2.5rem", fontSize: "1.5rem" }}>
                    <MapPin
                      style={{ color: "var(--primary-gold)" }}
                      aria-hidden="true"
                    />{" "}
                    Destinations populaires
                  </h3>
                  {(() => {
                    const destCounts = reservations.reduce((acc, res) => {
                      if (res.destination) {
                        const city = res.destination.split(",")[0].trim();
                        acc[city] = (acc[city] || 0) + 1;
                      }
                      return acc;
                    }, {});

                    const topDests = Object.entries(destCounts).sort(
                      (a, b) => b[1] - a[1],
                    );

                    if (topDests.length === 0)
                      return (
                        <p
                          style={{
                            color: "var(--text-muted)",
                            textAlign: "center",
                          }}
                        >
                          Aucune donnée de trajet disponible.
                        </p>
                      );

                    return topDests.map(([city, count], i) => (
                      <div
                        key={i}
                        style={{ marginBottom: "1.5rem" }}
                        role="group"
                        aria-label={`Statistiques pour ${city}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span>{city}</span>
                          <span>{count} voyages</span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            background: "#f0f0f0",
                            borderRadius: "10px",
                          }}
                          role="progressbar"
                          aria-valuenow={Math.round(
                            (count / reservations.length) * 100,
                          )}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`Pourcentage de trajets vers ${city}`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(count / reservations.length) * 100}%`,
                            }}
                            style={{
                              height: "100%",
                              background: "var(--primary-green)",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>
            )}

            {/* RESERVATIONS TABLE */}
            {activeTab === "reservations" && (
              <motion.div
                key="resv"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-reservations"
              >
                <div style={{ ...groupStyle, overflow: "hidden", padding: 0 }}>
                  <div
                    style={{
                      padding: "2rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>Toutes les réservations</h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      {/* LA LOUPE (RECHERCHE) */}
                      <div style={{ position: "relative" }}>
                        <Search
                          size={18}
                          style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          placeholder="Chercher..."
                          aria-label="Rechercher une réservation"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            ...inputStyle,
                            padding: "0.6rem 1rem 0.6rem 2.8rem",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            width: "200px",
                          }}
                        />
                      </div>
                      <button
                        onClick={downloadReservationsAsExcel}
                        className="btn"
                        aria-label="Exporter les réservations en format Excel"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "var(--primary-gold)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Download size={18} aria-hidden="true" /> Exporter Excel
                      </button>
                      {/* LE PLUS (NOUVELLE) */}
                      <button
                        onClick={() => setShowAddResModal(true)}
                        className="btn btn-primary"
                        aria-label="Ajouter une nouvelle réservation manuellement"
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Plus size={18} aria-hidden="true" /> Nouvelle
                      </button>

                      <button
                        onClick={fetchReservations}
                        disabled={isRefreshing}
                        className="btn"
                        aria-label="Actualiser la liste des réservations"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#f0f0f0",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          opacity: isRefreshing ? 0.6 : 1,
                        }}
                      >
                        {isRefreshing ? "Actualisation..." : "Rafraîchir"}
                      </button>
                    </div>
                  </div>
                  {reservations.length === 0 ? (
                    <div
                      style={{
                        padding: "4rem",
                        textAlign: "center",
                        color: "var(--text-muted)",
                      }}
                    >
                      Aucune réservation trouvée.
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{ width: "100%", borderCollapse: "collapse" }}
                        aria-label="Liste des réservations de transport"
                      >
                        <thead style={{ background: "var(--bg-creme)" }}>
                          <tr>
                            <th
                              scope="col"
                              style={{
                                padding: "1.2rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                              }}
                            >
                              Date Demandée
                            </th>
                            <th
                              scope="col"
                              style={{
                                padding: "1.2rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                              }}
                            >
                              Client
                            </th>
                            <th
                              scope="col"
                              style={{
                                padding: "1.2rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                              }}
                            >
                              Trajet
                            </th>
                            <th
                              scope="col"
                              style={{
                                padding: "1.2rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                              }}
                            >
                              Chauffeur
                            </th>
                            <th
                              scope="col"
                              style={{
                                padding: "1.2rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                              }}
                            >
                              Statut
                            </th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations
                            .filter(
                              (r) =>
                                (r.name || "")
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                (r.phone || "").includes(searchTerm) ||
                                (r.departure || "")
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                (r.destination || "")
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()),
                            )
                            .map((res) => (
                              <tr
                                key={res.id}
                                onClick={() => setSelectedRes({ ...res })}
                                style={{
                                  borderBottom:
                                    "1px solid var(--border-subtle)",
                                  cursor: "pointer",
                                  transition: "0.2s",
                                }}
                                onMouseOver={(e) =>
                                  (e.currentTarget.style.background = "#f9fafb")
                                }
                                onMouseOut={(e) =>
                                  (e.currentTarget.style.background =
                                    "transparent")
                                }
                                tabIndex="0"
                                onKeyPress={(e) =>
                                  e.key === "Enter" &&
                                  setSelectedRes({ ...res })
                                }
                                aria-label={`Détails de la réservation pour ${res.name}`}
                              >
                                <td
                                  style={{ padding: "1.2rem", fontWeight: 600 }}
                                >
                                  <time dateTime={res.appointment_date}>
                                    {res.appointment_date || "-"}
                                  </time>
                                  <span
                                    style={{
                                      opacity: 0.5,
                                      fontSize: "0.9em",
                                      marginLeft: "0.5rem",
                                    }}
                                  >
                                    {res.appointment_time}
                                  </span>
                                </td>
                                <td style={{ padding: "1.2rem" }}>
                                  <div style={{ fontWeight: 600 }}>
                                    {res.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      color: "var(--text-muted)",
                                    }}
                                  >
                                    {res.phone}
                                  </div>
                                </td>
                                <td style={{ padding: "1.2rem" }}>
                                  <div>
                                    <span
                                      style={{
                                        color: "var(--primary-green)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      De:
                                    </span>{" "}
                                    {res.departure}
                                  </div>
                                  <div>
                                    <span
                                      style={{
                                        color: "var(--primary-gold)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      À:
                                    </span>{" "}
                                    {res.destination}
                                  </div>
                                </td>
                                <td style={{ padding: "1.2rem" }}>
                                  {res.driver ? (
                                    <span
                                      style={{
                                        background: "#eef2ff",
                                        color: "#4338ca",
                                        padding: "0.3rem 0.8rem",
                                        borderRadius: "50px",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {res.driver}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        color: "#999",
                                        fontStyle: "italic",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      Non assigné
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: "1.2rem" }}>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      padding: "0.4rem 1rem",
                                      borderRadius: "50px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      background:
                                        res.status === "Validée"
                                          ? "#ecfdf5"
                                          : res.status === "Annulée"
                                            ? "#fef2f2"
                                            : "#fffbeb",
                                      color:
                                        res.status === "Validée"
                                          ? "#059669"
                                          : res.status === "Annulée"
                                            ? "#dc2626"
                                            : "#d97706",
                                    }}
                                  >
                                    {res.status || "En attente"}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "1.2rem",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  <ChevronRight size={20} aria-hidden="true" />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* DESTINATIONS */}
            {activeTab === "destinations" && (
              <motion.div
                key="dest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-destinations"
              >
                <div style={groupStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2.5rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>Gestion des Destinations</h3>
                    <button
                      onClick={() => handleOpenDestinationModal()}
                      className="btn btn-primary"
                      style={{
                        padding: "0.8rem 1.5rem",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      aria-label="Ajouter une nouvelle destination"
                    >
                      <Plus size={18} aria-hidden="true" /> Ajouter une
                      destination
                    </button>
                  </div>

                  {localSettings.laReinette.pricing.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "3rem",
                      }}
                    >
                      Aucune destination configurée.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          background: "#fff",
                          borderRadius: "16px",
                          overflow: "hidden",
                        }}
                        aria-label="Tableau de toutes les destinations"
                      >
                        <thead style={{ background: "var(--bg-creme)" }}>
                          <tr>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Zone
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Destination
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Prix Aller
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Prix A/R
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Caractéristiques
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Sur devis
                            </th>
                            <th
                              style={{
                                padding: "1rem",
                                textAlign: "center",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {localSettings.laReinette.pricing.map(
                            (dest, index) => (
                              <tr
                                key={index}
                                style={{
                                  borderBottom:
                                    "1px solid var(--border-subtle)",
                                }}
                              >
                                <td style={{ padding: "0.8rem" }}>
                                  <input
                                    style={{
                                      ...inputStyle,
                                      padding: "0.5rem 0.8rem",
                                      fontSize: "0.9rem",
                                      width: "100%",
                                    }}
                                    value={dest.zone}
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "zone",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </td>
                                <td style={{ padding: "0.8rem" }}>
                                  <input
                                    style={{
                                      ...inputStyle,
                                      padding: "0.5rem 0.8rem",
                                      fontSize: "0.9rem",
                                      width: "100%",
                                    }}
                                    value={dest.location}
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "location",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </td>
                                <td style={{ padding: "0.8rem" }}>
                                  <input
                                    style={{
                                      ...inputStyle,
                                      padding: "0.5rem 0.8rem",
                                      fontSize: "0.9rem",
                                      width: "80px",
                                    }}
                                    value={dest.aller}
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "aller",
                                        e.target.value,
                                      )
                                    }
                                    disabled={dest.callOnly || dest.call_only}
                                    placeholder={
                                      dest.callOnly || dest.call_only
                                        ? "Sur devis"
                                        : ""
                                    }
                                  />
                                </td>
                                <td style={{ padding: "0.8rem" }}>
                                  <input
                                    style={{
                                      ...inputStyle,
                                      padding: "0.5rem 0.8rem",
                                      fontSize: "0.9rem",
                                      width: "80px",
                                    }}
                                    value={dest.ar}
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "ar",
                                        e.target.value,
                                      )
                                    }
                                    disabled={dest.callOnly || dest.call_only}
                                    placeholder={
                                      dest.callOnly || dest.call_only
                                        ? "Sur devis"
                                        : ""
                                    }
                                  />
                                </td>
                                <td style={{ padding: "0.8rem" }}>
                                  <input
                                    style={{
                                      ...inputStyle,
                                      padding: "0.5rem 0.8rem",
                                      fontSize: "0.9rem",
                                      width: "100%",
                                    }}
                                    value={(dest.features || []).join(", ")}
                                    onChange={(e) => {
                                      const featuresArray = e.target.value
                                        .split(",")
                                        .map((f) => f.trim())
                                        .filter((f) => f);
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "features",
                                        featuresArray,
                                      );
                                    }}
                                  />
                                </td>
                                <td
                                  style={{
                                    padding: "0.8rem",
                                    textAlign: "center",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      dest.callOnly || dest.call_only || false
                                    }
                                    onChange={(e) =>
                                      updateArrayItem(
                                        "laReinette.pricing",
                                        index,
                                        "callOnly",
                                        e.target.checked,
                                      )
                                    }
                                  />
                                </td>
                                <td
                                  style={{
                                    padding: "0.8rem",
                                    textAlign: "center",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleDeleteDestination(dest)
                                    }
                                    style={{
                                      padding: "0.5rem 0.8rem",
                                      background: "#fef2f2",
                                      color: "#dc2626",
                                      border: "1px solid #fee2e2",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontWeight: 600,
                                      fontSize: "0.85rem",
                                    }}
                                    aria-label={`Supprimer ${dest.location}`}
                                  >
                                    <Trash2 size={14} aria-hidden="true" />
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Modal pour ajouter/modifier une destination */}
                <AnimatePresence>
                  {showDestinationModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                      onClick={handleCloseDestinationModal}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{
                          background: "#fff",
                          padding: "3rem",
                          borderRadius: "32px",
                          maxWidth: "600px",
                          width: "90%",
                          maxHeight: "90vh",
                          overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3
                          style={{
                            fontSize: "1.8rem",
                            marginBottom: "2rem",
                            color: "var(--emerald-900)",
                          }}
                        >
                          {editingDestination !== null
                            ? "Modifier la destination"
                            : "Ajouter une destination"}
                        </h3>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                          <div>
                            <label style={labelStyle} htmlFor="dest-zone">
                              Zone
                            </label>
                            <select
                              id="dest-zone"
                              style={inputStyle}
                              value={destinationForm.zone}
                              onChange={(e) =>
                                setDestinationForm({
                                  ...destinationForm,
                                  zone: e.target.value,
                                })
                              }
                            >
                              <option value="">Sélectionner une zone</option>
                              <option value="Zone Locale">Zone Locale</option>
                              <option value="Zone Limitrophe 92">
                                Zone Limitrophe 92
                              </option>
                              <option value="Zone Limitrophe 92 Autres">
                                Autres communes du 92
                              </option>
                              <option value="Zone Limitrophe 94">
                                Zone Limitrophe 94
                              </option>
                              <option value="Zone Hospitalière">
                                Zone Hospitalière
                              </option>
                              <option value="Longue Distance">
                                Longue Distance
                              </option>
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle} htmlFor="dest-location">
                              Destination(s)
                            </label>
                            <input
                              id="dest-location"
                              style={inputStyle}
                              value={destinationForm.location}
                              onChange={(e) =>
                                setDestinationForm({
                                  ...destinationForm,
                                  location: e.target.value,
                                })
                              }
                              placeholder="Ex: Bourg-la-Reine, Antony, Hôpital Béclère"
                            />
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "1rem",
                            }}
                          >
                            <div>
                              <label style={labelStyle} htmlFor="dest-aller">
                                Prix Aller
                              </label>
                              <input
                                id="dest-aller"
                                style={inputStyle}
                                value={destinationForm.aller}
                                onChange={(e) =>
                                  setDestinationForm({
                                    ...destinationForm,
                                    aller: e.target.value,
                                  })
                                }
                                disabled={destinationForm.callOnly}
                                placeholder="Ex: 5€"
                              />
                            </div>
                            <div>
                              <label style={labelStyle} htmlFor="dest-ar">
                                Prix A/R
                              </label>
                              <input
                                id="dest-ar"
                                style={inputStyle}
                                value={destinationForm.ar}
                                onChange={(e) =>
                                  setDestinationForm({
                                    ...destinationForm,
                                    ar: e.target.value,
                                  })
                                }
                                disabled={destinationForm.callOnly}
                                placeholder="Ex: 10€"
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "1rem",
                            }}
                          >
                            <div>
                              <label style={labelStyle} htmlFor="dest-latitude">
                                Latitude (pour la carte)
                              </label>
                              <input
                                id="dest-latitude"
                                style={inputStyle}
                                value={destinationForm.latitude}
                                onChange={(e) =>
                                  setDestinationForm({
                                    ...destinationForm,
                                    latitude: e.target.value,
                                  })
                                }
                                placeholder="Ex: 48.7875"
                              />
                            </div>
                            <div>
                              <label
                                style={labelStyle}
                                htmlFor="dest-longitude"
                              >
                                Longitude (pour la carte)
                              </label>
                              <input
                                id="dest-longitude"
                                style={inputStyle}
                                value={destinationForm.longitude}
                                onChange={(e) =>
                                  setDestinationForm({
                                    ...destinationForm,
                                    longitude: e.target.value,
                                  })
                                }
                                placeholder="Ex: 2.3292"
                              />
                            </div>
                          </div>
                          <div>
                            <label style={labelStyle} htmlFor="dest-features">
                              Caractéristiques (séparées par des virgules)
                            </label>
                            <input
                              id="dest-features"
                              style={inputStyle}
                              value={destinationForm.features}
                              onChange={(e) =>
                                setDestinationForm({
                                  ...destinationForm,
                                  features: e.target.value,
                                })
                              }
                              placeholder="Ex: Trajets internes, Commerces, RDV Médicaux"
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.8rem",
                            }}
                          >
                            <input
                              type="checkbox"
                              id="dest-callOnly"
                              checked={destinationForm.callOnly}
                              onChange={(e) =>
                                setDestinationForm({
                                  ...destinationForm,
                                  callOnly: e.target.checked,
                                })
                              }
                            />
                            <label
                              htmlFor="dest-callOnly"
                              style={{
                                margin: 0,
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                cursor: "pointer",
                              }}
                            >
                              Tarif sur demande uniquement
                            </label>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            marginTop: "2rem",
                          }}
                        >
                          <button
                            onClick={handleSaveDestination}
                            className="btn btn-primary"
                            style={{
                              flex: 1,
                              padding: "1rem",
                              borderRadius: "12px",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            {editingDestination !== null
                              ? "Enregistrer les modifications"
                              : "Ajouter la destination"}
                          </button>
                          <button
                            onClick={handleCloseDestinationModal}
                            style={{
                              flex: 1,
                              padding: "1rem",
                              borderRadius: "12px",
                              cursor: "pointer",
                              fontWeight: 700,
                              background: "#f3f4f6",
                              border: "none",
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* HERO ACCEUIL */}
            {activeTab === "hero" && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-hero"
              >
                <div style={groupStyle}>
                  <label style={labelStyle} htmlFor="hero-label">
                    Label Bienvenue
                  </label>
                  <input
                    id="hero-label"
                    style={inputStyle}
                    value={localSettings.hero.label}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        hero: { ...localSettings.hero, label: e.target.value },
                      })
                    }
                  />
                  <div
                    style={{
                      marginTop: "2rem",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle} htmlFor="hero-title">
                        Titre (Ligne 1)
                      </label>
                      <input
                        id="hero-title"
                        style={inputStyle}
                        value={localSettings.hero.title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            hero: {
                              ...localSettings.hero,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="hero-subtitle">
                        Sous-titre (Ligne 2)
                      </label>
                      <input
                        id="hero-subtitle"
                        style={inputStyle}
                        value={localSettings.hero.subtitle}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            hero: {
                              ...localSettings.hero,
                              subtitle: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    <label style={labelStyle} htmlFor="hero-desc">
                      Description Principale
                    </label>
                    <textarea
                      id="hero-desc"
                      style={{ ...inputStyle, minHeight: "120px" }}
                      value={localSettings.hero.description}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          hero: {
                            ...localSettings.hero,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABOUT */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-about"
              >
                <div style={groupStyle}>
                  <label style={labelStyle} htmlFor="about-label">
                    Section Label
                  </label>
                  <input
                    id="about-label"
                    style={inputStyle}
                    value={localSettings.about.label}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        about: {
                          ...localSettings.about,
                          label: e.target.value,
                        },
                      })
                    }
                  />
                  <div
                    style={{
                      marginTop: "2rem",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle} htmlFor="about-title">
                        Titre
                      </label>
                      <input
                        id="about-title"
                        style={inputStyle}
                        value={localSettings.about.title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            about: {
                              ...localSettings.about,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="about-subtitle">
                        Sous-titre (Doré)
                      </label>
                      <input
                        id="about-subtitle"
                        style={inputStyle}
                        value={localSettings.about.subtitle}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            about: {
                              ...localSettings.about,
                              subtitle: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "2rem" }}>
                    <label style={labelStyle} htmlFor="about-desc">
                      Bio / Description
                    </label>
                    <textarea
                      id="about-desc"
                      style={{ ...inputStyle, minHeight: "120px" }}
                      value={localSettings.about.description}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          about: {
                            ...localSettings.about,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div style={groupStyle}>
                  <h3 style={{ marginBottom: "2rem" }}>
                    Arguments Clés (Liste)
                  </h3>
                  {localSettings.about.points.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <label
                        style={{
                          ...labelStyle,
                          width: "40px",
                          marginBottom: 0,
                          alignSelf: "center",
                        }}
                        htmlFor={`about-point-${i}`}
                      >
                        {i + 1}
                      </label>
                      <input
                        id={`about-point-${i}`}
                        style={inputStyle}
                        value={p}
                        onChange={(e) => {
                          const next = [...localSettings.about.points];
                          next[i] = e.target.value;
                          setLocalSettings({
                            ...localSettings,
                            about: { ...localSettings.about, points: next },
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PRESTATIONS */}
            {activeTab === "services" && (
              <motion.div
                key="srv"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-services"
              >
                <div style={groupStyle}>
                  <label style={labelStyle} htmlFor="srv-label">
                    Label Section
                  </label>
                  <input
                    id="srv-label"
                    style={inputStyle}
                    value={localSettings.services.label}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        services: {
                          ...localSettings.services,
                          label: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                {localSettings.services.items.map((s, i) => (
                  <div key={i} style={groupStyle}>
                    <h3
                      style={{
                        marginBottom: "1.5rem",
                        color: "var(--primary-gold)",
                      }}
                    >
                      Prestation {i + 1}
                    </h3>
                    <label style={labelStyle} htmlFor={`srv-title-${i}`}>
                      Titre
                    </label>
                    <input
                      id={`srv-title-${i}`}
                      style={{ ...inputStyle, marginBottom: "1.5rem" }}
                      value={s.title}
                      onChange={(e) =>
                        updateArrayItem(
                          "services.items",
                          i,
                          "title",
                          e.target.value,
                        )
                      }
                    />
                    <label style={labelStyle} htmlFor={`srv-desc-${i}`}>
                      Description
                    </label>
                    <textarea
                      id={`srv-desc-${i}`}
                      style={{ ...inputStyle, minHeight: "80px" }}
                      value={s.desc}
                      onChange={(e) =>
                        updateArrayItem(
                          "services.items",
                          i,
                          "desc",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* HIGHLIGHT & WIZARD */}
            {activeTab === "highlight" && (
              <motion.div
                key="hgl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-highlight"
              >
                {/* WIZARD */}
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Guide Personnalisé (Wizard)
                  </h3>
                  <label style={labelStyle} htmlFor="wiz-title">
                    Titre Guide
                  </label>
                  <input
                    id="wiz-title"
                    style={inputStyle}
                    value={localSettings.wizard.title}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        wizard: {
                          ...localSettings.wizard,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                  <div style={{ marginTop: "1.5rem" }}>
                    <label style={labelStyle} htmlFor="wiz-desc">
                      Description Guide
                    </label>
                    <input
                      id="wiz-desc"
                      style={inputStyle}
                      value={localSettings.wizard.description}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          wizard: {
                            ...localSettings.wizard,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                {/* EXCELLENCE */}
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Excellence Médicale (Highlight)
                  </h3>
                  <label style={labelStyle} htmlFor="high-title">
                    Titre Principal
                  </label>
                  <input
                    id="high-title"
                    style={inputStyle}
                    value={localSettings.highlight.title}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        highlight: {
                          ...localSettings.highlight,
                          title: e.target.value,
                        },
                      })
                    }
                  />
                  <div style={{ marginTop: "1.5rem" }}>
                    <label style={labelStyle} htmlFor="high-subtitle">
                      Sous-titre (Doré)
                    </label>
                    <input
                      id="high-subtitle"
                      style={inputStyle}
                      value={localSettings.highlight.subtitle}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          highlight: {
                            ...localSettings.highlight,
                            subtitle: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div style={{ marginTop: "1.5rem" }}>
                    <label style={labelStyle} htmlFor="high-desc">
                      Description
                    </label>
                    <textarea
                      id="high-desc"
                      style={{ ...inputStyle, minHeight: "100px" }}
                      value={localSettings.highlight.description}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          highlight: {
                            ...localSettings.highlight,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  {/* Highlight Items */}
                  <h4 style={{ marginTop: "3rem", marginBottom: "1.5rem" }}>
                    Points Clés
                  </h4>
                  {localSettings.highlight.items.map((it, i) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                      <label
                        style={{ ...labelStyle, display: "none" }}
                        htmlFor={`high-item-${i}`}
                      >
                        Point clé {i + 1}
                      </label>
                      <input
                        id={`high-item-${i}`}
                        style={inputStyle}
                        value={it.label}
                        onChange={(e) =>
                          updateArrayItem(
                            "highlight.items",
                            i,
                            "label",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REINETTE */}
            {activeTab === "reinette" && (
              <motion.div
                key="rn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-reinette"
              >
                <div style={groupStyle}>
                  <h3 style={{ marginBottom: "2rem" }}>Tarifs La Reinette</h3>
                  <button
                    onClick={() =>
                      addArrayItem("laReinette.pricing", {
                        zone: "Zone",
                        location: "Ville",
                        aller: "0€",
                        ar: "0€",
                        features: ["Service inclus"],
                      })
                    }
                    className="btn btn-primary"
                    style={{ marginBottom: "1.5rem" }}
                    aria-label="Ajouter une nouvelle ligne de tarif"
                  >
                    + Ajouter un Tarif
                  </button>
                  {localSettings.laReinette.pricing.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "2rem",
                        background: "#f9f9f9",
                        borderRadius: "24px",
                        marginBottom: "1.5rem",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => safeRemove("laReinette.pricing", i)}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        aria-label={`Supprimer le tarif pour ${p.location}`}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <label style={labelStyle} htmlFor={`rein-zone-${i}`}>
                            Zone
                          </label>
                          <input
                            id={`rein-zone-${i}`}
                            style={inputStyle}
                            value={p.zone}
                            onChange={(e) =>
                              updateArrayItem(
                                "laReinette.pricing",
                                i,
                                "zone",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label style={labelStyle} htmlFor={`rein-loc-${i}`}>
                            Destination(s)
                          </label>
                          <input
                            id={`rein-loc-${i}`}
                            style={inputStyle}
                            value={p.location}
                            onChange={(e) =>
                              updateArrayItem(
                                "laReinette.pricing",
                                i,
                                "location",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: "1rem",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          <label style={labelStyle} htmlFor={`rein-aller-${i}`}>
                            Prix Aller
                          </label>
                          <input
                            id={`rein-aller-${i}`}
                            style={inputStyle}
                            disabled={p.callOnly}
                            value={p.aller}
                            onChange={(e) =>
                              updateArrayItem(
                                "laReinette.pricing",
                                i,
                                "aller",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <label style={labelStyle} htmlFor={`rein-ar-${i}`}>
                            Prix A/R
                          </label>
                          <input
                            id={`rein-ar-${i}`}
                            style={inputStyle}
                            disabled={p.callOnly}
                            value={p.ar}
                            onChange={(e) =>
                              updateArrayItem(
                                "laReinette.pricing",
                                i,
                                "ar",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            paddingBottom: "0.8rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`rein-call-${i}`}
                            checked={p.callOnly || false}
                            onChange={(e) =>
                              updateArrayItem(
                                "laReinette.pricing",
                                i,
                                "callOnly",
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            htmlFor={`rein-call-${i}`}
                            style={{
                              margin: 0,
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            Appeler pour tarif
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TESTIMONIALS */}
            {activeTab === "testimonials" && (
              <motion.div
                key="test"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-testimonials"
              >
                <div style={groupStyle}>
                  <button
                    onClick={() =>
                      addArrayItem("testimonials", {
                        name: "Nouveau",
                        role: "...",
                        content: "...",
                        image: "",
                      })
                    }
                    className="btn btn-primary"
                    aria-label="Ajouter un nouveau témoignage fixe"
                  >
                    + Ajouter Témoignage
                  </button>
                  <div style={{ marginTop: "2.5rem" }}>
                    {localSettings.testimonials.map((t, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "2rem",
                          border: "1px solid #eee",
                          borderRadius: "24px",
                          marginBottom: "1.5rem",
                          position: "relative",
                          background: t.isHidden ? "#f5f5f5" : "#fff",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            display: "flex",
                            gap: "0.8rem",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateArrayItem(
                                "testimonials",
                                i,
                                "isHidden",
                                !t.isHidden,
                              )
                            }
                            style={{
                              border: "none",
                              background: "none",
                              color: t.isHidden ? "#999" : "var(--emerald-600)",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                            aria-label={
                              t.isHidden
                                ? "Rendre visible"
                                : "Cacher ce témoignage"
                            }
                          >
                            {t.isHidden ? "Caché" : "Visible"}
                          </button>
                          <button
                            onClick={() => safeRemove("testimonials", i)}
                            style={{
                              color: "#ef4444",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            aria-label={`Supprimer le témoignage de ${t.name}`}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </div>
                        <label style={labelStyle} htmlFor={`test-name-${i}`}>
                          Nom de l'auteur
                        </label>
                        <input
                          id={`test-name-${i}`}
                          style={{
                            ...inputStyle,
                            marginBottom: "0.8rem",
                            fontWeight: 800,
                            width: "80%",
                          }}
                          value={t.name}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              i,
                              "name",
                              e.target.value,
                            )
                          }
                        />
                        <label style={labelStyle} htmlFor={`test-content-${i}`}>
                          Contenu du témoignage
                        </label>
                        <textarea
                          id={`test-content-${i}`}
                          style={inputStyle}
                          value={t.content}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              i,
                              "content",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS (DYNAMIC) */}
            {activeTab === "reviews" && (
              <motion.div
                key="revs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-reviews"
              >
                <div style={groupStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2.5rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>Gestion des Avis Clients</h3>
                    <button
                      onClick={fetchReviews}
                      disabled={isRefreshingReviews}
                      className="btn"
                      style={{
                        background: "var(--bg-creme)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "12px",
                        padding: "0.6rem 1.2rem",
                        cursor: "pointer",
                      }}
                      aria-label="Actualiser la liste des avis clients"
                    >
                      {isRefreshingReviews ? "Chargement..." : "Actualiser"}
                    </button>
                  </div>

                  {reviews.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        padding: "3rem",
                      }}
                    >
                      Aucun avis client pour le moment.
                    </p>
                  ) : (
                    <div style={{ display: "grid", gap: "1.5rem" }}>
                      {reviews.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            padding: "2rem",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "24px",
                            background: r.is_approved ? "#fff" : "#fffbeb",
                          }}
                          role="article"
                          aria-label={`Avis de ${r.name}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "1rem",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: "1.1rem",
                                  color: "var(--emerald-900)",
                                }}
                              >
                                {r.name}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "2px",
                                  marginTop: "0.3rem",
                                }}
                                aria-label={`Note de ${r.rating} sur 5`}
                              >
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={
                                      i < r.rating
                                        ? "var(--primary-gold)"
                                        : "none"
                                    }
                                    stroke={
                                      i < r.rating
                                        ? "var(--primary-gold)"
                                        : "#ccc"
                                    }
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.8rem",
                                alignItems: "center",
                              }}
                            >
                              {r.is_approved ? (
                                <span
                                  style={{
                                    color: "#059669",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  Publié
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "#d97706",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  En attente
                                </span>
                              )}
                              <div
                                style={{
                                  borderLeft: "1px solid #eee",
                                  height: "20px",
                                  margin: "0 5px",
                                }}
                              ></div>
                              {r.is_approved ? (
                                <button
                                  onClick={() =>
                                    handleApproveReview(r.id, false)
                                  }
                                  style={{
                                    color: "#d97706",
                                    border: "none",
                                    background: "none",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                  }}
                                  aria-label={`Dépublier l'avis de ${r.name}`}
                                >
                                  Dépublier
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleApproveReview(r.id, true)
                                  }
                                  style={{
                                    color: "#059669",
                                    border: "none",
                                    background: "none",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                  }}
                                  aria-label={`Approuver l'avis de ${r.name}`}
                                >
                                  Approuver
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                style={{
                                  color: "#ef4444",
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                }}
                                aria-label={`Supprimer l'avis de ${r.name}`}
                              >
                                <Trash2 size={20} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontStyle: "italic",
                              color: "var(--text-main)",
                              fontSize: "1rem",
                              lineHeight: "1.6",
                            }}
                          >
                            "{r.comment}"
                          </p>
                          <div
                            style={{
                              marginTop: "1rem",
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            Déposé le :{" "}
                            {new Date(r.created_at).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <motion.div
                key="faq"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-faq"
              >
                <div style={groupStyle}>
                  <button
                    onClick={() =>
                      addArrayItem("faq.questions", {
                        q: "Question ?",
                        a: "Réponse...",
                        category: "Tous",
                      })
                    }
                    className="btn btn-primary"
                    aria-label="Ajouter une nouvelle question à la FAQ"
                  >
                    + Ajouter FAQ
                  </button>
                  <div style={{ marginTop: "2.5rem" }}>
                    {localSettings.faq.questions.map((q, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "1.5rem",
                          border: "1px solid #eee",
                          borderRadius: "24px",
                          marginBottom: "1rem",
                        }}
                      >
                        <label style={labelStyle} htmlFor={`faq-q-${i}`}>
                          Question {i + 1}
                        </label>
                        <input
                          id={`faq-q-${i}`}
                          style={{ ...inputStyle, fontWeight: 700 }}
                          value={q.q}
                          onChange={(e) =>
                            updateArrayItem(
                              "faq.questions",
                              i,
                              "q",
                              e.target.value,
                            )
                          }
                        />
                        <label
                          style={{ ...labelStyle, marginTop: "1rem" }}
                          htmlFor={`faq-a-${i}`}
                        >
                          Réponse {i + 1}
                        </label>
                        <textarea
                          id={`faq-a-${i}`}
                          style={{ ...inputStyle, marginTop: "0.8rem" }}
                          value={q.a}
                          onChange={(e) =>
                            updateArrayItem(
                              "faq.questions",
                              i,
                              "a",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PARTNERS */}
            {activeTab === "partners" && (
              <motion.div
                key="part"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-partners"
              >
                {/* Header & Certification */}
                <div style={groupStyle}>
                  <h3 style={{ marginBottom: "2rem" }}>
                    En-tête & Certification
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle} htmlFor="part-label">
                        Label Section
                      </label>
                      <input
                        id="part-label"
                        style={inputStyle}
                        value={localSettings.partners.label}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            partners: {
                              ...localSettings.partners,
                              label: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="part-title">
                        Titre Principal
                      </label>
                      <input
                        id="part-title"
                        style={inputStyle}
                        value={localSettings.partners.title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            partners: {
                              ...localSettings.partners,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={labelStyle} htmlFor="part-subtitle">
                      Sous-titre (Vert)
                    </label>
                    <input
                      id="part-subtitle"
                      style={inputStyle}
                      value={localSettings.partners.subtitle}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          partners: {
                            ...localSettings.partners,
                            subtitle: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={labelStyle} htmlFor="part-desc">
                      Description Intro
                    </label>
                    <textarea
                      id="part-desc"
                      style={{ ...inputStyle, minHeight: "80px" }}
                      value={localSettings.partners.description}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          partners: {
                            ...localSettings.partners,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div
                    style={{ borderTop: "1px solid #eee", paddingTop: "2rem" }}
                  >
                    <label style={labelStyle} htmlFor="part-cert-title">
                      Titre Bannière Certification
                    </label>
                    <input
                      id="part-cert-title"
                      style={inputStyle}
                      value={localSettings.partners.certificationTitle}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          partners: {
                            ...localSettings.partners,
                            certificationTitle: e.target.value,
                          },
                        })
                      }
                    />
                    <div style={{ marginTop: "1.5rem" }}>
                      <label style={labelStyle} htmlFor="part-cert-desc">
                        Description Certification
                      </label>
                      <textarea
                        id="part-cert-desc"
                        style={{ ...inputStyle, minHeight: "100px" }}
                        value={localSettings.partners.certificationDesc}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            partners: {
                              ...localSettings.partners,
                              certificationDesc: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Categories & Partners */}
                <div style={groupStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    <h3 style={{ color: "var(--primary-green)" }}>
                      Structure du Réseau
                    </h3>
                    <button
                      onClick={() =>
                        addArrayItem("partners.categories", {
                          title: "Nouvelle Catégorie",
                          iconType: "Landmark",
                          items: [],
                        })
                      }
                      className="btn btn-primary"
                      aria-label="Ajouter une nouvelle catégorie de partenaires"
                    >
                      + Nouvelle Catégorie
                    </button>
                  </div>

                  {localSettings.partners.categories.map((cat, ci) => (
                    <div
                      key={ci}
                      style={{
                        padding: "2.5rem",
                        background: "#f9f9f9",
                        borderRadius: "32px",
                        marginBottom: "2.5rem",
                        position: "relative",
                        border: "1px solid #eee",
                      }}
                      role="region"
                      aria-label={`Catégorie : ${cat.title}`}
                    >
                      <button
                        onClick={() => safeRemove("partners.categories", ci)}
                        style={{
                          position: "absolute",
                          top: "1.5rem",
                          right: "1.5rem",
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        aria-label={`Supprimer la catégorie ${cat.title}`}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>

                      <div
                        style={{ maxWidth: "400px", marginBottom: "2.5rem" }}
                      >
                        <label
                          style={labelStyle}
                          htmlFor={`part-cat-title-${ci}`}
                        >
                          Nom de la Catégorie
                        </label>
                        <input
                          id={`part-cat-title-${ci}`}
                          style={{ ...inputStyle, fontWeight: 900 }}
                          value={cat.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "partners.categories",
                              ci,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Membres de la catégorie
                        </h4>
                        <button
                          onClick={() => {
                            const next = JSON.parse(
                              JSON.stringify(localSettings),
                            );
                            next.partners.categories[ci].items.push({
                              name: "Nom",
                              desc: "Description",
                              url: "#",
                              iconType: "ExternalLink",
                            });
                            setLocalSettings(next);
                          }}
                          style={{
                            color: "var(--primary-green)",
                            background: "none",
                            border: "none",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                          aria-label={`Ajouter un partenaire à la catégorie ${cat.title}`}
                        >
                          <Plus size={16} aria-hidden="true" /> Ajouter un
                          partenaire
                        </button>
                      </div>

                      <div style={{ display: "grid", gap: "1rem" }}>
                        {cat.items.map((item, ii) => (
                          <div
                            key={ii}
                            style={{
                              background: "#fff",
                              padding: "1.5rem",
                              borderRadius: "20px",
                              border: "1px solid #eee",
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 40px",
                              gap: "1rem",
                              alignItems: "center",
                            }}
                            role="group"
                            aria-label={`Partenaire ${ii + 1}`}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label
                                style={{ ...labelStyle, fontSize: "0.7rem" }}
                                htmlFor={`part-item-name-${ci}-${ii}`}
                              >
                                Nom
                              </label>
                              <input
                                id={`part-item-name-${ci}-${ii}`}
                                style={{
                                  ...inputStyle,
                                  background: "var(--bg-white)",
                                  fontWeight: 700,
                                }}
                                value={item.name}
                                onChange={(e) => {
                                  const next = JSON.parse(
                                    JSON.stringify(localSettings),
                                  );
                                  next.partners.categories[ci].items[ii].name =
                                    e.target.value;
                                  setLocalSettings(next);
                                }}
                                placeholder="Nom"
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label
                                style={{ ...labelStyle, fontSize: "0.7rem" }}
                                htmlFor={`part-item-desc-${ci}-${ii}`}
                              >
                                Description
                              </label>
                              <input
                                id={`part-item-desc-${ci}-${ii}`}
                                style={{
                                  ...inputStyle,
                                  background: "var(--bg-white)",
                                }}
                                value={item.desc}
                                onChange={(e) => {
                                  const next = JSON.parse(
                                    JSON.stringify(localSettings),
                                  );
                                  next.partners.categories[ci].items[ii].desc =
                                    e.target.value;
                                  setLocalSettings(next);
                                }}
                                placeholder="Description courte"
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <label
                                style={{ ...labelStyle, fontSize: "0.7rem" }}
                                htmlFor={`part-item-url-${ci}-${ii}`}
                              >
                                URL
                              </label>
                              <input
                                id={`part-item-url-${ci}-${ii}`}
                                style={{
                                  ...inputStyle,
                                  background: "var(--bg-white)",
                                  color: "var(--primary-green)",
                                }}
                                value={item.url}
                                onChange={(e) => {
                                  const next = JSON.parse(
                                    JSON.stringify(localSettings),
                                  );
                                  next.partners.categories[ci].items[ii].url =
                                    e.target.value;
                                  setLocalSettings(next);
                                }}
                                placeholder="URL Site Web"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const next = JSON.parse(
                                  JSON.stringify(localSettings),
                                );
                                next.partners.categories[ci].items.splice(
                                  ii,
                                  1,
                                );
                                setLocalSettings(next);
                              }}
                              style={{
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                alignSelf: "center",
                                marginTop: "1rem",
                              }}
                              aria-label={`Supprimer le partenaire ${item.name}`}
                            >
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {/* CONTACT & FOOTER */}
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* STANDARD CONTACT */}
                <div style={groupStyle}>
                  <h3 style={{ marginBottom: "2rem" }}>Coordonnées Standard</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        style={inputStyle}
                        value={localSettings.contact.email}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            contact: {
                              ...localSettings.contact,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Ville</label>
                      <input
                        style={inputStyle}
                        value={localSettings.contact.city}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            contact: {
                              ...localSettings.contact,
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1.5rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Adresse Physique</label>
                      <input
                        style={inputStyle}
                        value={localSettings.contact.address}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            contact: {
                              ...localSettings.contact,
                              address: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Tél. Logistique</label>
                      <input
                        style={inputStyle}
                        value={localSettings.contact.logisticsPhone}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            contact: {
                              ...localSettings.contact,
                              logisticsPhone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Tél. Standard</label>
                      <input
                        style={inputStyle}
                        value={localSettings.contact.standardPhone}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            contact: {
                              ...localSettings.contact,
                              standardPhone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* EMERGENCY NUMBERS */}
                <div style={groupStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    <h3 style={{ color: "#ef4444" }}>Numéros d'Urgence</h3>
                    <button
                      onClick={() =>
                        addArrayItem("emergencyNumbers", {
                          label: "Nouveau",
                          number: "00",
                        })
                      }
                      className="btn btn-primary"
                      style={{ background: "#ef4444", border: "none" }}
                    >
                      + Ajouter un Numéro
                    </button>
                  </div>
                  {localSettings.emergencyNumbers.map((num, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 40px",
                        gap: "1rem",
                        marginBottom: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={inputStyle}
                        value={num.label}
                        onChange={(e) =>
                          updateArrayItem(
                            "emergencyNumbers",
                            i,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label (ex: SAMU)"
                      />
                      <input
                        style={inputStyle}
                        value={num.number}
                        onChange={(e) =>
                          updateArrayItem(
                            "emergencyNumbers",
                            i,
                            "number",
                            e.target.value,
                          )
                        }
                        placeholder="Numéro (ex: 15)"
                      />
                      <button
                        onClick={() => safeRemove("emergencyNumbers", i)}
                        style={{
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Gestion du Formulaire
                  </h3>
                  <label style={labelStyle}>
                    Email de Réception (FormSubmit)
                  </label>
                  <input
                    style={inputStyle}
                    value={localSettings.contact.formRecipientEmail}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        contact: {
                          ...localSettings.contact,
                          formRecipientEmail: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                {/* FULL FOOTER MANAGER */}
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2.5rem",
                      color: "var(--primary-gold)",
                    }}
                  >
                    Configuration du Pied de Page (Footer)
                  </h3>

                  <div style={{ marginBottom: "3rem" }}>
                    <label style={labelStyle}>Texte Slogan (Tagline)</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "80px" }}
                      value={localSettings.footer.tagline}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          footer: {
                            ...localSettings.footer,
                            tagline: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div style={{ marginBottom: "3rem" }}>
                    <label style={labelStyle}>Copyright</label>
                    <input
                      style={inputStyle}
                      value={localSettings.footer.copyright}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          footer: {
                            ...localSettings.footer,
                            copyright: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <h4
                    style={{
                      marginBottom: "1.5rem",
                      color: "var(--emerald-900)",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.8rem",
                    }}
                  >
                    Titres des Colonnes
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1.5rem",
                      marginBottom: "3rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Col 1 (Liens)</label>
                      <input
                        style={inputStyle}
                        value={localSettings.footer.columns.col1Title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            footer: {
                              ...localSettings.footer,
                              columns: {
                                ...localSettings.footer.columns,
                                col1Title: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Col 2 (Urgences)</label>
                      <input
                        style={inputStyle}
                        value={localSettings.footer.columns.col2Title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            footer: {
                              ...localSettings.footer,
                              columns: {
                                ...localSettings.footer.columns,
                                col2Title: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Col 3 (Contact)</label>
                      <input
                        style={inputStyle}
                        value={localSettings.footer.columns.col3Title}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            footer: {
                              ...localSettings.footer,
                              columns: {
                                ...localSettings.footer.columns,
                                col3Title: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <h4
                    style={{
                      marginBottom: "1.5rem",
                      color: "var(--emerald-900)",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.8rem",
                    }}
                  >
                    Réseaux Sociaux
                  </h4>
                  <button
                    onClick={() =>
                      addArrayItem("footer.socials", {
                        platform: "Facebook",
                        url: "#",
                      })
                    }
                    className="btn btn-primary"
                    style={{ marginBottom: "1.5rem" }}
                  >
                    + Ajouter un Réseau
                  </button>
                  {localSettings.footer.socials.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 40px",
                        gap: "1rem",
                        marginBottom: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <select
                        style={inputStyle}
                        value={s.platform}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.socials",
                            i,
                            "platform",
                            e.target.value,
                          )
                        }
                      >
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Linkedin">Linkedin</option>
                      </select>
                      <input
                        style={inputStyle}
                        value={s.url}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.socials",
                            i,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="URL complète"
                      />
                      <button
                        onClick={() => safeRemove("footer.socials", i)}
                        style={{
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}

                  <h4
                    style={{
                      marginTop: "3rem",
                      marginBottom: "1.5rem",
                      color: "var(--emerald-900)",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.8rem",
                    }}
                  >
                    Liens Utiles (Colonne 1)
                  </h4>
                  <button
                    onClick={() =>
                      addArrayItem("footer.links", {
                        label: "Nouveau lien",
                        path: "/",
                      })
                    }
                    className="btn btn-primary"
                    style={{ marginBottom: "1.5rem" }}
                  >
                    + Ajouter un Lien
                  </button>
                  {localSettings.footer.links.map((l, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 40px",
                        gap: "1rem",
                        marginBottom: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={inputStyle}
                        value={l.label}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.links",
                            i,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        style={inputStyle}
                        value={l.path}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.links",
                            i,
                            "path",
                            e.target.value,
                          )
                        }
                        placeholder="Chemin (ex: /faq)"
                      />
                      <button
                        onClick={() => safeRemove("footer.links", i)}
                        style={{
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}

                  <h4
                    style={{
                      marginTop: "3rem",
                      marginBottom: "1.5rem",
                      color: "var(--emerald-900)",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.8rem",
                    }}
                  >
                    Liens Légaux (Bas de page)
                  </h4>
                  <button
                    onClick={() =>
                      addArrayItem("footer.legalLinks", {
                        label: "Nouveau lien",
                        path: "#",
                      })
                    }
                    className="btn btn-primary"
                    style={{ marginBottom: "1.5rem" }}
                  >
                    + Ajouter un Lien Légal
                  </button>
                  {localSettings.footer.legalLinks.map((l, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 40px",
                        gap: "1rem",
                        marginBottom: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={inputStyle}
                        value={l.label}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.legalLinks",
                            i,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        style={inputStyle}
                        value={l.path}
                        onChange={(e) =>
                          updateArrayItem(
                            "footer.legalLinks",
                            i,
                            "path",
                            e.target.value,
                          )
                        }
                        placeholder="URL ou #"
                      />
                      <button
                        onClick={() => safeRemove("footer.legalLinks", i)}
                        style={{
                          color: "#ef4444",
                          border: "none",
                          background: "none",
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* NEWS / CONSEILS */}
            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={groupStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2rem",
                    }}
                  >
                    <h3 style={{ color: "var(--primary-green)" }}>
                      Actualités & Conseils Seniors
                    </h3>
                    <button
                      onClick={() =>
                        addArrayItem("news", {
                          id: Date.now(),
                          title: "Titre de l'article",
                          content: "Contenu de l'article...",
                          category: "Actualités",
                          date: new Date().toISOString().split("T")[0],
                          image:
                            "https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?auto=format&fit=crop&w=800&q=80",
                          author: "Équipe La Reinette",
                        })
                      }
                      className="btn btn-primary"
                    >
                      + Nouvel Article
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "2rem" }}>
                    {localSettings.news.map((item, i) => (
                      <div
                        key={item.id}
                        style={{
                          padding: "2rem",
                          background: "#f9f9f9",
                          borderRadius: "24px",
                          border: "1px solid #eee",
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={() => safeRemove("news", i)}
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                            color: "#ef4444",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={20} />
                        </button>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "2rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div>
                            <label style={labelStyle}>Titre de l'article</label>
                            <input
                              style={inputStyle}
                              value={item.title}
                              onChange={(e) =>
                                updateArrayItem(
                                  "news",
                                  i,
                                  "title",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Catégorie</label>
                            <select
                              style={inputStyle}
                              value={item.category}
                              onChange={(e) =>
                                updateArrayItem(
                                  "news",
                                  i,
                                  "category",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="Actualités">Actualités</option>
                              <option value="Conseils">Conseils</option>
                              <option value="Événement">Événement</option>
                              <option value="Portrait">Portrait</option>
                            </select>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "2rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div>
                            <label style={labelStyle}>
                              URL de l'image (Unsplash ou autre)
                            </label>
                            <input
                              style={inputStyle}
                              value={item.image}
                              onChange={(e) =>
                                updateArrayItem(
                                  "news",
                                  i,
                                  "image",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Auteur</label>
                            <input
                              style={inputStyle}
                              value={item.author}
                              onChange={(e) =>
                                updateArrayItem(
                                  "news",
                                  i,
                                  "author",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                          <label style={labelStyle}>Contenu de l'article</label>
                          <textarea
                            style={{ ...inputStyle, minHeight: "150px" }}
                            value={item.content}
                            onChange={(e) =>
                              updateArrayItem(
                                "news",
                                i,
                                "content",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            Publié le :{" "}
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) =>
                                updateArrayItem(
                                  "news",
                                  i,
                                  "date",
                                  e.target.value,
                                )
                              }
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "inherit",
                                font: "inherit",
                              }}
                            />
                          </div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMAILS */}
            {/* CONFIG EMAILJS */}
            {activeTab === "emailConfig" && (
              <motion.div
                key="emailConfig"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Identifiants EmailJS pour ALERTES (Admin)
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                      marginBottom: "3rem",
                    }}
                  >
                    {/* RESERVATIONS */}
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "1px solid var(--slate-200)",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: "1rem",
                          color: "var(--primary-green)",
                        }}
                      >
                        Réservations
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Service ID
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.reservation?.serviceId ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  reservation: {
                                    ...localSettings.emailjs.reservation,
                                    serviceId: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Template ID
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.reservation?.templateId ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  reservation: {
                                    ...localSettings.emailjs.reservation,
                                    templateId: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Public Key
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.reservation?.publicKey ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  reservation: {
                                    ...localSettings.emailjs.reservation,
                                    publicKey: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* INSCRIPTIONS */}
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        border: "1px solid var(--primary-gold)",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: "1rem",
                          color: "var(--primary-gold)",
                        }}
                      >
                        Inscriptions
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Service ID
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.registration?.serviceId ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  registration: {
                                    ...localSettings.emailjs.registration,
                                    serviceId: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Template ID
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.registration?.templateId ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  registration: {
                                    ...localSettings.emailjs.registration,
                                    templateId: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--slate-500)",
                            }}
                          >
                            Public Key
                          </label>
                          <input
                            type="text"
                            style={{
                              padding: "0.6rem",
                              borderRadius: "6px",
                              border: "1px solid var(--slate-200)",
                            }}
                            value={
                              localSettings.emailjs?.registration?.publicKey ||
                              ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailjs: {
                                  ...localSettings.emailjs,
                                  registration: {
                                    ...localSettings.emailjs.registration,
                                    publicKey: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-gold)",
                    }}
                  >
                    Identifiants EmailJS pour CONFIRMATIONS (Client)
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Service ID</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.clientConfirmation
                            ?.serviceId || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              clientConfirmation: {
                                ...localSettings.emailjs.clientConfirmation,
                                serviceId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Template ID</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.clientConfirmation
                            ?.templateId || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              clientConfirmation: {
                                ...localSettings.emailjs.clientConfirmation,
                                templateId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Public Key</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.clientConfirmation
                            ?.publicKey || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              clientConfirmation: {
                                ...localSettings.emailjs.clientConfirmation,
                                publicKey: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Identifiants EmailJS pour CONTACT
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Service ID</label>
                      <input
                        style={inputStyle}
                        value={localSettings.emailjs?.contact?.serviceId || ""}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              contact: {
                                ...localSettings.emailjs.contact,
                                serviceId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Template ID</label>
                      <input
                        style={inputStyle}
                        value={localSettings.emailjs?.contact?.templateId || ""}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              contact: {
                                ...localSettings.emailjs.contact,
                                templateId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Public Key</label>
                      <input
                        style={inputStyle}
                        value={localSettings.emailjs?.contact?.publicKey || ""}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              contact: {
                                ...localSettings.emailjs.contact,
                                publicKey: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "1rem",
                      color: "var(--primary-gold)",
                    }}
                  >
                    Newsletter & emails aux inscrits
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      marginBottom: "1.5rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Utilisé pour l&apos;email de bienvenue (footer) et les
                    campagnes admin. Dans EmailJS, le champ{" "}
                    <strong>« To Email »</strong> du template doit être{" "}
                    <code>{"{{to_email}}"}</code> ou{" "}
                    <code>{"{{user_email}}"}</code> (destinataire =
                    l&apos;adresse saisie par l&apos;inscrit).
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Service ID</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.newsletter?.serviceId || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              newsletter: {
                                ...localSettings.emailjs?.newsletter,
                                serviceId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Template ID</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.newsletter?.templateId || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              newsletter: {
                                ...localSettings.emailjs?.newsletter,
                                templateId: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Public Key</label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailjs?.newsletter?.publicKey || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailjs: {
                              ...localSettings.emailjs,
                              newsletter: {
                                ...localSettings.emailjs?.newsletter,
                                publicKey: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}
                  >
                    <div>
                      <label style={labelStyle}>
                        Objet email de bienvenue (inscription footer)
                      </label>
                      <input
                        style={inputStyle}
                        value={
                          localSettings.emailTemplates
                            ?.newsletterWelcomeSubject || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              newsletterWelcomeSubject: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Message de bienvenue</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "120px" }}
                        value={
                          localSettings.emailTemplates
                            ?.newsletterWelcomeMessage || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              newsletterWelcomeMessage: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMAILS RÉSERVATION */}
            {activeTab === "emailsReservation" && (
              <motion.div
                key="emailsReservation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Modèle E-mail Réservation
                  </h3>
                  <div style={{ display: "grid", gap: "2rem" }}>
                    <div>
                      <label style={labelStyle}>Introduction</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "120px" }}
                        value={localSettings.emailTemplates?.bookingIntro || ""}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              bookingIntro: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Conclusion</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "120px" }}
                        value={
                          localSettings.emailTemplates?.bookingFooter || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              bookingFooter: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Libellés du Tableau (Réservation)
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      <h4 style={{ marginBottom: "1.5rem", opacity: 0.6 }}>
                        Sections & En-têtes
                      </h4>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {Object.entries({
                          passagerHeader: "Section Passager",
                          itineraireHeader: "Section Itinéraire",
                          horairesHeader: "Section Horaires",
                          estimationHeader: "Section Estimation",
                          introHeader: "Titre Introduction",
                          conclusionHeader: "Titre Conclusion",
                          noteHeader: "Section Note",
                        }).map(([key, label]) => (
                          <div key={key}>
                            <label
                              style={{
                                ...labelStyle,
                                textTransform: "none",
                                fontSize: "0.75rem",
                              }}
                            >
                              {label}
                            </label>
                            <input
                              style={inputStyle}
                              value={
                                localSettings.emailTemplates?.labels?.[key] ||
                                ""
                              }
                              onChange={(e) =>
                                setLocalSettings({
                                  ...localSettings,
                                  emailTemplates: {
                                    ...localSettings.emailTemplates,
                                    labels: {
                                      ...localSettings.emailTemplates.labels,
                                      [key]: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: "1.5rem", opacity: 0.6 }}>
                        Champs de Données
                      </h4>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {Object.entries({
                          clientName: "Nom du Client",
                          phone: "Téléphone",
                          tripType: "Type de Trajet",
                          departure: "Départ",
                          destination: "Destination",
                          motif: "Motif",
                          date: "Date",
                          appointmentTime: "Heure",
                          price: "Prix",
                          payment: "Mode Paiement",
                          paymentValue: "Texte Paiement",
                        }).map(([key, label]) => (
                          <div key={key}>
                            <label
                              style={{
                                ...labelStyle,
                                textTransform: "none",
                                fontSize: "0.75rem",
                              }}
                            >
                              {label}
                            </label>
                            <input
                              style={inputStyle}
                              value={
                                localSettings.emailTemplates?.labels?.[key] ||
                                ""
                              }
                              onChange={(e) =>
                                setLocalSettings({
                                  ...localSettings,
                                  emailTemplates: {
                                    ...localSettings.emailTemplates,
                                    labels: {
                                      ...localSettings.emailTemplates.labels,
                                      [key]: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMAILS CONTACT */}
            {activeTab === "emailsContact" && (
              <motion.div
                key="emailsContact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Modèle E-mail Contact
                  </h3>
                  <div style={{ display: "grid", gap: "2rem" }}>
                    <div>
                      <label style={labelStyle}>Introduction</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "120px" }}
                        value={localSettings.emailTemplates?.contactIntro || ""}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              contactIntro: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Conclusion</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: "120px" }}
                        value={
                          localSettings.emailTemplates?.contactFooter || ""
                        }
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            emailTemplates: {
                              ...localSettings.emailTemplates,
                              contactFooter: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div style={groupStyle}>
                  <h3
                    style={{
                      marginBottom: "2rem",
                      color: "var(--primary-green)",
                    }}
                  >
                    Libellés Mail de Contact
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "2rem",
                    }}
                  >
                    <div>
                      {Object.entries({
                        contactTitle: "Titre du mail",
                        contactFrom: "Libellé 'De :'",
                        contactSubject: "Libellé 'Sujet :'",
                        contactIntroHeader: "Titre Introduction",
                        contactConclusionHeader: "Titre Conclusion",
                      }).map(([key, label]) => (
                        <div key={key} style={{ marginBottom: "1rem" }}>
                          <label
                            style={{
                              ...labelStyle,
                              textTransform: "none",
                              fontSize: "0.75rem",
                            }}
                          >
                            {label}
                          </label>
                          <input
                            style={inputStyle}
                            value={
                              localSettings.emailTemplates?.labels?.[key] || ""
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                emailTemplates: {
                                  ...localSettings.emailTemplates,
                                  labels: {
                                    ...localSettings.emailTemplates.labels,
                                    [key]: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "newsletter" && (
              <motion.div
                key="nwl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="tabpanel"
                id="panel-newsletter"
              >
                <div style={{ ...groupStyle, overflow: "hidden", padding: 0 }}>
                  <div
                    style={{
                      padding: "2rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      Inscrits à la Newsletter ({newsletters.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <Search
                          size={18}
                          style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                          }}
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          placeholder="Filtrer par email..."
                          aria-label="Rechercher un email"
                          value={newsletterSearch}
                          onChange={(e) => setNewsletterSearch(e.target.value)}
                          style={{
                            ...inputStyle,
                            padding: "0.6rem 1rem 0.6rem 2.8rem",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            width: "220px",
                          }}
                        />
                      </div>
                      <button
                        onClick={downloadNewslettersAsCSV}
                        className="btn"
                        aria-label="Exporter les emails en format CSV"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "var(--primary-gold)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Download size={18} aria-hidden="true" /> Exporter
                      </button>
                      <button
                        onClick={fetchNewsletters}
                        disabled={isRefreshingNewsletters}
                        className="btn"
                        aria-label="Actualiser la liste"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#f0f0f0",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          opacity: isRefreshingNewsletters ? 0.6 : 1,
                        }}
                      >
                        {isRefreshingNewsletters ? "..." : "Rafraîchir"}
                      </button>
                    </div>
                  </div>

                  {newsletters.length === 0 ? (
                    <div
                      style={{
                        padding: "4rem",
                        textAlign: "center",
                        color: "var(--text-muted)",
                      }}
                    >
                      Aucun inscrit pour le moment.
                    </div>
                  ) : (
                    <>
                      <div style={{ overflowX: "auto", maxHeight: "400px" }}>
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead
                            style={{
                              background: "var(--bg-creme)",
                              position: "sticky",
                              top: 0,
                              zIndex: 10,
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  padding: "1.2rem",
                                  textAlign: "left",
                                  width: "50px",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedEmails.length ===
                                      newsletters.length &&
                                    newsletters.length > 0
                                  }
                                  onChange={toggleAllEmails}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: "pointer",
                                  }}
                                />
                              </th>
                              <th
                                scope="col"
                                style={{
                                  padding: "1.2rem",
                                  textAlign: "left",
                                  color: "var(--text-muted)",
                                }}
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                style={{
                                  padding: "1.2rem",
                                  textAlign: "left",
                                  color: "var(--text-muted)",
                                }}
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                style={{
                                  padding: "1.2rem",
                                  textAlign: "right",
                                }}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {newsletters
                              .filter((n) =>
                                (n.email || "")
                                  .toLowerCase()
                                  .includes(newsletterSearch.toLowerCase()),
                              )
                              .map((n) => (
                                <tr
                                  key={n.id}
                                  style={{
                                    borderBottom:
                                      "1px solid var(--border-subtle)",
                                    background: selectedEmails.includes(n.email)
                                      ? "var(--bg-creme)"
                                      : "transparent",
                                  }}
                                >
                                  <td style={{ padding: "1.2rem" }}>
                                    <input
                                      type="checkbox"
                                      checked={selectedEmails.includes(n.email)}
                                      onChange={() =>
                                        toggleEmailSelection(n.email)
                                      }
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      padding: "1.2rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {n.email}
                                  </td>
                                  <td
                                    style={{
                                      padding: "1.2rem",
                                      color: "var(--text-muted)",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    {new Date(n.created_at).toLocaleDateString(
                                      "fr-FR",
                                    )}
                                  </td>
                                  <td
                                    style={{
                                      padding: "1.2rem",
                                      textAlign: "right",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <a
                                      href={`mailto:${n.email}`}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        background: "var(--primary-green-pale)",
                                        color: "var(--primary-green)",
                                      }}
                                      title="Mail direct"
                                    >
                                      <Mail size={16} />
                                    </a>
                                    <button
                                      onClick={() => deleteNewsletter(n.id)}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "6px",
                                        background: "#fef2f2",
                                        border: "none",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      {/* CAMPAGNE FORM */}
                      <div
                        style={{
                          padding: "2.5rem",
                          background: "var(--bg-creme)",
                          borderTop: "2px solid var(--border-subtle)",
                        }}
                      >
                        <h4
                          style={{
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Megaphone size={20} color="var(--primary-gold)" />
                          Envoyer un message aux sélectionnés (
                          {selectedEmails.length})
                        </h4>

                        <div style={{ display: "grid", gap: "1.5rem" }}>
                          <div>
                            <label style={labelStyle}>Objet du mail</label>
                            <input
                              style={inputStyle}
                              placeholder="Ex: Joyeuses fêtes ou Nouveaux conseils seniors..."
                              value={campaign.subject}
                              onChange={(e) =>
                                setCampaign({
                                  ...campaign,
                                  subject: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Contenu du message</label>
                            <textarea
                              style={{ ...inputStyle, minHeight: "150px" }}
                              placeholder="Écrivez votre message ici..."
                              value={campaign.message}
                              onChange={(e) =>
                                setCampaign({
                                  ...campaign,
                                  message: e.target.value,
                                })
                              }
                            />
                          </div>
                          <button
                            onClick={sendCampaign}
                            disabled={
                              isSendingCampaign || selectedEmails.length === 0
                            }
                            className="btn"
                            style={{
                              padding: "1rem 2rem",
                              background: "var(--primary-green)",
                              color: "#fff",
                              border: "none",
                              borderRadius: "12px",
                              cursor: "pointer",
                              fontWeight: 600,
                              opacity:
                                isSendingCampaign || selectedEmails.length === 0
                                  ? 0.6
                                  : 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.8rem",
                            }}
                          >
                            {isSendingCampaign ? (
                              <>Envoi en cours...</>
                            ) : (
                              <>
                                <Send size={18} />
                                Envoyer à tous les sélectionnés
                              </>
                            )}
                          </button>
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              textAlign: "center",
                              lineHeight: 1.5,
                            }}
                          >
                            Chaque inscrit reçoit le mail à son adresse
                            (template EmailJS avec destinataire ={" "}
                            {"{{to_email}}"}). Configurez l&apos;onglet «
                            Newsletter » dans Config EmailJS si les envois
                            échouent.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* MODAL RÉSERVATION */}
      <AnimatePresence>
        {selectedRes && (
          <div
            className="admin-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              className="admin-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", color: "var(--emerald-900)" }}>
                  Détails Réservation
                </h2>
                <button
                  onClick={() => setSelectedRes(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div
                style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}
              >
                <div
                  style={{
                    background: "var(--bg-creme)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{ margin: "0 0 0.5rem", color: "var(--text-muted)" }}
                  >
                    Passager
                  </p>
                  <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>
                    {selectedRes.name}
                  </div>
                  <div>{selectedRes.phone}</div>
                  {selectedRes.email && (
                    <div
                      style={{
                        color: "var(--primary-green)",
                        fontSize: "0.9rem",
                        marginTop: "0.2rem",
                      }}
                    >
                      {selectedRes.email}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    background: "var(--bg-creme)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <p
                    style={{ margin: "0 0 0.5rem", color: "var(--text-muted)" }}
                  >
                    Itinéraire
                  </p>
                  <div>
                    <span style={{ fontWeight: 600 }}>Départ:</span>{" "}
                    {selectedRes.departure}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Cible:</span>{" "}
                    {selectedRes.destination}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Statut de la course</label>
                <select
                  style={inputStyle}
                  value={selectedRes.status || "En attente"}
                  onChange={(e) =>
                    setSelectedRes({ ...selectedRes, status: e.target.value })
                  }
                >
                  <option value="En attente">En attente</option>
                  <option value="Validée">Validée</option>
                  <option value="Annulée">Annulée</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>

              <div style={{ marginBottom: "2.5rem" }}>
                <label style={labelStyle}>Assigner un chauffeur</label>
                <select
                  style={inputStyle}
                  value={selectedRes.driver || ""}
                  onChange={(e) =>
                    setSelectedRes({ ...selectedRes, driver: e.target.value })
                  }
                >
                  <option value="">-- Non assigné --</option>
                  <option value="M. Guery">M. Guery</option>
                  <option value="M. Yassine">M. Yassine</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "1.2rem",
                  borderRadius: "50px",
                }}
                onClick={handleUpdateReservation}
              >
                Sauvegarder les modifications
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AJOUT RÉSERVATION */}
      <AnimatePresence>
        {showAddResModal && (
          <div
            className="admin-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              className="admin-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", color: "var(--emerald-900)" }}>
                  Nouvelle Réservation
                </h2>
                <button
                  onClick={() => setShowAddResModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div
                style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Nom complet</label>
                    <input
                      style={inputStyle}
                      placeholder="Jean Dupont"
                      value={newRes.name}
                      onChange={(e) =>
                        setNewRes({ ...newRes, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Téléphone</label>
                    <input
                      style={inputStyle}
                      type="tel"
                      placeholder="06..."
                      value={newRes.phone}
                      onChange={(e) =>
                        setNewRes({ ...newRes, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input
                      style={inputStyle}
                      type="email"
                      placeholder="client@email.com"
                      value={newRes.email}
                      onChange={(e) =>
                        setNewRes({ ...newRes, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Adresse de départ</label>
                    <input
                      style={inputStyle}
                      value={newRes.departure}
                      onChange={(e) =>
                        setNewRes({ ...newRes, departure: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Adresse de Destination</label>
                    <input
                      style={inputStyle}
                      value={newRes.destination}
                      onChange={(e) =>
                        setNewRes({ ...newRes, destination: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Date Prévue</label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={newRes.appointment_date}
                      onChange={(e) =>
                        setNewRes({
                          ...newRes,
                          appointment_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Heure du Rendez-vous</label>
                    <input
                      type="time"
                      style={inputStyle}
                      value={newRes.appointment_time}
                      onChange={(e) =>
                        setNewRes({
                          ...newRes,
                          appointment_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Assigner d'office</label>
                    <select
                      style={inputStyle}
                      value={newRes.driver}
                      onChange={(e) =>
                        setNewRes({ ...newRes, driver: e.target.value })
                      }
                    >
                      <option value="">-- Aucun --</option>
                      <option value="M. Guery">M. Guery</option>
                      <option value="M. Yassine">M. Yassine</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Statut</label>
                    <select
                      style={inputStyle}
                      value={newRes.status}
                      onChange={(e) =>
                        setNewRes({ ...newRes, status: e.target.value })
                      }
                    >
                      <option value="Validée">Validée</option>
                      <option value="En attente">En attente</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "1.2rem",
                  borderRadius: "50px",
                }}
                onClick={handleAddNewReservation}
              >
                Créer et Sauvegarder
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="admin-toast"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: "fixed",
              top: "40px",
              right: "40px",
              background: "var(--primary-green)",
              color: "#fff",
              padding: "1.2rem 3rem",
              borderRadius: "50px",
              zIndex: 9999,
            }}
          >
            <CheckCircle2 size={24} /> Configuration mise à jour !
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
               .admin-dashboard { overflow-x: hidden; }
               .admin-main { min-width: 0; }
               .admin-dashboard * { min-width: 0; }

               @media (max-width: 1024px) {
                  .admin-dashboard { padding-top: 130px !important; }
                  .admin-layout { grid-template-columns: 1fr !important; gap: 1.5rem !important; padding-bottom: 2.5rem !important; }
                  .admin-sidebar { position: static !important; top: auto !important; }
                  .admin-sidebar nav[role="tablist"] {
                     display: flex !important;
                     flex-wrap: nowrap !important;
                     overflow-x: auto !important;
                     -webkit-overflow-scrolling: touch;
                     gap: 0.5rem !important;
                     padding: 0.75rem !important;
                     border-radius: 18px !important;
                  }
                  .admin-sidebar nav[role="tablist"] button { flex: 0 0 auto; white-space: nowrap; }
                  .admin-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; margin-bottom: 2rem !important; }
                  .admin-title { font-size: clamp(1.7rem, 7vw, 2.4rem) !important; }
                  .admin-save-btn { width: 100% !important; justify-content: center !important; padding: 0.9rem 1.2rem !important; }
                  .admin-dashboard [style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
                  .admin-dashboard input, .admin-dashboard select, .admin-dashboard textarea { width: 100% !important; }
                  .admin-dashboard table { font-size: 0.85rem; }
               }

               @media (max-width: 768px) {
                  .admin-dashboard .container { padding-left: 0.85rem !important; padding-right: 0.85rem !important; }
                  .admin-modal-overlay { align-items: flex-start !important; padding: 1rem !important; overflow-y: auto; }
                  .admin-modal-content {
                     width: 100% !important;
                     max-width: 100% !important;
                     max-height: none !important;
                     border-radius: 16px !important;
                     padding: 1rem !important;
                     margin: 0 auto;
                  }
                  .admin-toast {
                     top: 1rem !important;
                     right: 1rem !important;
                     left: 1rem !important;
                     padding: 0.9rem 1rem !important;
                     border-radius: 12px !important;
                  }
               }
            `,
        }}
      />
    </div>
  );
};

export default AdminDashboard;
