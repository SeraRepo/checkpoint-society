export const translations = {
  fr: {
    // HomePage
    home: {
      title: "Réservation Bar Event",
      subtitle: "Choisissez votre créneau horaire"
    },
    // SessionList
    sessions: {
      available: "Sessions disponibles",
      noSessions: "Aucune session disponible pour le moment",
      slots: "places",
      reserve: "Réserver",
      full: "Complet",
      waitlist: "Liste d'attente"
    },
    // BookingForm
    booking: {
      title: "Réserver",
      back: "Retour",
      fullName: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      partySize: "Nombre de personnes",
      confirmButton: "Confirmer la réservation",
      submitting: "Réservation en cours...",
      successTitle: "Réservation confirmée !",
      successMessage: "Un email de confirmation vous a été envoyé.",
      waitlistSuccessTitle: "Ajouté à la liste d'attente !",
      waitlistSuccessMessage: "Vous serez contacté si une place se libère.",
      waitlistWarning: "Cette session est complète. Vous serez placé sur liste d'attente.",
      required: "*",
      invites: "Vous invite à sa première chasse aux loups-garous !",
      location: "3 Rue des Tourneurs, 31000 Toulouse",
      appointment: "Choisissez un rendez-vous ci-dessous !"
    },
    // Common
    common: {
      loading: "Chargement..."
    }
  },
  en: {
    // HomePage
    home: {
      title: "Bar Event Booking",
      subtitle: "Choose your time slot"
    },
    // SessionList
    sessions: {
      available: "Available Sessions",
      noSessions: "No sessions available at the moment",
      slots: "slots",
      reserve: "Book",
      full: "Full",
      waitlist: "Waitlist"
    },
    // BookingForm
    booking: {
      title: "Book",
      back: "Back",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      partySize: "Number of people",
      confirmButton: "Confirm booking",
      submitting: "Booking in progress...",
      successTitle: "Booking confirmed!",
      successMessage: "A confirmation email has been sent to you.",
      waitlistSuccessTitle: "Added to waitlist!",
      waitlistSuccessMessage: "You will be contacted if a spot becomes available.",
      waitlistWarning: "This session is full. You will be added to the waitlist.",
      required: "*",
      invites: "Invites you to his first Werewolf hunt!",
      location: "3 Rue des Tourneurs, 31000 Toulouse",
      appointment: "Pick an appointment down there !"
    },
    // Common
    common: {
      loading: "Loading..."
    }
  }
}

export const useTranslation = (language) => {
  return translations[language] || translations.fr
}
