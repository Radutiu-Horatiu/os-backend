import { pointsArray } from '../utils/generic';

export interface Scene {
  id: string;
  name: string;
  src: string;
  description: string[];
  points?: number;
}

export const scenes: Scene[] = [
  {
    id: 'tesla',
    name: 'Tesla F*cktory',
    src: `${process.env.CDN_URL}/scenes/tesla.jpg`,
    description: [
      'Where dreams are built... and employees are broken. 🏭',
      'Unlimited overtime, zero bathroom breaks. 🚽',
      '"Robots are the future. Humans? Meh." 🤖',
    ],
  },
  {
    id: 'mcdonalds',
    name: 'McDiabetes HQ',
    src: `${process.env.CDN_URL}/scenes/mcdonalds.jpg`,
    description: [
      'Where cold fries and broken ice cream machines meet. 🍟🍦',
      'The ultimate showdown between hangovers and regret. 🤢',
      'A love story in every greasy bite. 💖🍔',
    ],
  },
  {
    id: 'india',
    name: 'Spicy Street Food',
    src: `${process.env.CDN_URL}/scenes/india.jpg`,
    description: [
      "Every meal comes with a side of 'good luck'. 💪🔥",
      '"Thank you for calling tech support!" 💻',
      'Where chaos and spice is life. 🌶️✨',
    ],
  },
  {
    id: 'church',
    name: 'Holy Molly Temple',
    src: `${process.env.CDN_URL}/scenes/church.jpg`,
    description: [
      'Where sins are forgiven, but the guilt is forever. 🙏😔',
      'The only place where wine is blood, and bread is flesh. 🍷🍞',
      'The original cult, now with more gold and less honesty. ✨🕍',
    ],
  },
  {
    id: 'couch',
    name: 'The Couch',
    src: `${process.env.CDN_URL}/scenes/couch.jpg`,
    description: [
      'So comfy, it should win an Oscar. 🎬',
      'Where dreams are made... and dignity is often misplaced. 💔✨',
      'If this couch could talk, it would be age-restricted. 🔞',
    ],
  },
  {
    id: 'american',
    name: 'The American Dream',
    src: `${process.env.CDN_URL}/scenes/american.jpg`,
    description: [
      'Where everyone has a house except the ones living on the streets. 🚶',
      "It's the land of opportunity, unless you're stuck in this zip code. 💸",
      'Chasing the dream, but keeps running faster than you. 🇺🇸💤',
    ],
  },
  {
    id: 'korea',
    name: 'Best Korea™',
    src: `${process.env.CDN_URL}/scenes/korea.jpg`,
    description: [
      'Free tours! But you might not come back. 🎟️🚫',
      "The happiest place on earth—because it's mandatory. 😊🔫",
      'Nukes are big, but egos are bigger. 💣✈️',
    ],
  },
  {
    id: 'carnival',
    name: 'Clownpocalypse',
    src: `${process.env.CDN_URL}/scenes/carnival.jpg`,
    description: [
      'Where childhood dreams go to die. 🎡☠️',
      'Cotton candy? More like asbestos-flavored mystery fluff. 🍬😵',
      "Step right up! You might leave, but your sanity won't. 🤡👻",
    ],
  },
  {
    id: 'mars',
    name: "Memelon Musk's Dream",
    src: `${process.env.CDN_URL}/scenes/mars.jpg`,
    description: [
      "The place he'll move to when Earth cancels him. 🚀",
      '"Red planet, no unions." 🌌',
      "Population: 1 Tesla 'No Panic'. 🛸",
    ],
  },
  {
    id: 'powerplant',
    name: 'Atomic AF',
    src: `${process.env.CDN_URL}/scenes/powerplant.jpg`,
    description: [
      'Warning: high levels of radiation and sh*t.. 🔥☢️',
      'Blowing things up since... always. 💥🎇',
      'Mutants welcome! Bring your own hazmat suit. 👽🧪',
    ],
  },
  {
    id: 'cotton',
    name: 'Plantation Unchained',
    src: `${process.env.CDN_URL}/scenes/cotton.jpg`,
    description: [
      "Django doesn't just free the slaves, he frees the narrative. 💥",
      'Bounty hunting: where the real work gets done. 🔫💼',
      'More entrances than a western showdown. 🏇💨',
    ],
  },
  {
    id: 'egypt',
    name: 'Pyramid Scheme',
    src: `${process.env.CDN_URL}/scenes/egypt.jpg`,
    description: [
      'Where the ancient world meets the modern hustle. 🏛️💸',
      'Mummies, pharaohs, and the occasional tourist trap. 💀📸',
      'The only place where sand is worth more than gold. 🏜️💰',
    ],
  },
  {
    id: 'area51',
    name: 'Alien Hangout',
    src: `${process.env.CDN_URL}/scenes/area51.jpg`,
    description: [
      'Where secrets go to hide—and so do you. 👽🔒',
      "Aliens are real, but Wi-Fi isn't. 🛸📶",
      "Welcome to Nevada's worst-kept secret. 🤐🔭",
    ],
  },
  {
    id: 'florida',
    name: "Florida Man's Backyard",
    src: `${process.env.CDN_URL}/scenes/florida.jpg`,
    description: [
      'Caution: alligators and questionable life choices ahead. 🐊🍺',
      "Where the weather's hot, but the crimes are hotter. 🚓🔥",
      "Birthplace of legends, aka the Internet's wildest headlines. 🌴🤪",
    ],
  },
  {
    id: 'prison',
    name: 'Concrete Jungle Gym',
    src: `${process.env.CDN_URL}/scenes/prison.jpg`,
    description: [
      'The only place where the gym is mandatory. 🏋️‍♂️🔐',
      "Welcome to paradise—if you're into cement and bad tattoos. 💀🖋️",
      'Not much freedom, but plenty of drama. 🎭🚪',
    ],
  },
  {
    id: 'hell',
    name: 'Global Warming Is Real',
    src: `${process.env.CDN_URL}/scenes/hell.jpg`,
    description: [
      'Where the heat is high, and the hope is low. 🔥🥺',
      'The only place where the devil is the good guy. 😈👼',
      'Welcome to the eternal vacation you never asked for. 🌋🏖️',
    ],
  },
  {
    id: 'playground',
    name: 'Big Kids Playground',
    src: `${process.env.CDN_URL}/scenes/playground.jpg`,
    description: [
      'Where the rich play, and the innocent pay. 🏝️💔',
      'Secluded paradise turned into a stage for nightmares. 🌴⚖️',
      'Proof that the worst monsters wear suits, not masks. 👔💀',
    ],
  },
  {
    id: 'dubai',
    name: 'Desert Mall',
    src: `${process.env.CDN_URL}/scenes/dubai.jpg`,
    description: [
      'Where the 1% live, and the other 99% build their skyscrapers. 🏙️',
      'Gold-plated everything, except for human rights. ✨💰',
      'Why settle for a desert when you can turn it into a mall? 🏜️🛍️',
    ],
  },
].map((el: Scene, i, arr) => {
  el.points = pointsArray(arr.length)[i];
  return el;
});
