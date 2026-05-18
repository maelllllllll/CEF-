// ============================================================
//  CEF$! — SITE CONFIG
//  Modifie ce fichier pour ajouter tes tracks, photos, vidéos
// ============================================================

const SITE_CONFIG = {

  artist: "CEF$!",
  ep: "TRAINING CAMP",
  taglines: [
    "Un flow, un camp, une mission.",
    "Brut. Intense. Sans filtre.",
    "Training Camp — EP 2025.",
  ],

  // ----------------------------------------------------------
  //  TRACKLIST EP
  //  Ajoute/modifie les titres de l'EP
  // ----------------------------------------------------------
  tracklist: [
    { number: "01", title: "TRAINING CAMP", duration: "2:54" },
    { number: "02", title: "À MON SIGNAL",  duration: "3:12" },
    { number: "03", title: "CARDIO",         duration: "2:41" },
    { number: "04", title: "NO DAYS OFF",    duration: "3:05" },
    { number: "05", title: "LAST REP",       duration: "3:30" },
    // Ajoute tes vrais titres ici
  ],

  // ----------------------------------------------------------
  //  LECTEUR LOCAL MP3
  //  Ajoute le chemin vers tes fichiers dans assets/audio/
  //  Ex: { title: "Training Camp", file: "assets/audio/01-training-camp.mp3", cover: "assets/photos/ep-cover.jpg" }
  // ----------------------------------------------------------
  audioTracks: [
    // { title: "TRAINING CAMP", file: "assets/audio/01-training-camp.mp3", cover: "assets/photos/ep-cover.jpg" },
    // { title: "À MON SIGNAL",  file: "assets/audio/02-a-mon-signal.mp3",  cover: "assets/photos/ep-cover.jpg" },
  ],

  // ----------------------------------------------------------
  //  PHOTOS GALERIE
  //  Ajoute tes images dans assets/photos/ puis liste-les ici
  //  Ex: { src: "assets/photos/photo1.jpg", alt: "CEF$! en studio" }
  // ----------------------------------------------------------
  photos: [
    // { src: "assets/photos/photo1.jpg", alt: "CEF$! — Studio" },
    // { src: "assets/photos/photo2.jpg", alt: "CEF$! — Live" },
  ],

  // ----------------------------------------------------------
  //  VIDÉOS
  //  YouTube: { type: "youtube", id: "VIDEO_ID", title: "Titre" }
  //  Local:   { type: "local",   src: "assets/videos/clip.mp4", title: "Titre", poster: "assets/photos/thumb.jpg" }
  // ----------------------------------------------------------
  videos: [
    // { type: "youtube", id: "dQw4w9WgXcQ", title: "TRAINING CAMP — Clip officiel" },
    // { type: "local",   src: "assets/videos/clip.mp4", title: "Freestyle", poster: "assets/photos/thumb.jpg" },
  ],

  // ----------------------------------------------------------
  //  LIENS RÉSEAUX SOCIAUX (optionnel)
  // ----------------------------------------------------------
  socials: {
    soundcloud: "https://soundcloud.com/user-78859066",
    instagram: "",  // ex: "https://instagram.com/cef_officiel"
    youtube:   "",
    spotify:   "",
  },
};
