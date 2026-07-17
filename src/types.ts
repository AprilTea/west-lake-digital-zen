export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter' | 'tech';

export interface PoeticContent {
  id: SeasonType;
  name: string;
  englishName: string;
  title: string;
  poem: string[];
  translation: string;
  description: string;
  bgImage: string;
  accentColor: string; // Classical color code (hex)
  techColor: string; // Glowing neon/tech color code (hex)
  particlesColor: string;
  particleType: 'petal' | 'leaf' | 'osmanthus' | 'snow' | 'digital';
  spots: ScenicSpot[];
}

export interface ScenicSpot {
  name: string;
  description: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map placement
  poeticVerse: string;
  techAspect?: string; // How this spot fuses with tech today
}

export interface InkRipple {
  id: number;
  x: number;
  y: number;
  size: number;
  maxSize: number;
  opacity: number;
  color: string;
  type: 'ink' | 'circuit';
}

export const HANGZHOU_SEASONS_DATA: PoeticContent[] = [
  {
    id: 'spring',
    name: '春日 · 柳翠桃红',
    englishName: 'Spring · Verdant Willows',
    title: '苏堤春晓与烟雨柳浪',
    poem: [
      '苏堤春晓万丝柳',
      '画船轻泛碧波流',
      '六桥烟水含春意',
      '数点桃花映翠楼'
    ],
    translation: 'The Su Causeway is draped with ten thousand willow strands; painted boats float lightly on the blue-green waves. The misty waters around the six bridges carry the breath of spring, while peach blossoms reflect off the jade-like pavilions.',
    description: '杭州之春，展现了桃花盛开、柳树发芽的融融春意景象。在水墨画卷中，烟雨如酥，嫩绿初绽。当古典美学融合现代数字科技，智能古树监测网络与生态微传感器悄然协同，细致呵护着两岸桃红柳绿，交织出一幅新旧相宜、灵动自然的数字化江南春景图。',
    bgImage: 'rgba(216, 243, 229, 0.12)',
    accentColor: '#10B981', // Emerald green
    techColor: '#34D399', // Cyan/Emerald
    particlesColor: '#FCA5A5', // Peach petal pink
    particleType: 'petal',
    spots: [
      {
        name: '苏堤春晓 (Su Causeway)',
        description: '跨越西湖的苏堤，春日里桃花盛开，绿柳发芽，柳丝拂水，风光旖旎。',
        coordinates: { x: 38, y: 48 },
        poeticVerse: '夹岸桃花蘸水开，千丝万絮织晴埃。',
        techAspect: '沿堤布设隐蔽式智能微气象站，与古树物联网监测标签联动，实时感知并调整土壤湿度，让千岁古树重焕新生。'
      },
      {
        name: '柳浪闻莺 (Listening to Orioles)',
        description: '临湖柳树吐露嫩芽，春风拂过，黄莺在苍翠柳荫间欢快啼鸣，尽显春日生机。',
        coordinates: { x: 62, y: 65 },
        poeticVerse: '百啭黄鹂语春风，翠条拂水绿蒙蒙。',
        techAspect: '部署基于AI音频识别的鸟类生态监测网，动态记录黄莺等百余种鸟类啼鸣，打造数字西湖的“自然原声带”。'
      }
    ]
  },
  {
    id: 'summer',
    name: '夏日 · 风荷接天',
    englishName: 'Summer · Lotus Breeze',
    title: '曲院风荷与微雨涟漪',
    poem: [
      '曲院风荷十里香',
      '翠盘承露映斜阳',
      '晚风忽送清凉意',
      '接天莲叶映日红'
    ],
    translation: 'At the Quyuan Garden, the fragrance of lotus flowers extends for miles; their emerald basins hold droplets reflecting the setting sun. A sudden evening breeze delivers a refreshing coolness, as lotus leaves touching the sky shine red under the sun.',
    description: '盛夏西湖，呈现荷花满池、绿树成荫的壮丽画面。曲院风荷，翠绿无边，熏风送香。而在这幅浓墨重彩的夏景背后，5G智能水下清淤机器人、5G无人清洁船等科技正默默守护着湖水的清澈，将千年前“接天莲叶无穷碧”的意境完美映射在数字孪生空间。',
    bgImage: 'rgba(253, 242, 248, 0.15)',
    accentColor: '#EC4899', // Pink
    techColor: '#F472B6', // Cyber lotus pink
    particlesColor: '#FBCFE8', // Light lotus pink
    particleType: 'leaf',
    spots: [
      {
        name: '曲院风荷 (Lotus Garden)',
        description: '夏日荷花满池怒放，绿树成荫，粉荷翠叶交织，清香阵阵拂面而来。',
        coordinates: { x: 25, y: 35 },
        poeticVerse: '接天莲叶无穷碧，映日荷花别样红。',
        techAspect: '荷塘下部署高精度多参数传感器阵列，自动分析溶解氧及COD水质，指导5G智能无人保洁船定时自动完成水草收割与落叶清理。'
      },
      {
        name: '平湖秋月 (Summer Night View)',
        description: '夏秋之交的晴朗夜空下，水波不兴，明月高悬，西湖水天一色，静谧绝美。',
        coordinates: { x: 55, y: 35 },
        poeticVerse: '万顷湖平长似镜，四时月好最宜秋。',
        techAspect: '平台周边设置超高感光微孔空气质量及气象传感器，与岸边全息微型光伏自发电激光投影联动，将实时气象流数据渲染成动态诗画。'
      }
    ]
  },
  {
    id: 'autumn',
    name: '秋日 · 金桂明月',
    englishName: 'Autumn · Golden Moon',
    title: '三潭印月与平湖秋月',
    poem: [
      '三潭印月秋水深',
      '桂花十里落金金',
      '平湖一镜分明夜',
      '西湖月色动人心'
    ],
    translation: 'The water at Three Pagodas runs deep in autumn; golden osmanthus blossoms fall over ten miles. Under the mirror-like night of the flat lake, the moonlit West Lake stirs the hearts of all.',
    description: '深秋西湖，金桂飘香，满陇桂雨。三潭印月与平湖秋月，呈现出水天一色、月色撩人的空灵美。在这幅古典画卷之下，湖心岛激光毫米波雷达定位网和智能声光感知系统正全天候默默感知着水体和空气的微小变动，让科技赋能传统人文风雅。',
    bgImage: 'rgba(254, 243, 199, 0.15)',
    accentColor: '#F59E0B', // Amber/Gold
    techColor: '#FBBF24', // Tech Gold
    particlesColor: '#FDE68A', // Golden osmanthus
    particleType: 'osmanthus',
    spots: [
      {
        name: '三潭印月 (Three Pagodas)',
        description: '中秋之夜在塔中点灯，秋水澄明，塔影月影交相辉映，桂香溢满湖面。',
        coordinates: { x: 50, y: 70 },
        poeticVerse: '月光映入潭心内，塔影分明波面浮。',
        techAspect: '湖心岛布置激光毫米波雷达定位网，全天候感知游客动态与湖水深度，将数字模型融入物理世界，形成超现实数字孪生景象。'
      },
      {
        name: '雷峰夕照 (Leifeng Pagoda)',
        description: '暮秋夕阳西下，雷峰塔下红枫似火，塔影流金，钟声悠扬。',
        coordinates: { x: 45, y: 85 },
        poeticVerse: '落日衔山红影动，雷峰塔下晚钟鸣。',
        techAspect: '通过雷峰塔内的智能AR眼镜，游客可以沉浸式体验裸眼3D的历史传说，重现雷峰夕照与西湖千年神话变迁。'
      }
    ]
  },
  {
    id: 'winter',
    name: '冬日 · 断桥红梅',
    englishName: 'Winter · Lingering Snow',
    title: '断桥残雪与孤山探梅',
    poem: [
      '断桥残雪画中看',
      '孤山雪晴倚画栏',
      '梅花香透春消息',
      '一抹微阳照玉寒'
    ],
    translation: 'The lingering snow on the Broken Bridge looks like a painting; as the snow clears over Solitary Hill, one leans against the painted railing. Plum blossom fragrance carries the first whispers of spring, while a beam of gentle sunshine warms the icy jade.',
    description: '严冬西湖，呈现出断桥残雪、银装素裹的宁静美。大雪初晴，断桥银装素裹，红梅傲雪盛开，宛如江南水墨的经典留白。在这冷艳与宁静之间，自适应温控微管路技术和光谱成像分析科技，静默地守护着这一份古典的绝色与安全。',
    bgImage: 'rgba(241, 245, 249, 0.18)',
    accentColor: '#3B82F6', // Blue
    techColor: '#60A5FA', // Sky Blue Tech
    particlesColor: '#FFFFFF', // Snow
    particleType: 'snow',
    spots: [
      {
        name: '断桥残雪 (Broken Bridge)',
        description: '冬雪压桥，初晴之时，朝阳面雪融，阴面银装素裹，桥影斑驳如断。',
        coordinates: { x: 75, y: 28 },
        poeticVerse: '断桥桥断雪未消，微风弄晴雪作飘。',
        techAspect: '桥面采用自适应融雪技术，使用无机感温层，既保留了“雪落留白”的绝美景观，又确保了人行安全。'
      },
      {
        name: '孤山寻梅 (Solitary Hill)',
        description: '银装素裹的孤山之上，红梅踏雪迎风怒放，暗香浮动，沁人心脾。',
        coordinates: { x: 45, y: 25 },
        poeticVerse: '疏影横斜水清浅，暗香浮动月黄昏。',
        techAspect: '通过低能耗NB-IoT传感器和高光谱成像仪，收集土壤酸碱、根系含水等指标，科学保育这一抹千年墨梅。'
      }
    ]
  },
  {
    id: 'tech',
    name: '数智 · 钱江潮涌',
    englishName: 'Tech · Qiantang Tide',
    title: '数智地标与钱江潮涌',
    poem: [
      '钱塘一望大潮生',
      '数智地标倚长空',
      '日月同辉生异彩',
      '弄潮科技驭长风'
    ],
    translation: 'Looking out over Qiantang, the great tide rises; intelligent landmarks lean against the high sky. The sun and moon shine together, casting extraordinary colors, as technology riders harness the great wind.',
    description: '从西湖的古典水墨，到钱塘江畔的数字未来巨轮，杭州完美实现了科技与历史的伟大交融。四大数智地标建筑拔地而起，以先锋之姿交织未来灯光与生态能效，在潮起钱塘的历史长河中，点亮城市的科技脉搏。',
    bgImage: 'rgba(224, 242, 254, 0.15)',
    accentColor: '#06B6D4', // Cyan
    techColor: '#22D3EE', // Light Cyan Tech
    particlesColor: '#22D3EE', // Cyber cyan spark
    particleType: 'digital',
    spots: [
      {
        name: '杭州国际会议中心',
        description: '钱塘江畔熠熠生辉的金色巨型球体，与大剧院交相辉映，代表“日月同辉”中的太阳。',
        coordinates: { x: 78, y: 76 },
        poeticVerse: '数智金星，映照未来视界 —— 科技脉搏，点亮城市未来',
        techAspect: '金色球体曲面集成了智能太阳能光伏微晶玻璃，将日光自动转化为整座会议中心的夜间多维全息灯光秀电能，点亮城市低碳未来。'
      },
      {
        name: '杭州大剧院',
        description: '银色金属与双曲面玻璃幕墙交织而成的精美弯月造型，静卧于市民中心前，代表“日月同辉”中的月亮。',
        coordinates: { x: 81, y: 79 },
        poeticVerse: '银色月轮，奏响城市交响 —— 琴声悠扬，汇聚时代潮音',
        techAspect: '钛合金屋顶配置声学数字映射系统，可采集钱塘潮涌声波，并由AI重构为大型室外数字音乐喷泉的水舞交响曲。'
      },
      {
        name: 'G20峰会主会场',
        description: '气势恢宏的古典江南重楼飞檐与现代流线型网架结合，连接世界，是大国多边外交的璀璨地标。',
        coordinates: { x: 84, y: 83 },
        poeticVerse: '开放之门，纵览全球峰会 —— 智连世界，激荡国际浪潮',
        techAspect: '部署城市大脑万物智联中枢，实时多语种翻译云端中转，毫秒级温湿度及空气自适应净化调节，尽显大国数智外交之风范。'
      },
      {
        name: '杭州奥体中心「大莲花」',
        description: '钱塘江畔盛开的巨型莲花，由28片大花瓣和27片小花瓣精妙交织，是亚运科技与生态的璀璨结晶。',
        coordinates: { x: 87, y: 88 },
        poeticVerse: '生态莲花，绽放绿色能效 —— 零碳律动，铸就亚运传奇',
        techAspect: '采用世界领先 of 数字化钢结构扭转拼接算法建成，搭载全场景低碳自运行物联网络与毫米级绿能调度大屏，打造全球首屈一指的零碳体育盛殿。'
      }
    ]
  }
];

export const POETIC_ORACLES = [
  {
    title: '湖上风来 · 气象自新',
    content: '今日运势如春日苏堤，杨柳依依，生机勃发。适合开启新计划，犹如春风拂面，智能之风助你事半功倍，扫除心中一切阴霾。',
    spot: '苏堤春晓',
    advice: '宜：创新、拓展、漫步湖畔 忌：墨守成规、自我封闭'
  },
  {
    title: '风荷摇曳 · 灵感汇聚',
    content: '今日思维敏捷，如夏日曲院风荷，清波连漪。多倾听他人想法，在思想的交流中将碰撞出数字灵感，创意如同夏花般灿烂。',
    spot: '曲院风荷',
    advice: '宜：团队协作、创意头脑风暴 忌：急躁冒进、一意孤行'
  },
  {
    title: '三潭映月 · 虚实相生',
    content: '今天宜沉思、自省。水月交辉，真假相映。在古典积淀中融入现代洞察，透过表象看清事物本质，必能指引你找到正确的前进方向。',
    spot: '三潭印月',
    advice: '宜：复盘反思、深度冥想思考 忌：过度张扬、轻信盲从'
  },
  {
    title: '断桥瑞雪 · 蓄势待发',
    content: '红梅傲雪，暗香浮动。当前正是默默蓄积力量的时期，不必急于求成，打好坚实基础，静待属于你的春风拂来。',
    spot: '断桥残雪',
    advice: '宜：修身养性、查漏补缺系统 忌：盲目跟风、急功近利'
  },
  {
    title: '南屏晚钟 · 余音绕梁',
    content: '钟声悠扬，荡涤心灵。今日可能会收到远方的消息或故人的问候，保持内心的宁静与祥和，从容应对一切变故。',
    spot: '南屏晚钟',
    advice: '宜：联络故友、倾听内心声音 忌：喧嚣浮躁、卷入争端'
  },
  {
    title: '雷峰夕照 · 辉煌再现',
    content: '夕阳流金，塔影生辉。过去付出的努力将在今日看到回报，抓住转瞬即逝的机遇，你的光芒将被世人所见。',
    spot: '雷峰夕照',
    advice: '宜：展示成果、把握关键机遇 忌：妄自菲薄、错失良机'
  },
  {
    title: '花港观鱼 · 顺水推舟',
    content: '群鱼戏水，自由自在。今日运势如鱼得水，顺势而为方能轻松如意。不要与环境抗争，学会在波澜中寻找平衡。',
    spot: '花港观鱼',
    advice: '宜：顺其自然、享受轻松时刻 忌：钻牛角尖、逆流而动'
  },
  {
    title: '柳浪闻莺 · 喜报频传',
    content: '黄莺婉转，春意盎然。今日沟通顺畅，可能会有令人愉悦的好消息传来。用温柔的言辞表达自己，能化解许多误会。',
    spot: '柳浪闻莺',
    advice: '宜：发表演讲、友好沟通交流 忌：恶语相向、封闭自我'
  },
  {
    title: '双峰插云 · 志存高远',
    content: '南北双峰，直插云霄。今日宜立下宏大目标，放眼长远。即使前路云雾缭绕，只要坚定信念，必能登临绝顶。',
    spot: '双峰插云',
    advice: '宜：制定规划、挑战更高目标 忌：目光短浅、半途而废'
  },
  {
    title: '平湖秋月 · 澄明圆满',
    content: '秋水长天，皓月当空。今日心境澄明，一切困惑都将烟消云散。适合做一些圆满的收尾工作，享受内心的平静。',
    spot: '平湖秋月',
    advice: '宜：圆满收尾、享受宁静夜晚 忌：制造事端、杞人忧天'
  },
  {
    title: '弄潮钱塘 · 智领未来',
    content: '大潮奔涌，勇立潮头。你有极大的创造力和破局之势，不要畏惧未知的风险，拥抱科技与变革，尽情施展才华吧。',
    spot: '钱江新城',
    advice: '宜：发布新品、挑战技术难关 忌：畏缩不前、因循守旧'
  }
];
