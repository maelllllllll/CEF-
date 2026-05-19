// ============================================================
//  CEF$! — SITE CONFIG
//  Modifie ce fichier pour ajouter tes tracks, photos, vidéos
// ============================================================

const SITE_CONFIG = {

  artist: "CEF$!",
  ep: "TRAINING CAMP",
  taglines: [
    "Proche de la mode, loin du bruit.",
    "Training Camp — EP 2025.",
    "Brut. Intense. Sans filtre.",
  ],

  // ----------------------------------------------------------
  //  TRACKLIST EP
  // ----------------------------------------------------------
  tracklist: [
    { number: "01", title: "PROCHE DE LA MODE",  duration: "" },
    { number: "02", title: "FUMÉE",               duration: "" },
    { number: "03", title: "INTERLUDE",           duration: "" },
    { number: "04", title: "ARRIVEDERCI",         duration: "", feat: "JEREMYJACK" },
    { number: "05", title: "NEXT STEP",           duration: "" },
    { number: "06", title: "ADVERSITÉ",           duration: "", feat: "JEREMYJACK" },
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
    { src: "assets/photos/IMG_0366.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0368.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0376.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0380.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0372.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0385.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0387.JPG", alt: "CEF$!" },
    { src: "assets/photos/IMG_0400.JPG", alt: "CEF$!" },
    { src: "assets/photos/photo_a.jpg",  alt: "CEF$!" },
    { src: "assets/photos/photo_b.jpg",  alt: "CEF$!" },
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
