import { addPointsAndMultiplier, Cosmetic } from '../utils/generic';

export interface Avatar {
  id: string;
  name: string;
  avatarUrl: string;
  src: string;
  description: string[];
  points: number;
  multiplier: number;
}

export const rawAvatars: Avatar[] = [
  {
    id: 'avatar/memelon-musk',
    name: 'Memelon Musk',
    avatarUrl: `${process.env.CDN_URL}/avatars/elon.glb`,
    src: `${process.env.CDN_URL}/profiles/elon.png`,
    description: [
      'Rocket scientist by day, meme lord by night. 🚀',
      'Inventor of Space Karen™ and Dogecoin dreams. 🐕',
      'Sends Teslas to space while dodging Twitter lawsuits.',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/will-smack',
    name: 'Will Smack',
    avatarUrl: `${process.env.CDN_URL}/avatars/will.glb`,
    src: `${process.env.CDN_URL}/profiles/will.png`,
    description: [
      'Will literally slap for love. 💥',
      'Oscars? No. OnlySlaps? Yes. 🎭',
      'Fresh prince of losing dignity. 👑💔',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/shamber-turd',
    name: 'Shamber Turd',
    avatarUrl: `${process.env.CDN_URL}/avatars/amber.glb`,
    src: `${process.env.CDN_URL}/profiles/amber.png`,
    description: [
      "Left more than just an impression on Johnny's bed. 💩",
      'Oscar-winning performance (in her own mind). 🎭',
      "Made Aquaman's biggest villain… her acting. 🌊🚽",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/kanye-mess',
    name: 'Kanye Mess',
    avatarUrl: `${process.env.CDN_URL}/avatars/kanye.glb`,
    src: `${process.env.CDN_URL}/profiles/kanye.png`,
    description: [
      'Yeezus walks… straight into controversy. 👟🔥',
      'Drops more hot takes than hit albums. 🎤💀',
      "'I am a genius' - Kanye, after every bad decision. 🧠❌",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/jeff-bozos',
    name: 'Jeff Baldzos',
    avatarUrl: `${process.env.CDN_URL}/avatars/jeff.glb`,
    src: `${process.env.CDN_URL}/profiles/jeff.png`,
    description: [
      'Laughed so hard he lost his hair. 😂🦲',
      'Fires employees faster than Prime shipping. 🚚🔥',
      'Rocketed to space just to flex on us. 🚀💰',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/chillary-defeaton',
    name: 'Chillary Defeaton',
    avatarUrl: `${process.env.CDN_URL}/avatars/hillary.glb`,
    src: `${process.env.CDN_URL}/profiles/hillary.png`,
    description: [
      "Emails? Never heard of 'em. 📧🕵️‍♀️",
      'Lost to Trump and still buffering... 🔄💀',
      'More scandals than a Netflix docuseries. 🎬🔥',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/joe-forgetful',
    name: 'Forgetful Joe',
    avatarUrl: `${process.env.CDN_URL}/avatars/biden.glb`,
    src: `${process.env.CDN_URL}/profiles/biden.png`,
    description: [
      'Forgets names, places, and why he walked into a room. 🧠💤',
      "America's grandpa—just without the good stories. 👴📖",
      "Reads the teleprompter like it's his first language. 📜🤔",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/skim-kardashian',
    name: 'Skim Kardashian',
    avatarUrl: `${process.env.CDN_URL}/avatars/kim.glb`,
    src: `${process.env.CDN_URL}/profiles/kim.png`,
    description: [
      "Went from 'leaked tape' to 'legal tape'—now a lawyer. 📜⚖️",
      'Married Kanye, divorced Kanye, married the algorithm. 🤳💔',
      "Breaks the internet, but can't break a personality. 📸🥱",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/taylor-overrated',
    name: 'Taylor Overrated',
    avatarUrl: `${process.env.CDN_URL}/avatars/taylorswift.glb`,
    src: `${process.env.CDN_URL}/profiles/taylorswift.png`,
    description: [
      'Writes break-up songs faster than she finds new boyfriends. 💔🎶',
      'Switched from country to pop to billion-dollar stadium tours. 🤑🎤',
      'Her exes fear her more than tax season. 📜🔥',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/mark-zuckerbot',
    name: 'Mark Zuckerbot',
    avatarUrl: `${process.env.CDN_URL}/avatars/mark.glb`,
    src: `${process.env.CDN_URL}/profiles/mark.png`,
    description: [
      'CEO of your personal data (knows what you ate for breakfast). 📱',
      'Not a lizard, just a very, very awkward human. 🦎🤖',
      'Made the Metaverse but wait, who asked for it? 🎮',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/joke-paul',
    name: 'Joke Paul',
    avatarUrl: `${process.env.CDN_URL}/avatars/jake.glb`,
    src: `${process.env.CDN_URL}/profiles/jake.png`,
    description: [
      'Knocks out grandpas for fun. 🥊😬',
      "Can dodge punches but can't dodge controversy. 🥊🚧",
      'Pranking reality, one viral fail at a time. 📹🤡',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/queen-lizardbeth',
    name: 'Queen Lizardbeth',
    avatarUrl: `${process.env.CDN_URL}/avatars/queen.glb`,
    src: `${process.env.CDN_URL}/profiles/queen.png`,
    description: [
      'Ruled longer than an average grandma lives. 👑💀',
      'Never worked a day but owns half the world. 🌍💰',
      'Immortal? Nah, just really, REALLY good at surviving. 🦎⚰️',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/greta-mchowdareyou',
    name: 'Greta McHowDareYou',
    avatarUrl: `${process.env.CDN_URL}/avatars/greta.glb`,
    src: `${process.env.CDN_URL}/profiles/greta.png`,
    description: [
      'Skips school but lectures the world. 🎓❌',
      'Screaming at world leaders while flying private jets. 🌍✈️',
      'How dare YOU not recycle my memes?! ♻️😡',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/cardi-beef',
    name: 'Cardi Beef',
    avatarUrl: `${process.env.CDN_URL}/avatars/cardib.glb`,
    src: `${process.env.CDN_URL}/profiles/cardib.png`,
    description: [
      'Turns stages into wrestling rings. 👟💥',
      'Claws: her diplomatic passport. 💅🔥',
      'Vocabulistics professor emeritus. 🗣️🤯',
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/top-sparkle',
    name: 'Top Sparkle',
    avatarUrl: `${process.env.CDN_URL}/avatars/topg.glb`,
    src: `${process.env.CDN_URL}/profiles/topg.png`,
    description: [
      'Sparkling water so elite, regular water is for regular people. 💦👑',
      "Bugatti dealers ask: 'What color is YOUR customer?' 🚗😂",
      "1,000 pushups? His warmup's warmup. 💪🌍",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/boom-laden',
    name: 'Boom Laden',
    avatarUrl: `${process.env.CDN_URL}/avatars/osama.glb`,
    src: `${process.env.CDN_URL}/profiles/osama.png`,
    description: [
      'His personality is a 9/11. 🏢',
      'Loves to play hide and seek with the US military. 🏃',
      "Took 'OK Boomer' to a whole new level. 💣",
    ],
    points: 0,
    multiplier: 0,
  },
  {
    id: 'avatar/donald-duck',
    name: 'Donald Duck',
    avatarUrl: `${process.env.CDN_URL}/avatars/donald.glb`,
    src: `${process.env.CDN_URL}/profiles/donald.png`,
    description: [
      'Hair might be fake, but the tweets are always real. 🍊💬',
      'Presidential fact-checking as a full-time job. 💼',
      "Grabs headlines faster than he grabs 'em by the... well, you know. 🐈📰",
    ],
    points: 0,
    multiplier: 0,
  },
];

export const getAvatars = async (): Promise<Cosmetic[]> =>
  await addPointsAndMultiplier(rawAvatars);
