import type { DictionaryKey, Localized } from './i18n'
import type { IconName } from './components/Icon'

export const SITE_URL = (
  (import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://rpsbaghpat.in'
).replace(/\/+$/, '')

export const school = {
  name: { en: 'Royal Public School', hi: 'रॉयल पब्लिक स्कूल' } satisfies Localized,
  locality: { en: 'Tatiri, Baghpat, Uttar Pradesh', hi: 'ततिरी, बागपत, उत्तर प्रदेश' } satisfies Localized,
  address: {
    en: 'Samadi Road, Tatiri, Tatiri Rural, Uttar Pradesh – 250601',
    hi: 'समादी रोड, ततिरी, ततिरी ग्रामीण, उत्तर प्रदेश – 250601',
  } satisfies Localized,
  phoneDisplay: '+91 99973 20389',
  phoneHref: 'tel:+919997320389',
  whatsapp: '919997320389',
  mapsUrl: 'https://maps.app.goo.gl/r24gjbhQH5maJg2E6',
  mapsEmbed:
    'https://www.google.com/maps?q=Royal%20Public%20School%20Tatiri%20Baghpat%20Uttar%20Pradesh&output=embed',
  curriculum: { en: 'CBSE curriculum', hi: 'सीबीएसई पाठ्यक्रम' } satisfies Localized,
} as const

export const transport = {
  title: {
    en: 'School-owned, fully air-conditioned transport',
    hi: 'स्कूल के स्वामित्व वाली पूर्णतः वातानुकूलित बस सेवा',
  } satisfies Localized,
  body: {
    en: 'Royal Public School owns and operates every school bus. Every bus on every route is fully air-conditioned. Transport is available in Tatiri and Baghpat city.',
    hi: 'रॉयल पब्लिक स्कूल की सभी बसें स्कूल के स्वामित्व और संचालन में हैं। हर मार्ग की प्रत्येक बस पूर्णतः वातानुकूलित है। परिवहन सुविधा ततिरी और बागपत शहर में उपलब्ध है।',
  } satisfies Localized,
  photoUrl: '',
} as const

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${school.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const instagram = {
  url: 'https://www.instagram.com/royalpublicschool_/',
  handle: '@royalpublicschool_',
  avatar: '/images/instagram/rps-instagram-avatar.webp',
} as const

export const socialLinks = {
  facebookUrl: '',
  googleReviewsUrl: '',
} as const

export const instagramPosts: {
  url: string
  image: string
  alt: Localized
  date: Localized
}[] = [
  {
    url: 'https://www.instagram.com/reel/DfMblYGinC_/',
    image: 'reel-2026-11-01',
    alt: {
      en: "The Royal Public School building on Samadi Road, from the school's Instagram reel",
      hi: 'समादी रोड पर रॉयल पब्लिक स्कूल का भवन, स्कूल के इंस्टाग्राम रील से',
    },
    date: { en: '1 November 2026', hi: '1 नवंबर 2026' },
  },
  {
    url: 'https://www.instagram.com/reel/DYog-azODJv/',
    image: 'reel-2026-05-22',
    alt: {
      en: "Students taking part in a confidence-building session, from the school's Instagram reel",
      hi: 'आत्मविश्वास निर्माण सत्र में भाग लेते विद्यार्थी, स्कूल के इंस्टाग्राम रील से',
    },
    date: { en: '22 May 2026', hi: '22 मई 2026' },
  },
  {
    url: 'https://www.instagram.com/reel/DYd7QnaI2Tp/',
    image: 'reel-2026-05-17',
    alt: {
      en: "A teacher walking with two young students on campus, from the school's Instagram reel",
      hi: 'परिसर में दो छोटे विद्यार्थियों के साथ चलती शिक्षिका, स्कूल के इंस्टाग्राम रील से',
    },
    date: { en: '17 May 2026', hi: '17 मई 2026' },
  },
]

export const navItems: { to: string; key: DictionaryKey }[] = [
  { to: '/', key: 'nav.home' },
  { to: '/updates', key: 'nav.updates' },
  { to: '/about', key: 'nav.about' },
  { to: '/academics', key: 'nav.academics' },
  { to: '/facilities', key: 'nav.facilities' },
  { to: '/campus-life', key: 'nav.campus' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/admissions', key: 'nav.admissions' },
  { to: '/contact', key: 'nav.contact' },
]

export const footerLinks = {
  quick: [
    { to: '/updates', key: 'nav.updates' },
    { to: '/about', key: 'nav.about' },
    { to: '/vision-mission', key: 'nav.vision' },
    { to: '/admissions', key: 'nav.admissions' },
    { to: '/contact', key: 'nav.contact' },
  ] as { to: string; key: DictionaryKey }[],
  explore: [
    { to: '/academics', key: 'nav.academics' },
    { to: '/facilities', key: 'nav.facilities' },
    { to: '/campus-life', key: 'nav.campus' },
    { to: '/gallery', key: 'nav.gallery' },
  ] as { to: string; key: DictionaryKey }[],
}

export const marquee: Localized[] = [
  { en: 'Fully Air-Conditioned', hi: 'पूर्णतः वातानुकूलित' },
  { en: 'Student-Centred Learning', hi: 'विद्यार्थी-केंद्रित शिक्षा' },
  { en: 'CBSE Curriculum', hi: 'सीबीएसई पाठ्यक्रम' },
  { en: 'Safe & Disciplined Campus', hi: 'सुरक्षित एवं अनुशासित परिसर' },
  { en: 'Holistic Development', hi: 'सर्वांगीण विकास' },
  { en: 'Individual Attention', hi: 'व्यक्तिगत ध्यान' },
]

export const hero = {
  badge: { en: 'Fully Air-Conditioned School', hi: 'पूर्णतः वातानुकूलित विद्यालय' } satisfies Localized,
  titleLead: { en: 'Building', hi: 'गुणवत्तापूर्ण शिक्षा से' } satisfies Localized,
  titleAccent: { en: 'Bright Futures', hi: 'उज्ज्वल भविष्य' } satisfies Localized,
  titleTail: { en: 'Through Quality Education', hi: 'का निर्माण' } satisfies Localized,
  support: {
    en: 'At Royal Public School, we believe every child deserves an environment that inspires learning, builds confidence, and prepares them for tomorrow.',
    hi: 'रॉयल पब्लिक स्कूल में हमारा विश्वास है कि प्रत्येक बच्चे को ऐसा वातावरण मिलना चाहिए जो सीखने की प्रेरणा दे, आत्मविश्वास बढ़ाए और उसे कल के लिए तैयार करे।',
  } satisfies Localized,
  meta: [
    { en: 'Tatiri, Baghpat', hi: 'ततिरी, बागपत' },
    { en: 'CBSE curriculum', hi: 'सीबीएसई पाठ्यक्रम' },
    { en: 'Fully air-conditioned, school-owned transport', hi: 'स्कूल के स्वामित्व वाला पूर्णतः वातानुकूलित परिवहन' },
  ] as Localized[],
  scroll: { en: 'Scroll to explore', hi: 'देखने के लिए स्क्रॉल करें' } satisfies Localized,
}

export const welcome = {
  eyebrow: { en: 'Welcome to Royal', hi: 'रॉयल में आपका स्वागत' } satisfies Localized,
  title: { en: 'Welcome to Royal Public School', hi: 'रॉयल पब्लिक स्कूल में आपका स्वागत है' } satisfies Localized,
  body1: {
    en: 'Royal Public School is an educational institution in Tatiri, Baghpat, built around a simple belief — children learn best when they feel comfortable, seen, and inspired.',
    hi: 'रॉयल पब्लिक स्कूल ततिरी, बागपत की एक शैक्षणिक संस्था है, जो एक सरल विश्वास पर आधारित है — बच्चे तब सबसे अच्छा सीखते हैं जब वे सहज महसूस करें, उन्हें पहचाना जाए और प्रेरणा मिले।',
  } satisfies Localized,
  body2: {
    en: 'Our approach pairs strong academic foundations with warmth, structure, and personal attention, so every child can take part in school life with confidence.',
    hi: 'हमारा तरीका मजबूत शैक्षणिक नींव को अपनापन, अनुशासन और व्यक्तिगत ध्यान के साथ जोड़ता है, ताकि हर बच्चा आत्मविश्वास के साथ स्कूल जीवन का हिस्सा बन सके।',
  } satisfies Localized,
  points: [
    { en: 'Student-focused learning', hi: 'विद्यार्थी-केंद्रित अधिगम' },
    { en: 'Air-conditioned classrooms', hi: 'वातानुकूलित कक्षाएँ' },
    { en: 'Academic development', hi: 'शैक्षणिक विकास' },
    { en: 'Personality and confidence', hi: 'व्यक्तित्व एवं आत्मविश्वास' },
    { en: 'A positive, disciplined atmosphere', hi: 'सकारात्मक एवं अनुशासित वातावरण' },
  ] as Localized[],
  badge: { en: 'Comfortable learning, all year round', hi: 'पूरे वर्ष आरामदायक अधिगम' } satisfies Localized,
}

export const why = {
  eyebrow: { en: 'Why Royal', hi: 'रॉयल ही क्यों' } satisfies Localized,
  title: { en: 'Chosen for the things that matter every day.', hi: 'वे बातें जो हर दिन मायने रखती हैं।' } satisfies Localized,
  lead: {
    en: 'Six commitments shape the everyday experience of every student at Royal Public School.',
    hi: 'छह प्रतिबद्धताएँ रॉयल पब्लिक स्कूल के प्रत्येक विद्यार्थी के दैनिक अनुभव को आकार देती हैं।',
  } satisfies Localized,
  items: [
    {
      icon: 'snowflake',
      title: { en: 'Fully Air-Conditioned School and Transport', hi: 'पूर्णतः वातानुकूलित विद्यालय और परिवहन' },
      body: {
        en: 'A comfortable learning environment in every classroom, with school-owned, fully air-conditioned transport across Tatiri and Baghpat city.',
        hi: 'हर कक्षा में आरामदायक अधिगम वातावरण और ततिरी व बागपत शहर में स्कूल के स्वामित्व वाला पूर्णतः वातानुकूलित परिवहन।',
      },
    },
    {
      icon: 'users',
      title: { en: 'Student-Centred Learning', hi: 'विद्यार्थी-केंद्रित शिक्षा' },
      body: {
        en: 'Focus on individual learning and the steady development of every student.',
        hi: 'व्यक्तिगत अधिगम और प्रत्येक विद्यार्थी के निरंतर विकास पर ध्यान।',
      },
    },
    {
      icon: 'book',
      title: { en: 'Academic Excellence', hi: 'शैक्षणिक उत्कृष्टता' },
      body: {
        en: 'Encouraging curiosity, real understanding, and consistent academic progress.',
        hi: 'जिज्ञासा, वास्तविक समझ और निरंतर शैक्षणिक प्रगति को प्रोत्साहन।',
      },
    },
    {
      icon: 'leaf',
      title: { en: 'Holistic Development', hi: 'सर्वांगीण विकास' },
      body: {
        en: 'Opportunities to build confidence, creativity, and essential life skills.',
        hi: 'आत्मविश्वास, रचनात्मकता और आवश्यक जीवन कौशल विकसित करने के अवसर।',
      },
    },
    {
      icon: 'shield',
      title: { en: 'Safe Learning Environment', hi: 'सुरक्षित अधिगम वातावरण' },
      body: {
        en: 'A welcoming and supportive atmosphere where students feel secure.',
        hi: 'स्वागतपूर्ण और सहयोगी वातावरण, जहाँ विद्यार्थी स्वयं को सुरक्षित महसूस करें।',
      },
    },
    {
      icon: 'scale',
      title: { en: 'Focus on Discipline', hi: 'अनुशासन पर विशेष ध्यान' },
      body: {
        en: 'Encouraging responsibility, respect, and the values that shape character.',
        hi: 'जिम्मेदारी, सम्मान और चरित्र गढ़ने वाले मूल्यों को प्रोत्साहन।',
      },
    },
  ] satisfies { icon: IconName; title: Localized; body: Localized }[],
}

export const acFeature = {
  eyebrow: { en: 'The Royal Difference', hi: 'रॉयल की विशेषता' } satisfies Localized,
  titleA: { en: 'Comfortable', hi: 'आरामदायक' } satisfies Localized,
  titleB: { en: 'air-conditioned classrooms.', hi: 'वातानुकूलित कक्षाएँ।' } satisfies Localized,
  body: {
    en: 'Comfort is not a luxury here — it is part of how we teach. Every classroom is air-conditioned, so attention stays on learning, not on the heat. From the first bell to the last, students learn in a calm, climate-controlled environment designed for focus.',
    hi: 'यहाँ सुविधा कोई विलासिता नहीं, बल्कि हमारी शिक्षण-पद्धति का हिस्सा है। हर कक्षा वातानुकूलित है, ताकि ध्यान गर्मी पर नहीं, सीखने पर रहे। पहली घंटी से अंतिम तक विद्यार्थी शांत, नियंत्रित वातावरण में पढ़ते हैं जो एकाग्रता के लिए बनाया गया है।',
  } satisfies Localized,
  points: [
    {
      title: { en: 'Cool, quiet classrooms', hi: 'ठंडी, शांत कक्षाएँ' },
      body: { en: 'A comfortable temperature through the school day.', hi: 'पूरे स्कूल दिवस में आरामदायक तापमान।' },
    },
    {
      title: { en: 'Space to focus', hi: 'एकाग्रता के लिए वातावरण' },
      body: {
        en: 'A settled environment helps students stay engaged with their work.',
        hi: 'सहज वातावरण विद्यार्थियों को अपने काम में जुड़े रहने में मदद करता है।',
      },
    },
    {
      title: { en: 'A daily standard', hi: 'प्रतिदिन की सुविधा' },
      body: {
        en: 'Not an occasional facility, but a part of everyday school life.',
        hi: 'कोई विशेष अवसर की सुविधा नहीं, बल्कि दैनिक स्कूल जीवन का हिस्सा।',
      },
    },
  ] as { title: Localized; body: Localized }[],
  badge: { en: 'Every classroom. Every day.', hi: 'हर कक्षा। हर दिन।' } satisfies Localized,
  imageCaption: { en: 'Designed for focus', hi: 'एकाग्रता के लिए बनाया गया' } satisfies Localized,
}

export const academicStages = [
  {
    no: '01',
    title: { en: 'Foundational Years', hi: 'आधार वर्ष' },
    tag: { en: 'Early learning', hi: 'प्रारंभिक शिक्षा' },
    body: {
      en: 'A gentle, joyful beginning where early literacy, numeracy, and curiosity grow through play, story, and structure.',
      hi: 'एक कोमल और आनंदमय शुरुआत, जहाँ खेल, कहानी और अनुशासन के माध्यम से प्रारंभिक पढ़ना-लिखना, गणना और जिज्ञासा विकसित होती है।',
    },
    image: 'class-group',
  },
  {
    no: '02',
    title: { en: 'Primary Years', hi: 'प्राथमिक वर्ष' },
    tag: { en: 'Strong foundations', hi: 'मजबूत नींव' },
    body: {
      en: 'Strong foundations in language, mathematics, and the world around us — taught with patience and plenty of encouragement.',
      hi: 'भाषा, गणित और आसपास की दुनिया में मजबूत नींव — धैर्य और प्रचुर प्रोत्साहन के साथ सिखाई जाती है।',
    },
    image: 'assembly-ground',
  },
  {
    no: '03',
    title: { en: 'Middle School', hi: 'माध्यमिक कक्षाएँ' },
    tag: { en: 'Growing independence', hi: 'बढ़ती स्वतंत्रता' },
    body: {
      en: 'Deeper subject understanding, project work, and study habits that prepare students for the years ahead.',
      hi: 'विषयों की गहरी समझ, परियोजना कार्य और अध्ययन की ऐसी आदतें जो विद्यार्थियों को आने वाले वर्षों के लिए तैयार करती हैं।',
    },
    image: 'patel-jayanti',
  },
] satisfies { no: string; title: Localized; tag: Localized; body: Localized; image: string }[]

export const academicsCopy = {
  eyebrow: { en: 'Academics', hi: 'शैक्षणिक' } satisfies Localized,
  title: { en: 'A strong start. A confident future.', hi: 'मजबूत शुरुआत। आत्मविश्वासी भविष्य।' } satisfies Localized,
  lead: {
    en: 'Our academic approach is built on clear foundations, personal attention, and the confidence to ask questions.',
    hi: 'हमारा शैक्षणिक तरीका स्पष्ट नींव, व्यक्तिगत ध्यान और प्रश्न पूछने के आत्मविश्वास पर आधारित है।',
  } satisfies Localized,
  note: {
    en: 'Class levels available for the current session are confirmed by the school office at the time of admission.',
    hi: 'वर्तमान सत्र में उपलब्ध कक्षाओं की पुष्टि प्रवेश के समय स्कूल कार्यालय द्वारा की जाती है।',
  } satisfies Localized,
  approach: [
    {
      icon: 'sparkles',
      title: { en: 'Concept-first teaching', hi: 'अवधारणा-आधारित शिक्षण' },
      body: {
        en: 'Understanding before memorising, so learning stays with the child.',
        hi: 'रटने से पहले समझ, ताकि सीखा हुआ बच्चे के साथ बना रहे।',
      },
    },
    {
      icon: 'user',
      title: { en: 'Personal attention', hi: 'व्यक्तिगत ध्यान' },
      body: {
        en: 'Teachers who know each student and notice when support is needed.',
        hi: 'ऐसे शिक्षक जो हर विद्यार्थी को जानते हैं और आवश्यकता पड़ने पर सहयोग करते हैं।',
      },
    },
    {
      icon: 'message',
      title: { en: 'Regular parent communication', hi: 'अभिभावकों से नियमित संवाद' },
      body: {
        en: 'A working partnership between home and school, with honest feedback.',
        hi: 'घर और स्कूल के बीच साझेदारी, ईमानदार प्रतिक्रिया के साथ।',
      },
    },
    {
      icon: 'cap',
      title: { en: 'Learning beyond the textbook', hi: 'पाठ्यपुस्तक से आगे' },
      body: {
        en: 'Activities and projects that connect lessons to real life.',
        hi: 'गतिविधियाँ और परियोजनाएँ जो पाठ को वास्तविक जीवन से जोड़ती हैं।',
      },
    },
  ] satisfies { icon: IconName; title: Localized; body: Localized }[],
}

export const facilityItems = [
  {
    icon: 'snowflake',
    tag: { en: 'Signature', hi: 'विशेषता' },
    title: { en: 'Air-conditioned classrooms', hi: 'वातानुकूलित कक्षाएँ' },
    body: {
      en: 'Cool, comfortable classrooms designed for focused learning from the first bell to the last.',
      hi: 'पहली से अंतिम घंटी तक एकाग्रता से सीखने के लिए बनी ठंडी, आरामदायक कक्षाएँ।',
    },
    image: 'class-group',
  },
  {
    icon: 'flask',
    tag: { en: 'Learning', hi: 'अधिगम' },
    title: { en: 'Science laboratories', hi: 'विज्ञान प्रयोगशालाएँ' },
    body: {
      en: 'A dedicated space for hands-on experiments and practical understanding.',
      hi: 'प्रयोगों और व्यावहारिक समझ के लिए समर्पित स्थान।',
    },
  },
  {
    icon: 'book',
    tag: { en: 'Learning', hi: 'अधिगम' },
    title: { en: 'Library & reading room', hi: 'पुस्तकालय एवं वाचन कक्ष' },
    body: {
      en: 'Quiet reading, reference material, and room to discover the habit of books.',
      hi: 'शांत वाचन, संदर्भ सामग्री और पुस्तकों की आदत विकसित करने का स्थान।',
    },
  },
  {
    icon: 'trophy',
    tag: { en: 'Wellbeing', hi: 'कल्याण' },
    title: { en: 'Sports & physical activity', hi: 'खेल एवं शारीरिक गतिविधि' },
    body: {
      en: 'Room to move, play, and build teamwork, fitness, and confidence.',
      hi: 'दौड़ने, खेलने और टीम भावना, फिटनेस व आत्मविश्वास बनाने का अवसर।',
    },
    image: 'assembly-ground',
  },
  {
    icon: 'shield',
    tag: { en: 'Safety', hi: 'सुरक्षा' },
    title: { en: 'Safe, monitored campus', hi: 'सुरक्षित, निगरानी वाला परिसर' },
    body: {
      en: 'A welcoming entry and a campus culture built on care, respect, and discipline.',
      hi: 'स्वागतपूर्ण प्रवेश द्वार और देखभाल, सम्मान व अनुशासन पर आधारित परिसर संस्कृति।',
    },
    image: 'gate-daylight',
  },
  {
    icon: 'camera',
    tag: { en: 'Expression', hi: 'अभिव्यक्ति' },
    title: { en: 'Creative & activity spaces', hi: 'रचनात्मक एवं गतिविधि स्थल' },
    body: {
      en: 'Space for art, music, assemblies, and the cultural life of the school.',
      hi: 'कला, संगीत, सभाओं और स्कूल के सांस्कृतिक जीवन के लिए स्थान।',
    },
    image: 'janmashtami',
  },
] satisfies {
  icon: IconName
  tag: Localized
  title: Localized
  body: Localized
  image?: string
}[]

export const facilitiesCopy = {
  eyebrow: { en: 'Facilities', hi: 'सुविधाएँ' } satisfies Localized,
  title: { en: 'A campus designed around comfort.', hi: 'सुविधा को केंद्र में रखकर बना परिसर।' } satisfies Localized,
  lead: {
    en: 'From air-conditioned classrooms to spaces for reading, science, sport, and creativity — the campus is planned to support the whole school day.',
    hi: 'वातानुकूलित कक्षाओं से लेकर वाचन, विज्ञान, खेल और रचनात्मकता के स्थानों तक — परिसर पूरे स्कूल दिवस को सहयोग देने के लिए तैयार है।',
  } satisfies Localized,
  note: {
    en: 'Facility availability is confirmed by the school office. Please call before planning your visit.',
    hi: 'सुविधाओं की उपलब्धता की पुष्टि स्कूल कार्यालय करता है। विज़िट की योजना बनाने से पहले कृपया कॉल करें।',
  } satisfies Localized,
  amenitiesTitle: { en: 'Also part of campus life', hi: 'परिसर जीवन का हिस्सा' } satisfies Localized,
  amenities: [
    { en: 'Computer education', hi: 'कंप्यूटर शिक्षा' },
    { en: 'CCTV-monitored campus', hi: 'सीसीटीवी निगरानी वाला परिसर' },
    { en: 'Assemblies & activity spaces', hi: 'सभा एवं गतिविधि स्थल' },
    { en: 'Transport — confirm availability', hi: 'परिवहन — उपलब्धता की पुष्टि करें' },
  ] as Localized[],
}

export const campusItems = [
  {
    icon: 'sparkles',
    title: { en: 'Cultural celebrations', hi: 'सांस्कृतिक उत्सव' },
    body: {
      en: 'Festivals and performances that bring the school together and give students a stage.',
      hi: 'ऐसे उत्सव और प्रस्तुतियाँ जो पूरे स्कूल को जोड़ती हैं और विद्यार्थियों को मंच देती हैं।',
    },
    image: 'janmashtami',
  },
  {
    icon: 'trophy',
    title: { en: 'Sports & fitness', hi: 'खेल एवं फिटनेस' },
    body: {
      en: 'Physical activity that builds health, teamwork, and a healthy spirit of competition.',
      hi: 'शारीरिक गतिविधि जो स्वास्थ्य, टीम भावना और स्वस्थ प्रतिस्पर्धा का भाव विकसित करती है।',
    },
    image: 'assembly-ground',
  },
  {
    icon: 'camera',
    title: { en: 'Art & creativity', hi: 'कला एवं रचनात्मकता' },
    body: {
      en: 'Opportunities to draw, make, perform, and present — because confidence is built by doing.',
      hi: 'चित्र बनाने, सृजन करने, प्रस्तुति देने के अवसर — क्योंकि आत्मविश्वास करने से बनता है।',
    },
  },
  {
    icon: 'star',
    title: { en: 'Values & national days', hi: 'मूल्य एवं राष्ट्रीय दिवस' },
    body: {
      en: 'Assemblies and observances that help students understand respect, responsibility, and community.',
      hi: 'सभाएँ और आयोजन जो विद्यार्थियों को सम्मान, जिम्मेदारी और समुदाय का अर्थ समझाते हैं।',
    },
    image: 'patel-jayanti',
  },
  {
    icon: 'users',
    title: { en: 'Student participation', hi: 'विद्यार्थी सहभागिता' },
    body: {
      en: 'Every student is encouraged to take part — on stage, on the field, and in the classroom.',
      hi: 'हर विद्यार्थी को भाग लेने के लिए प्रोत्साहित किया जाता है — मंच पर, मैदान पर और कक्षा में।',
    },
    image: 'celebration-rps',
  },
  {
    icon: 'flask',
    title: { en: 'Educational events', hi: 'शैक्षणिक आयोजन' },
    body: {
      en: 'Workshops, demonstrations, and activities that take learning past the pages of a book.',
      hi: 'कार्यशालाएँ, प्रदर्शन और गतिविधियाँ जो सीखने को पुस्तक के पन्नों से आगे ले जाती हैं।',
    },
  },
] satisfies { icon: IconName; title: Localized; body: Localized; image?: string }[]

export const campusCopy = {
  eyebrow: { en: 'Campus Life', hi: 'परिसर जीवन' } satisfies Localized,
  title: { en: 'Life beyond the classroom.', hi: 'कक्षा से आगे का जीवन।' } satisfies Localized,
  lead: {
    en: 'A school day is more than lessons. It is friendships, assemblies, sport, celebration, and the small moments that build a child’s confidence.',
    hi: 'स्कूल का दिन केवल पाठों से अधिक है — दोस्तियाँ, सभाएँ, खेल, उत्सव और वे छोटे पल जो बच्चे का आत्मविश्वास बनाते हैं।',
  } satisfies Localized,
  note: {
    en: 'Event details and the annual calendar are shared by the school office.',
    hi: 'आयोजनों का विवरण और वार्षिक कैलेंडर स्कूल कार्यालय द्वारा साझा किया जाता है।',
  } satisfies Localized,
}

export const principal = {
  eyebrow: { en: "From the Principal's Desk", hi: 'प्रधानाचार्य की ओर से' } satisfies Localized,
  title: { en: 'Every child deserves to be seen.', hi: 'हर बच्चे को पहचान मिलनी चाहिए।' } satisfies Localized,
  paragraphs: [
    {
      en: 'At Royal Public School, education is more than a syllabus. It is the patient work of helping a child discover what they are capable of — academically, socially, and personally.',
      hi: 'रॉयल पब्लिक स्कूल में शिक्षा केवल पाठ्यक्रम नहीं है। यह एक बच्चे को यह खोजने में मदद करने का धैर्यपूर्ण कार्य है कि वह क्या कर सकता है — शैक्षणिक, सामाजिक और व्यक्तिगत रूप से।',
    },
    {
      en: 'We believe strong values, clear guidance, and a genuinely comfortable environment allow children to take part with confidence. Our teachers know their students as individuals, and our classrooms are places where questions are welcome.',
      hi: 'हमारा विश्वास है कि मजबूत मूल्य, स्पष्ट मार्गदर्शन और सचमुच आरामदायक वातावरण बच्चों को आत्मविश्वास के साथ आगे बढ़ने देते हैं। हमारे शिक्षक विद्यार्थियों को व्यक्तिगत रूप से जानते हैं, और हमारी कक्षाएँ ऐसे स्थान हैं जहाँ प्रश्नों का स्वागत है।',
    },
    {
      en: 'We invite parents to visit our campus in Tatiri, meet our team, and see the environment we are building for their child.',
      hi: 'हम अभिभावकों को ततिरी स्थित हमारे परिसर में आने, हमारी टीम से मिलने और उस वातावरण को देखने के लिए आमंत्रित करते हैं जो हम उनके बच्चे के लिए बना रहे हैं।',
    },
  ] as Localized[],
  signoff: { en: 'The Principal', hi: 'प्रधानाचार्य' } satisfies Localized,
  note: {
    en: 'Placeholder portrait and draft message — to be approved by the school before launch.',
    hi: 'चित्र एवं संदेश का प्रारूपिक स्वरूप — लॉन्च से पहले स्कूल द्वारा अनुमोदन आवश्यक।',
  } satisfies Localized,
}

export type GalleryCategory = 'campus' | 'classrooms' | 'events'

export const galleryItems: {
  name: string
  imageUrl: string
  title: Localized
  alt: Localized
  category: GalleryCategory
  tall?: boolean
}[] = [
  {
    name: 'hero-campus',
    imageUrl: '',
    title: { en: 'The campus on Independence Day', hi: 'स्वतंत्रता दिवस पर परिसर' },
    alt: {
      en: 'Students in tricolour caps seated in formation in the school courtyard during an Independence Day assembly',
      hi: 'स्वतंत्रता दिवस सभा के दौरान स्कूल प्रांगण में तिरंगे टोपी पहने विद्यार्थी',
    },
    category: 'events',
    tall: true,
  },
  {
    name: 'school-building',
    imageUrl: '',
    title: { en: 'The school building', hi: 'स्कूल भवन' },
    alt: {
      en: 'The Royal Public School building seen across the checkered courtyard, with the admission board on the facade',
      hi: 'चौकोर टाइल वाले प्रांगण के पार रॉयल पब्लिक स्कूल का भवन, सामने प्रवेश बोर्ड',
    },
    category: 'campus',
  },
  {
    name: 'school-gate',
    imageUrl: '',
    title: { en: 'The illuminated entrance', hi: 'रोशनी से जगमग प्रवेश द्वार' },
    alt: {
      en: 'The Royal Public School entrance gate with its illuminated name sign at dusk',
      hi: 'गोधूलि के समय रोशनी से जगमग नाम-पट्टिका सहित रॉयल पब्लिक स्कूल का प्रवेश द्वार',
    },
    category: 'campus',
    tall: true,
  },
  {
    name: 'gate-daylight',
    imageUrl: '',
    title: { en: 'The gate by day', hi: 'दिन में प्रवेश द्वार' },
    alt: {
      en: 'The blue and yellow entrance gate of Royal Public School in daylight',
      hi: 'दिन के उजाले में रॉयल पब्लिक स्कूल का नीला-पीला प्रवेश द्वार',
    },
    category: 'campus',
  },
  {
    name: 'class-group',
    imageUrl: '',
    title: { en: 'A class photograph', hi: 'कक्षा का सामूहिक चित्र' },
    alt: {
      en: 'Students in winter uniform seated for a class photograph in front of the school building',
      hi: 'स्कूल भवन के सामने शीतकालीन यूनिफ़ॉर्म में बैठे विद्यार्थी',
    },
    category: 'classrooms',
  },
  {
    name: 'assembly-ground',
    imageUrl: '',
    title: { en: 'Morning assembly and drill', hi: 'प्रातःकालीन सभा एवं व्यायाम' },
    alt: {
      en: 'Students in white uniform standing in rows during the morning drill on the school ground',
      hi: 'स्कूल मैदान पर प्रातःकालीन व्यायाम के दौरान पंक्तियों में खड़े श्वेत यूनिफ़ॉर्म वाले विद्यार्थी',
    },
    category: 'events',
  },
  {
    name: 'celebration-rps',
    imageUrl: '',
    title: { en: 'RPS formation', hi: 'आरपीएस आकृति' },
    alt: {
      en: 'Students seated on the courtyard lawn spelling out RPS with coloured caps',
      hi: 'प्रांगण के लॉन पर रंगीन टोपियों से आरपीएस लिखते बैठे विद्यार्थी',
    },
    category: 'events',
    tall: true,
  },
  {
    name: 'patel-jayanti',
    imageUrl: '',
    title: { en: 'Sardar Patel Jayanti', hi: 'सरदार पटेल जयंती' },
    alt: {
      en: 'Students and teachers with a portrait of Sardar Vallabhbhai Patel on his birth anniversary',
      hi: 'सरदार वल्लभभाई पटेल की जयंती पर उनके चित्र के साथ विद्यार्थी एवं शिक्षक',
    },
    category: 'events',
  },
  {
    name: 'janmashtami',
    imageUrl: '',
    title: { en: 'Janmashtami celebration', hi: 'जन्माष्टमी उत्सव' },
    alt: {
      en: 'Young students in Krishna costumes seated on stage with their teachers during a Janmashtami celebration',
      hi: 'जन्माष्टमी उत्सव के दौरान मंच पर कृष्ण वेश में बैठे बच्चे और शिक्षिकाएँ',
    },
    category: 'events',
  },
]

export const galleryCopy = {
  eyebrow: { en: 'Gallery', hi: 'गैलरी' } satisfies Localized,
  title: { en: 'A look around the campus.', hi: 'परिसर पर एक नज़र।' } satisfies Localized,
  lead: {
    en: 'The building, the assemblies, and the everyday life of the school. Browse by space or occasion.',
    hi: 'भवन, सभाएँ और स्कूल का दैनिक जीवन। स्थान या अवसर के अनुसार देखें।',
  } satisfies Localized,
  categories: [
    { id: 'all', label: { en: 'All', hi: 'सभी' } },
    { id: 'campus', label: { en: 'Campus', hi: 'परिसर' } },
    { id: 'classrooms', label: { en: 'Classrooms', hi: 'कक्षाएँ' } },
    { id: 'events', label: { en: 'Events', hi: 'आयोजन' } },
  ] as { id: 'all' | GalleryCategory; label: Localized }[],
}

export const admissionsCopy = {
  eyebrow: { en: 'Admissions', hi: 'प्रवेश' } satisfies Localized,
  title: { en: 'A simple, personal admission process.', hi: 'सरल और व्यक्तिगत प्रवेश प्रक्रिया।' } satisfies Localized,
  lead: {
    en: 'We would like to meet you and your child. Begin with an enquiry, visit the campus, and let us answer your questions before you decide.',
    hi: 'हम आपसे और आपके बच्चे से मिलना चाहते हैं। पूछताछ से शुरुआत करें, परिसर आएँ और निर्णय लेने से पहले अपने प्रश्नों के उत्तर पाएँ।',
  } satisfies Localized,
  ctaTitle: { en: 'Give Your Child the Right Foundation for a Bright Future', hi: 'अपने बच्चे को उज्ज्वल भविष्य की सही नींव दें' } satisfies Localized,
  ctaBody: {
    en: 'Discover a learning environment where students are encouraged to learn, grow, and achieve their potential.',
    hi: 'ऐसे अधिगम वातावरण से जुड़ें जहाँ विद्यार्थियों को सीखने, आगे बढ़ने और अपनी क्षमता तक पहुँचने के लिए प्रोत्साहित किया जाता है।',
  } satisfies Localized,
  stepsTitle: { en: 'How admission works', hi: 'प्रवेश कैसे होता है' } satisfies Localized,
  steps: [
    {
      no: '01',
      title: { en: 'Enquire', hi: 'पूछताछ करें' },
      body: {
        en: 'Call, WhatsApp, or send the enquiry form with your child’s name and the class you are considering.',
        hi: 'कॉल करें, व्हाट्सऐप करें या पूछताछ फ़ॉर्म भेजें — बच्चे का नाम और विचाराधीन कक्षा बताएँ।',
      },
    },
    {
      no: '02',
      title: { en: 'Visit', hi: 'परिसर देखें' },
      body: {
        en: 'Plan a campus visit with the school office. See the classrooms and ask anything you need to.',
        hi: 'स्कूल कार्यालय से विज़िट की योजना बनाएँ। कक्षाएँ देखें और जो भी जानना चाहें, पूछें।',
      },
    },
    {
      no: '03',
      title: { en: 'Meet', hi: 'मिलें' },
      body: {
        en: 'Talk with the school team about your child, the curriculum, and the admission requirements.',
        hi: 'स्कूल टीम से अपने बच्चे, पाठ्यक्रम और प्रवेश आवश्यकताओं के बारे में बात करें।',
      },
    },
    {
      no: '04',
      title: { en: 'Confirm', hi: 'पुष्टि करें' },
      body: {
        en: 'Complete the admission formalities and documents once you are ready and a seat is confirmed.',
        hi: 'तैयार होने और सीट की पुष्टि होने पर प्रवेश औपचारिकताएँ और दस्तावेज़ पूरे करें।',
      },
    },
  ] as { no: string; title: Localized; body: Localized }[],
  documentsTitle: { en: 'What to bring', hi: 'क्या साथ लाएँ' } satisfies Localized,
  documents: [
    { en: 'Birth certificate', hi: 'जन्म प्रमाण पत्र' },
    { en: 'Recent passport-size photographs', hi: 'हाल के पासपोर्ट आकार के फ़ोटोग्राफ़' },
    { en: 'Previous school record or transfer certificate, if applicable', hi: 'पूर्व स्कूल का रिकॉर्ड या स्थानांतरण प्रमाण पत्र, यदि लागू हो' },
    { en: 'Address proof', hi: 'पते का प्रमाण' },
    { en: 'Any additional documents requested by the school office', hi: 'स्कूल कार्यालय द्वारा माँगे गए अतिरिक्त दस्तावेज़' },
  ] as Localized[],
  note: {
    en: 'Admissions are subject to seat availability and the school’s confirmation. Please call the office for the current session.',
    hi: 'प्रवेश सीट उपलब्धता और स्कूल की पुष्टि के अधीन है। वर्तमान सत्र के लिए कृपया कार्यालय को कॉल करें।',
  } satisfies Localized,
  formTitle: { en: 'Admission enquiry', hi: 'प्रवेश पूछताछ' } satisfies Localized,
  formBody: {
    en: 'Share a few details and the enquiry opens in WhatsApp, addressed to the school office.',
    hi: 'कुछ विवरण साझा करें और पूछताछ स्कूल कार्यालय के व्हाट्सऐप पर खुल जाएगी।',
  } satisfies Localized,
}

export const classOptions = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'Not sure yet',
].map((value) => ({ value, label: value }))

export const faqs = [
  {
    q: { en: 'Which classes are available?', hi: 'कौन-सी कक्षाएँ उपलब्ध हैं?' },
    a: {
      en: 'Class availability is confirmed by the school office for each session. Please call +91 99973 20389 or send an enquiry with the class you are considering.',
      hi: 'प्रत्येक सत्र के लिए कक्षाओं की उपलब्धता स्कूल कार्यालय द्वारा बताई जाती है। कृपया +91 99973 20389 पर कॉल करें या विचाराधीन कक्षा के साथ पूछताछ भेजें।',
    },
  },
  {
    q: { en: 'Is the school fully air-conditioned?', hi: 'क्या स्कूल पूर्णतः वातानुकूलित है?' },
    a: {
      en: 'Yes. Fully air-conditioned classrooms are central to the school’s identity and everyday learning environment.',
      hi: 'हाँ। पूर्णतः वातानुकूलित कक्षाएँ स्कूल की पहचान और दैनिक अधिगम वातावरण का केंद्र हैं।',
    },
  },
  {
    q: { en: 'How do I apply for admission?', hi: 'प्रवेश के लिए आवेदन कैसे करें?' },
    a: {
      en: 'Send the enquiry form, which opens WhatsApp with your details, or call the school office. The team will guide you through the next steps.',
      hi: 'पूछताछ फ़ॉर्म भेजें, जो आपके विवरण सहित व्हाट्सऐप खोलता है, या स्कूल कार्यालय को कॉल करें। टीम आगे की प्रक्रिया में मार्गदर्शन करेगी।',
    },
  },
  {
    q: { en: 'Can we visit before applying?', hi: 'क्या आवेदन से पहले परिसर देख सकते हैं?' },
    a: {
      en: 'Yes. Call the office to schedule a visit and see the classrooms, facilities, and campus for yourself.',
      hi: 'हाँ। विज़िट तय करने के लिए कार्यालय को कॉल करें और कक्षाएँ, सुविधाएँ व परिसर स्वयं देखें।',
    },
  },
  {
    q: { en: 'Where is the school located?', hi: 'स्कूल कहाँ स्थित है?' },
    a: {
      en: 'Samadi Road, Tatiri, Tatiri Rural, Uttar Pradesh – 250601. Directions are available on the contact page.',
      hi: 'समादी रोड, ततिरी, ततिरी ग्रामीण, उत्तर प्रदेश – 250601। दिशा-निर्देश संपर्क पृष्ठ पर उपलब्ध हैं।',
    },
  },
  {
    q: { en: 'What are the school timings?', hi: 'स्कूल का समय क्या है?' },
    a: {
      en: 'Please call the office to confirm current timings. We do not publish hours that may change without notice.',
      hi: 'वर्तमान समय की पुष्टि के लिए कृपया कार्यालय को कॉल करें। हम ऐसे समय प्रकाशित नहीं करते जो बिना सूचना बदल सकें।',
    },
  },
] as { q: Localized; a: Localized }[]

export const contactCopy = {
  eyebrow: { en: 'Contact Us', hi: 'संपर्क करें' } satisfies Localized,
  title: { en: 'We would love to hear from you.', hi: 'हम आपसे सुनना चाहेंगे।' } satisfies Localized,
  lead: {
    en: 'For admissions, visits, or any question about the school, speak with our office. We are happy to help.',
    hi: 'प्रवेश, विज़िट या स्कूल से जुड़े किसी भी प्रश्न के लिए हमारे कार्यालय से बात करें। हम सहायता के लिए तैयार हैं।',
  } satisfies Localized,
  callTitle: { en: 'Call the school', hi: 'स्कूल को कॉल करें' } satisfies Localized,
  callBody: {
    en: 'The quickest way to get an answer is to call. Our office can help with admissions and visits.',
    hi: 'उत्तर पाने का सबसे तेज़ तरीका कॉल करना है। हमारा कार्यालय प्रवेश और विज़िट में सहायता कर सकता है।',
  } satisfies Localized,
  visitTitle: { en: 'Visit the campus', hi: 'परिसर पर आएँ' } satisfies Localized,
  visitBody: {
    en: 'Samadi Road, Tatiri, Tatiri Rural, Uttar Pradesh – 250601. Please call before visiting so we can welcome you properly.',
    hi: 'समादी रोड, ततिरी, ततिरी ग्रामीण, उत्तर प्रदेश – 250601। कृपया आने से पहले कॉल करें ताकि हम आपका उचित स्वागत कर सकें।',
  } satisfies Localized,
  mapTitle: { en: 'Find us on the map', hi: 'मानचित्र पर हमें खोजें' } satisfies Localized,
  formTitle: { en: 'Send an enquiry', hi: 'पूछताछ भेजें' } satisfies Localized,
  formBody: {
    en: 'Use the form for admission questions or a campus visit. It opens WhatsApp with your message ready to send.',
    hi: 'प्रवेश संबंधी प्रश्न या परिसर विज़िट के लिए फ़ॉर्म का उपयोग करें। यह आपके संदेश के साथ व्हाट्सऐप खोलता है।',
  } satisfies Localized,
}

export const aboutCopy = {
  eyebrow: { en: 'About the School', hi: 'स्कूल के बारे में' } satisfies Localized,
  title: { en: 'A school built around the child.', hi: 'बच्चे को केंद्र में रखकर बना स्कूल।' } satisfies Localized,
  lead: {
    en: 'Royal Public School is a neighbourhood school in Tatiri, Baghpat, with a clear purpose: give children a comfortable, disciplined, and encouraging place to learn.',
    hi: 'रॉयल पब्लिक स्कूल ततिरी, बागपत का एक पड़ोसी विद्यालय है, जिसका स्पष्ट उद्देश्य है — बच्चों को सीखने के लिए आरामदायक, अनुशासित और प्रोत्साहन देने वाला स्थान देना।',
  } satisfies Localized,
  story: [
    {
      en: 'The school was founded on a practical idea: a child’s surroundings shape how well they learn. When a classroom is comfortable and a school feels welcoming, attention settles and confidence grows.',
      hi: 'स्कूल की स्थापना एक व्यावहारिक विचार पर हुई: बच्चे का वातावरण यह तय करता है कि वह कितना अच्छा सीखता है। जब कक्षा आरामदायक हो और स्कूल स्वागतपूर्ण लगे, तो एकाग्रता बढ़ती है और आत्मविश्वास फलता-फूलता है।',
    },
    {
      en: 'That is why the campus is fully air-conditioned — a decision made for everyday learning, not for appearance. It is also why teachers are encouraged to know students individually and to keep parents close.',
      hi: 'इसी कारण परिसर पूर्णतः वातानुकूलित है — यह निर्णय दिखावे के लिए नहीं, बल्कि दैनिक अधिगम के लिए लिया गया है। इसी कारण शिक्षकों को विद्यार्थियों को व्यक्तिगत रूप से जानने और अभिभावकों को निकट रखने के लिए प्रोत्साहित किया जाता है।',
    },
    {
      en: 'We are located on Samadi Road in Tatiri, serving families in Tatiri and across Baghpat who want a quality education close to home.',
      hi: 'हम ततिरी की समादी रोड पर स्थित हैं और ततिरी तथा पूरे बागपत के उन परिवारों की सेवा करते हैं जो घर के निकट गुणवत्तापूर्ण शिक्षा चाहते हैं।',
    },
  ] as Localized[],
  approachTitle: { en: 'How we think about learning', hi: 'हम सीखने के बारे में कैसे सोचते हैं' } satisfies Localized,
  approach: [
    {
      icon: 'snowflake',
      title: { en: 'Comfort as a foundation', hi: 'आराम — आधार' },
      body: {
        en: 'A cool, settled classroom is not decoration. It is the condition in which good learning becomes possible.',
        hi: 'ठंडी, सहज कक्षा कोई सजावट नहीं है। यह वह स्थिति है जिसमें अच्छी शिक्षा संभव होती है।',
      },
    },
    {
      icon: 'user',
      title: { en: 'Attention, not just instruction', hi: 'केवल पढ़ाना नहीं, ध्यान देना' },
      body: {
        en: 'A child who feels noticed is more willing to try, to ask, and to improve.',
        hi: 'जिस बच्चे को पहचान मिलती है, वह प्रयास करने, पूछने और सुधारने के लिए अधिक तैयार होता है।',
      },
    },
    {
      icon: 'scale',
      title: { en: 'Values in everyday life', hi: 'मूल्य — दैनिक जीवन में' },
      body: {
        en: 'Discipline and respect are practised in small, consistent ways — not only spoken about.',
        hi: 'अनुशासन और सम्मान को छोटे, निरंतर तरीकों से अभ्यास में लाया जाता है — केवल कहा नहीं जाता।',
      },
    },
  ] as { icon: IconName; title: Localized; body: Localized }[],
  valuesTitle: { en: 'What we stand for', hi: 'हमारे मूल्य' } satisfies Localized,
  values: [
    {
      title: { en: 'Care', hi: 'देखभाल' },
      body: { en: 'Children are known, heard, and supported.', hi: 'बच्चों को जाना जाता है, सुना जाता है और सहयोग दिया जाता है।' },
    },
    {
      title: { en: 'Discipline', hi: 'अनुशासन' },
      body: { en: 'Clear expectations, applied with fairness.', hi: 'स्पष्ट अपेक्षाएँ, निष्पक्षता के साथ।' },
    },
    {
      title: { en: 'Confidence', hi: 'आत्मविश्वास' },
      body: { en: 'The courage to participate and to try.', hi: 'भाग लेने और प्रयास करने का साहस।' },
    },
    {
      title: { en: 'Curiosity', hi: 'जिज्ञासा' },
      body: { en: 'Questions are a sign of a healthy classroom.', hi: 'प्रश्न स्वस्थ कक्षा का संकेत हैं।' },
    },
  ] as { title: Localized; body: Localized }[],
  glanceTitle: { en: 'At a glance', hi: 'एक नज़र में' } satisfies Localized,
  glance: [
    { label: { en: 'Location', hi: 'स्थान' }, value: { en: 'Tatiri, Baghpat, UP', hi: 'ततिरी, बागपत, उ.प्र.' } },
    { label: { en: 'Campus', hi: 'परिसर' }, value: { en: 'Fully air-conditioned', hi: 'पूर्णतः वातानुकूलित' } },
    { label: { en: 'Curriculum', hi: 'पाठ्यक्रम' }, value: { en: 'CBSE curriculum', hi: 'सीबीएसई पाठ्यक्रम' } },
    { label: { en: 'Focus', hi: 'केंद्र' }, value: { en: 'The whole child', hi: 'समग्र बालक' } },
  ] as { label: Localized; value: Localized }[],
}

export const visionCopy = {
  eyebrow: { en: 'Vision & Mission', hi: 'दृष्टि एवं मिशन' } satisfies Localized,
  title: { en: 'Comfort, confidence, and character.', hi: 'सुविधा, आत्मविश्वास और चरित्र।' } satisfies Localized,
  lead: {
    en: 'Our purpose is simple and ambitious: to give every child in Baghpat a learning environment that supports them fully — in the classroom and beyond it.',
    hi: 'हमारा उद्देश्य सरल और महत्वाकांक्षी है — बागपत के हर बच्चे को ऐसा अधिगम वातावरण देना जो उसे कक्षा में और उससे आगे भी पूर्ण सहयोग दे।',
  } satisfies Localized,
  visionLabel: { en: 'Our Vision', hi: 'हमारी दृष्टि' } satisfies Localized,
  vision: {
    en: 'To be a school where every child can learn in comfort, discover their strengths, and step into the world with confidence and good character.',
    hi: 'ऐसा विद्यालय बनना जहाँ हर बच्चा आराम से सीख सके, अपनी क्षमताओं को पहचान सके और आत्मविश्वास तथा उत्तम चरित्र के साथ दुनिया में कदम रख सके।',
  } satisfies Localized,
  missionLabel: { en: 'Our Mission', hi: 'हमारा मिशन' } satisfies Localized,
  mission: [
    {
      en: 'Create classrooms that are comfortable, calm, and ready for learning.',
      hi: 'ऐसी कक्षाएँ बनाना जो आरामदायक, शांत और सीखने के लिए तैयार हों।',
    },
    {
      en: 'Build strong academic foundations with patience and personal attention.',
      hi: 'धैर्य और व्यक्तिगत ध्यान के साथ मजबूत शैक्षणिक नींव रखना।',
    },
    {
      en: 'Encourage values, discipline, and the confidence to participate.',
      hi: 'मूल्यों, अनुशासन और भाग लेने के आत्मविश्वास को प्रोत्साहित करना।',
    },
    {
      en: 'Work closely with parents as partners in each child’s progress.',
      hi: 'हर बच्चे की प्रगति में अभिभावकों के साथ साझेदारी में काम करना।',
    },
  ] as Localized[],
  principlesTitle: { en: 'What guides us', hi: 'हमारा मार्गदर्शन' } satisfies Localized,
  principles: [
    {
      no: '01',
      title: { en: 'Every child is capable', hi: 'हर बच्चा सक्षम है' },
      body: {
        en: 'Progress looks different for each student. Our job is to notice it and encourage it.',
        hi: 'प्रगति हर विद्यार्थी के लिए अलग दिखती है। हमारा काम उसे पहचानना और प्रोत्साहित करना है।',
      },
    },
    {
      no: '02',
      title: { en: 'Comfort supports learning', hi: 'सुविधा सीखने में सहायक है' },
      body: {
        en: 'A fully air-conditioned campus is a practical commitment to better attention and wellbeing.',
        hi: 'पूर्णतः वातानुकूलित परिसर बेहतर एकाग्रता और कल्याण के प्रति व्यावहारिक प्रतिबद्धता है।',
      },
    },
    {
      no: '03',
      title: { en: 'Character matters', hi: 'चरित्र मायने रखता है' },
      body: {
        en: 'Respect, responsibility, and honesty are part of the education, not an extra subject.',
        hi: 'सम्मान, जिम्मेदारी और ईमानदारी शिक्षा का हिस्सा हैं, कोई अतिरिक्त विषय नहीं।',
      },
    },
    {
      no: '04',
      title: { en: 'Parents are partners', hi: 'अभिभावक साझेदार हैं' },
      body: {
        en: 'A child does best when home and school share the same encouraging message.',
        hi: 'बच्चा तब सबसे अच्छा करता है जब घर और स्कूल एक ही प्रोत्साहन भरा संदेश दें।',
      },
    },
  ] as { no: string; title: Localized; body: Localized }[],
}

export const seo = {
  '/': {
    title: {
      en: 'Royal Public School, Tatiri | School in Baghpat',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी | बागपत का स्कूल',
    },
    description: {
      en: 'Royal Public School in Tatiri, Baghpat offers air-conditioned classrooms and school-owned, fully air-conditioned transport in Tatiri and Baghpat city. School updates, admissions and contact information.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत में वातानुकूलित कक्षाएँ और स्कूल के स्वामित्व वाली वातानुकूलित परिवहन सुविधा उपलब्ध है। स्कूल समाचार और प्रवेश जानकारी देखें।',
    },
  },
  '/about': {
    title: { en: 'About Royal Public School, Tatiri, Baghpat', hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत के बारे में' },
    description: {
      en: 'Learn about Royal Public School in Tatiri, Baghpat — our approach to comfortable, student-centred education and the values that guide the school.',
      hi: 'ततिरी, बागपत के रॉयल पब्लिक स्कूल के बारे में जानें — आरामदायक, विद्यार्थी-केंद्रित शिक्षा के हमारे तरीके और स्कूल के मूल्य।',
    },
  },
  '/vision-mission': {
    title: { en: 'Vision & Mission | Royal Public School Tatiri', hi: 'दृष्टि एवं मिशन | रॉयल पब्लिक स्कूल ततिरी' },
    description: {
      en: 'Our vision and mission: a comfortable school where every child in Baghpat learns with confidence, discipline, and care.',
      hi: 'हमारी दृष्टि और मिशन: एक आरामदायक विद्यालय जहाँ बागपत का हर बच्चा आत्मविश्वास, अनुशासन और देखभाल के साथ सीखे।',
    },
  },
  '/academics': {
    title: { en: 'Academics | CBSE School in Tatiri, Baghpat', hi: 'शैक्षणिक | ततिरी, बागपत में सीबीएसई विद्यालय' },
    description: {
      en: 'Discover the academic approach at Royal Public School, Tatiri — strong foundations, personal attention, and a CBSE curriculum.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी की शैक्षणिक पद्धति जानें — मजबूत नींव, व्यक्तिगत ध्यान और सीबीएसई पाठ्यक्रम।',
    },
  },
  '/facilities': {
    title: { en: 'Facilities | Fully AC School in Baghpat', hi: 'सुविधाएँ | बागपत का पूर्ण वातानुकूलित विद्यालय' },
    description: {
      en: 'Air-conditioned classrooms, science laboratories, library, sports, and safe campus spaces at Royal Public School, Tatiri, Baghpat.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत में वातानुकूलित कक्षाएँ, विज्ञान प्रयोगशालाएँ, पुस्तकालय, खेल और सुरक्षित परिसर।',
    },
  },
  '/campus-life': {
    title: { en: 'Campus Life | Royal Public School Tatiri', hi: 'परिसर जीवन | रॉयल पब्लिक स्कूल ततिरी' },
    description: {
      en: 'Cultural celebrations, sports, creativity, and student participation at Royal Public School, Tatiri, Baghpat.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत में सांस्कृतिक उत्सव, खेल, रचनात्मकता और विद्यार्थी सहभागिता।',
    },
  },
  '/gallery': {
    title: { en: 'Gallery | Royal Public School, Tatiri', hi: 'गैलरी | रॉयल पब्लिक स्कूल, ततिरी' },
    description: {
      en: 'A look around the Royal Public School campus in Tatiri, Baghpat — classrooms, facilities, and school life.',
      hi: 'ततिरी, बागपत के रॉयल पब्लिक स्कूल परिसर पर एक नज़र — कक्षाएँ, सुविधाएँ और स्कूल जीवन।',
    },
  },
  '/updates': {
    title: { en: 'School Updates & Notices | Royal Public School, Baghpat', hi: 'स्कूल समाचार और सूचनाएँ | रॉयल पब्लिक स्कूल, बागपत' },
    description: {
      en: 'Check the latest school holidays, important notices, exam information, events, admissions and parent updates from Royal Public School, Tatiri, Baghpat.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत की छुट्टियों, सूचनाओं, परीक्षा, कार्यक्रमों, प्रवेश और अभिभावक समाचार देखें।',
    },
  },
  '/admissions': {
    title: { en: 'Admissions | Royal Public School Tatiri, Baghpat', hi: 'प्रवेश | रॉयल पब्लिक स्कूल ततिरी, बागपत' },
    description: {
      en: 'Admission enquiries at Royal Public School, Tatiri, Baghpat. Call +91 99973 20389, visit the campus, or send a WhatsApp enquiry.',
      hi: 'रॉयल पब्लिक स्कूल, ततिरी, बागपत में प्रवेश पूछताछ। +91 99973 20389 पर कॉल करें, परिसर आएँ या व्हाट्सऐप पूछताछ भेजें।',
    },
  },
  '/contact': {
    title: { en: 'Contact Royal Public School, Tatiri, Baghpat', hi: 'संपर्क करें | रॉयल पब्लिक स्कूल, ततिरी, बागपत' },
    description: {
      en: 'Contact Royal Public School, Samadi Road, Tatiri, Baghpat, UP – 250601. Call +91 99973 20389 or get directions on Google Maps.',
      hi: 'रॉयल पब्लिक स्कूल, समादी रोड, ततिरी, बागपत, उ.प्र. – 250601 से संपर्क करें। +91 99973 20389 पर कॉल करें या गूगल मैप्स पर दिशा-निर्देश पाएँ।',
    },
  },
  '/privacy': {
    title: { en: 'Privacy Policy | Royal Public School', hi: 'गोपनीयता नीति | रॉयल पब्लिक स्कूल' },
    description: {
      en: 'How Royal Public School handles information shared through this website and WhatsApp admission enquiries.',
      hi: 'यह वेबसाइट और व्हाट्सऐप प्रवेश पूछताछ के माध्यम से साझा की गई जानकारी का रॉयल पब्लिक स्कूल कैसे उपयोग करता है।',
    },
  },
  '/terms': {
    title: { en: 'Terms & Conditions | Royal Public School', hi: 'नियम एवं शर्तें | रॉयल पब्लिक स्कूल' },
    description: {
      en: 'Terms and conditions for using the Royal Public School website and admission enquiry channel.',
      hi: 'रॉयल पब्लिक स्कूल की वेबसाइट और प्रवेश पूछताछ के उपयोग की शर्तें।',
    },
  },
} as const

export type SeoPath = keyof typeof seo

export const legalCopy = {
  updated: { en: 'Last updated: November 2026', hi: 'अंतिम अद्यतन: नवंबर 2026' } satisfies Localized,
  privacyTitle: { en: 'Privacy Policy', hi: 'गोपनीयता नीति' } satisfies Localized,
  privacyIntro: {
    en: 'This policy explains what information is shared when you use this website or contact Royal Public School through the admission enquiry form.',
    hi: 'यह नीति बताती है कि इस वेबसाइट का उपयोग करते समय या प्रवेश पूछताछ फ़ॉर्म के माध्यम से रॉयल पब्लिक स्कूल से संपर्क करते समय कौन-सी जानकारी साझा की जाती है।',
  } satisfies Localized,
  privacySections: [
    {
      heading: { en: 'Information you share', hi: 'आपके द्वारा साझा की गई जानकारी' },
      body: {
        en: 'The admission and contact forms ask for a parent’s name, a student’s name, a contact number, an optional email address, and the class you are enquiring about. When you submit the form, these details are placed into a WhatsApp message addressed to the school. The website itself does not store form submissions.',
        hi: 'प्रवेश और संपर्क फ़ॉर्म में अभिभावक का नाम, विद्यार्थी का नाम, संपर्क नंबर, वैकल्पिक ईमेल पता और विचाराधीन कक्षा माँगी जाती है। फ़ॉर्म जमा करने पर ये विवरण स्कूल के व्हाट्सऐप संदेश में तैयार होते हैं। वेबसाइट स्वयं फ़ॉर्म प्रविष्टियाँ संग्रहीत नहीं करती।',
      },
    },
    {
      heading: { en: 'How information is used', hi: 'जानकारी का उपयोग' },
      body: {
        en: 'Information shared with the school office is used to respond to your enquiry, arrange a campus visit, and guide the admission process. It is not sold or shared for marketing by third parties.',
        hi: 'स्कूल कार्यालय के साथ साझा जानकारी आपकी पूछताछ का उत्तर देने, परिसर विज़िट तय करने और प्रवेश प्रक्रिया में मार्गदर्शन के लिए उपयोग की जाती है। इसे बेचा या विपणन के लिए तीसरे पक्ष के साथ साझा नहीं किया जाता।',
      },
    },
    {
      heading: { en: 'Third-party services', hi: 'तृतीय-पक्ष सेवाएँ' },
      body: {
        en: 'The contact page embeds a Google Map, enquiries are handled through WhatsApp, and links to the school’s official Instagram open on Instagram. Your use of those services is subject to their own privacy policies. This website does not load Instagram content automatically and does not currently use advertising or analytics trackers.',
        hi: 'संपर्क पृष्ठ पर गूगल मैप एम्बेड है, पूछताछ व्हाट्सऐप के माध्यम से होती है, और स्कूल के आधिकारिक इंस्टाग्राम के लिंक इंस्टाग्राम पर खुलते हैं। उन सेवाओं का उपयोग उनकी अपनी गोपनीयता नीतियों के अधीन है। यह वेबसाइट इंस्टाग्राम सामग्री को स्वतः लोड नहीं करती और वर्तमान में विज्ञापन या एनालिटिक्स ट्रैकर का उपयोग नहीं करती।',
      },
    },
    {
      heading: { en: 'Contact and corrections', hi: 'संपर्क एवं सुधार' },
      body: {
        en: 'To request a correction or deletion of information you have shared with the school, please call the school office at +91 99973 20389.',
        hi: 'स्कूल के साथ साझा की गई जानकारी में सुधार या हटाने का अनुरोध करने के लिए कृपया स्कूल कार्यालय को +91 99973 20389 पर कॉल करें।',
      },
    },
  ] as { heading: Localized; body: Localized }[],
  termsTitle: { en: 'Terms & Conditions', hi: 'नियम एवं शर्तें' } satisfies Localized,
  termsIntro: {
    en: 'By using this website, you agree to the following terms. If you do not agree, please contact the school office directly.',
    hi: 'इस वेबसाइट का उपयोग करके आप निम्नलिखित शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया सीधे स्कूल कार्यालय से संपर्क करें।',
  } satisfies Localized,
  termsSections: [
    {
      heading: { en: 'Information on this website', hi: 'वेबसाइट पर जानकारी' },
      body: {
        en: 'Information is provided for general guidance. Facilities, programmes, class availability, and timings may change. Please confirm current details with the school office before making a decision.',
        hi: 'जानकारी सामान्य मार्गदर्शन के लिए दी गई है। सुविधाएँ, कार्यक्रम, कक्षा उपलब्धता और समय बदल सकते हैं। निर्णय लेने से पहले कृपया स्कूल कार्यालय से वर्तमान विवरण की पुष्टि करें।',
      },
    },
    {
      heading: { en: 'Admissions', hi: 'प्रवेश' },
      body: {
        en: 'Sending an enquiry does not guarantee admission. Admissions are subject to seat availability and the school’s assessment and confirmation.',
        hi: 'पूछताछ भेजने से प्रवेश की गारंटी नहीं होती। प्रवेश सीट उपलब्धता तथा स्कूल के मूल्यांकन और पुष्टि के अधीन है।',
      },
    },
    {
      heading: { en: 'Images and content', hi: 'चित्र एवं सामग्री' },
      body: {
        en: "The photographs on this website show Royal Public School, Tatiri. Images shown in the Instagram section are published by the school's official Instagram account and open on Instagram. All original website content belongs to Royal Public School.",
        hi: 'इस वेबसाइट के चित्र रॉयल पब्लिक स्कूल, ततिरी के हैं। इंस्टाग्राम अनुभाग में दिखाए गए चित्र स्कूल के आधिकारिक इंस्टाग्राम खाते द्वारा प्रकाशित हैं और इंस्टाग्राम पर खुलते हैं। वेबसाइट की मूल सामग्री रॉयल पब्लिक स्कूल की है।',
      },
    },
    {
      heading: { en: 'External links', hi: 'बाहरी लिंक' },
      body: {
        en: 'Links to Google Maps, WhatsApp, and Instagram are provided for convenience. The school is not responsible for the content, availability, or privacy practices of third-party services.',
        hi: 'गूगल मैप्स, व्हाट्सऐप और इंस्टाग्राम के लिंक सुविधा के लिए दिए गए हैं। स्कूल तृतीय-पक्ष सेवाओं की सामग्री, उपलब्धता या गोपनीयता प्रथाओं के लिए उत्तरदायी नहीं है।',
      },
    },
  ] as { heading: Localized; body: Localized }[],
}
