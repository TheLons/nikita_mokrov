import photo1 from '@/assets/singles_img/photo_1_2026-04-16_23-29-59.jpg';
import photo2 from '@/assets/singles_img/photo_2_2026-04-16_23-29-59.jpg';
import photo3 from '@/assets/singles_img/photo_3_2026-04-16_23-29-59.jpg';
import photo4 from '@/assets/singles_img/photo_4_2026-04-16_23-29-59.jpg';
import photo5 from '@/assets/singles_img/photo_5_2026-04-16_23-29-59.jpg';
import photo6 from '@/assets/singles_img/photo_6_2026-04-16_23-29-59.jpg';
import photo7 from '@/assets/singles_img/photo_7_2026-04-16_23-29-59.jpg';
import photo8 from '@/assets/singles_img/photo_8_2026-04-16_23-29-59.jpg';
import photo9 from '@/assets/singles_img/photo_9_2026-04-17_02-05-40.jpg';

export interface Track {
  number: string;
  title: string;
  year: string;
  audioUrl?: string;
}

export interface TrailerItem {
  id: string;
  title: string;
  year: string;
  videoId: string;
  thumbnail: string;
}

export interface WorkItem {
  id: string;
  number: string;
  name: string;
  subtitle?: string;
  coverImage: string;
  colorThumbnail?: boolean;
  dimThumbnail?: boolean;
  spotifyEmbedUrl?: string;
  tracks?: Track[];
  trailers?: TrailerItem[];
}

export interface WorkSection {
  id: string;
  sectionNumber: string;
  sectionTitle: string;
  items: WorkItem[];
}

export const worksSections: WorkSection[] = [
  {
    id: 'official-albums',
    sectionNumber: 'SECTION 1',
    sectionTitle: 'OFFICIAL ALBUMS',
    items: [
      {
        id: 'war-thunder-air',
        number: '01',
        name: 'WAR THUNDER: Air Forces, Vol. 2 (Original Game Soundtrack)',
        subtitle: 'Original Game Soundtrack',
        coverImage: 'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/bf3a9d0af6b25083cc52c31fc295d684.png',
        colorThumbnail: true,
        tracks: [
          { number: '01', title: 'First Contact', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345426/1._First_Contact_yairek.mp3' },
          { number: '02', title: 'Airstrike', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345420/2._Airstrike_wjo4uz.mp3' },
          { number: '03', title: 'Bandit at 6 O\'clock', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345425/3._Bandit_at_6_O_clock_gezbcp.mp3' },
          { number: '04', title: 'Interdiction', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345429/4._Interdiction_tcpg6t.mp3' },
          { number: '05', title: 'Through the Clouds', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345434/5._Through_the_Clouds_jvnl8g.mp3' },
          { number: '06', title: 'Fatherland', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776347741/6._Fatherland_ea2plv.mp3' },
          { number: '07', title: '40,000 Feet over the Prairies', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345431/6._40_000_Feet_over_the_Prairies_pb1xuc.mp3' },
          { number: '08', title: 'Juggernaut', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776347716/8._Juggernaut_s7mjgn.mp3' },
          { number: '09', title: 'Waltz of the Tornado', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345422/7._Waltz_of_the_Tornado_ctlaul.mp3' },
          { number: '10', title: 'Frontal Attack', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776347719/10._Frontal_Attack_o5s7et.mp3' },
        ],
      },
      {
        id: 'war-thunder-ground',
        number: '02',
        name: 'WAR THUNDER: Ground Forces, Vol. 2 (Original Game Soundtrack)',
        subtitle: 'Original Game Soundtrack',
        coverImage: 'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/01e8edf706e5e19eef5fbde2f5c186f1.png',
        colorThumbnail: true,
        tracks: [
          { number: '01', title: 'Incoming', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350413/1._Incoming_suadfj.mp3' },
          { number: '02', title: 'Persistence Hunting', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350422/2._Persistence_Hunting_ss2vgf.mp3' },
          { number: '03', title: "Nigelcore", year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350413/3._Nigelcore_tbbigc.mp3' },
          { number: '04', title: 'Steel Rain', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350421/4._Steel_Rain_x3qvqn.mp3' },
          { number: '05', title: 'New Power', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350422/5._New_Power_fkmnxe.mp3' },
          { number: '06', title: 'Scorched Earth', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350409/6._Scorched_Earth_fodyyh.mp3' },
          { number: '07', title: 'Fields of Heroes', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350421/7._Fields_of_Heroes_abbyug.mp3' },
          { number: '08', title: 'The Cas Is on the Way', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350407/6._The_Cas_Is_on_the_Way_ofrjzc.mp3' },
          { number: '09', title: 'Aftermath', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350417/8._Aftermath_dntvzb.mp3' },
          { number: '10', title: 'Victory Will Be Ours', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776350408/9._Victory_Will_Be_Ours_lopfcw.mp3' },
        ],
      },
      {
        id: 'war-thunder-mobile',
        number: '03',
        name: 'WAR THUNDER: Mobile, Vol. 1 (Original Game Soundtrack)',
        subtitle: 'Original Game Soundtrack',
        coverImage: 'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/53aef23e6174a80823ad2ff57c419606.png',
        colorThumbnail: true,
        tracks: [
          { number: '01', title: 'Allies', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345384/01_Allies_u5unip.mp3' },
          { number: '02', title: 'No Man\'s Sea', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345372/01_No_Man_s_Sea_cnvbwt.mp3' },
          { number: '03', title: 'Danger of the Depths', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345373/02_Danger_of_the_Depths_jcmlhc.mp3' },
          { number: '04', title: 'Protecting the Coast', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345373/02_Protecting_the_Coast_dodnv7.mp3' },
          { number: '05', title: 'Entering Safe Waters', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345373/03_Entering_Safe_Waters_jznwni.mp3' },
          { number: '06', title: 'Reinforcements From The Sea', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345376/05_Reinforcements_From_The_Sea_ijnmny.mp3' },
          { number: '07', title: 'The Morning of a New Day', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776345371/06_The_Morning_of_a_New_Day_gqps40.mp3' },
        ],
      },
      {
        id: 'active-matter',
        number: '04',
        name: 'ACTIVE MATTER',
        subtitle: 'Music & Sound Design',
        coverImage: 'https://static.readdy.ai/image/24b4ee0c289d88df18f1c78f5afa17f2/50a190391932e7995b39dcc4575c20e2.png',
        colorThumbnail: true,
        tracks: [
          { number: '01', title: 'Active Matter: Main Menu Theme (Pt. I)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346541/Loop_1_dhyvgb.mp3' },
          { number: '02', title: 'Active Matter: Main Menu Theme (Pt. II)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346541/Loop_2_kbisjn.mp3' },
          { number: '03', title: 'Active Matter: Main Menu Theme (Pt. III)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346547/Loop_3_obdnug.mp3' },
          { number: '04', title: 'Active Matter: Main Menu Theme (Pt. IV)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346542/Loop_4_vcxxvf.mp3' },
          { number: '05', title: 'Active Matter: Location Theme — Exploration', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346544/Location_1_beot48.mp3' },
          { number: '06', title: 'Active Matter: Location Theme — Tension', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346544/Location_2_gaarpm.mp3' },
          { number: '06', title: 'Active Matter: Location Theme — Combat', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776346541/Location_3_gsmkhq.mp3' },
        ],
      },
    ],
  },
  {
    id: 'seasonal-events',
    sectionNumber: 'SECTION 2',
    sectionTitle: 'SEASONAL & SPECIAL EVENTS',
    items: [
      {
        id: 'new-year-2025',
        number: '01',
        name: 'New Year 2025 (From War Thunder Original Game Soundtrack)',
        subtitle: 'Seasonal Event Score',
        coverImage: photo1,
        tracks: [
          { number: '01', title: 'New Year 2025 (From War Thunder Original Game Soundtrack)', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356348/New_Year_2025_From_War_Thunder_Original_Game_Soundtrack_flbssx.mp3' },
        ],
      },
      {
        id: 'april-fools-pirate',
        number: '02',
        name: "Treasure Hunt (From War Thunder Original Game Soundtrack)",
        subtitle: 'Seasonal Event Score',
        coverImage: photo2,
        tracks: [
          { number: '01', title: 'Treasure Hunt (From War Thunder Original Game Soundtrack)', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356353/Treasure_Hunt_From_War_Thunder_Original_Game_Soundtrack_dx9lxz.mp3' },
        ],
      },
      {
        id: 'st-patricks',
        number: '03',
        name: "Crackers and Confetti (From War Thunder Original Game Soundtrack)",
        subtitle: 'Seasonal Event Score',
        coverImage: photo3,
        tracks: [
          { number: '01', title: 'Crackers and Confetti (From War Thunder Original Game Soundtrack)', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356348/Crackers_and_Confetti_From_War_Thunder_Original_Game_Soundt_butgza.mp3' },
        ],
      },
      {
        id: 'chinese-new-year',
        number: '04',
        name: 'Tail Spin (From War Thunder Original Game Soundtrack)',
        subtitle: 'Seasonal Event Score',
        coverImage: photo4,
        tracks: [
          { number: '01', title: 'Tail Spin (From War Thunder Original Game Soundtrack)', year: '2024', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356340/Tail_Spin_From_War_Thunder_Original_Game_Soundtrack_odcriy.mp3' },
        ],
      },
      {
        id: 'enlisted-moon',
        number: '05',
        name: 'Snowy Tail (From War Thunder Original Game Soundtrack)',
        subtitle: 'Special Event Score',
        coverImage: photo5,
        tracks: [
          { number: '01', title: 'Snowy Tail (From War Thunder Original Game Soundtrack)', year: '2023', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356354/Snowy_Tail_From_War_Thunder_Original_Game_Soundtrack_qcn5cq.mp3' },
        ],
      },
      {
        id: 'new-year-2023',
        number: '06',
        name: 'Battle For The Moon (From Enlisted Original Game Soundtrack)',
        subtitle: 'Seasonal Event Score',
        coverImage: photo6,
        tracks: [
          { number: '01', title: 'Battle For The Moon (From Enlisted Original Game Soundtrack)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356351/Battle_For_The_Moon_From_Enlisted_Original_Game_Soundtrack_xjbrzr.mp3' },
        ],
      },
      {
        id: 'tail-spin',
        number: '07',
        name: 'Lunar New Year (From War Thunder Original Game Soundtrack)',
        subtitle: 'Special Event Score',
        coverImage: photo7,
        tracks: [
          { number: '01', title: 'Lunar New Year (From War Thunder Original Game Soundtrack)', year: '2022', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356358/Lunar_New_Year_From_War_Thunder_Original_Game_Soundtrack_vdpkjg.mp3' },
        ],
      },
      {
        id: 'new-year-2022',
        number: '08',
        name: 'St Patrick\'s Day (From War Thunder Original Game Soundtrack)',
        subtitle: 'Seasonal Event Score',
        coverImage: photo8,
        tracks: [
          { number: '01', title: 'St Patrick\'s Day (From War Thunder Original Game Soundtrack)', year: '2021', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776356344/St_Patrick_s_Day_From_War_Thunder_Original_Game_Soundtrack_pusoyh.mp3' },
        ],
      },
      {
        id: 'anniversary',
        number: '09',
        name: 'Anniversary (From War Thunder Original Game Soundtrack)',
        subtitle: 'Seasonal Event Score',
        coverImage: photo9,
        tracks: [
          { number: '01', title: 'Anniversary (From War Thunder Original Game Soundtrack)', year: '2021', audioUrl: 'https://res.cloudinary.com/djeosuwjn/video/upload/v1776360363/Anniversary_From_War_Thunder_Original_Game_Soundtrack_bvhssi.mp3' },
        ],
      },
    ],
  },
  {
    id: 'cinematic-trailers',
    sectionNumber: 'SECTION 3',
    sectionTitle: 'CINEMATIC TRAILERS',
    items: [
      {
        id: 'trailers',
        number: '01',
        name: 'Cinematic Trailer Reel',
        subtitle: 'Video Showcase',
        coverImage: 'https://readdy.ai/api/search-image?query=cinematic%20trailer%20music%20composer%20reel%20album%20cover%20art%2C%20dark%20dramatic%20film%20strip%20with%20explosive%20cinematic%20visuals%2C%20monochromatic%20dark%20tones%2C%20premium%20square%20album%20artwork%2C%20epic%2C%20deep%20black%20background&width=400&height=400&seq=trailers-reel-01&orientation=squarish',
        trailers: [
          {
            id: 'tr-01',
            title: '"Wish me luck" — "Drone Age" update teaser / War Thunder',
            year: '2023',
            videoId: 'tg33uA1Jj7c',
            thumbnail: 'https://img.youtube.com/vi/tg33uA1Jj7c/maxresdefault.jpg',
          },
          {
            id: 'tr-02',
            title: '"Battle of Tunisia" Close Beta Trailer / Enlisted',
            year: '2023',
            videoId: 'CPkF5NQbN3g',
            thumbnail: 'https://img.youtube.com/vi/CPkF5NQbN3g/maxresdefault.jpg',
          },
          {
            id: 'tr-03',
            title: 'TailSpin / War Thunder',
            year: '2022',
            videoId: 'Hue4KqeOhlE',
            thumbnail: 'https://img.youtube.com/vi/Hue4KqeOhlE/maxresdefault.jpg',
          },
          {
            id: 'tr-04',
            title: 'Moments of Valor: 中国 (China) / War Thunder',
            year: '2023',
            videoId: 'ZYspPUsLIE8',
            thumbnail: 'https://img.youtube.com/vi/ZYspPUsLIE8/maxresdefault.jpg',
          },
        ],
      },
    ],
  },
];
