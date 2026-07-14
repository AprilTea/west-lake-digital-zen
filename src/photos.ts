export type WeatherType = 'sunny' | 'rainy' | 'misty' | 'night';

export interface PhotoDetails {
  url: string;
  caption: string;
  photographer: string;
  cameraSettings: string;
  poeticNote: string;
}

export const SPOT_PHOTOS_DATA: Record<string, Record<WeatherType, PhotoDetails>> = {
  // 1. 苏堤春晓 (Su Causeway)
  '苏堤春晓 (Su Causeway)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1000&q=80',
      caption: '春日暖阳下的苏堤，两岸垂柳依依，新桃吐红，碧水倒映着远山。',
      photographer: 'Chen Zhi (West Lake Eco-Observer)',
      cameraSettings: 'Sony α7R V • 35mm F1.4 G Master • ISO 100 • 1/320s • f/5.6',
      poeticNote: '春光融融，波光潋滟。两岸红绿相间，春柳随风亲吻湖面，展现出苏东坡笔下春风十里的温暖。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1000&q=80',
      caption: '微雨中的苏堤，烟柳如丝，小舟在迷蒙的水面上划出层层墨痕。',
      photographer: 'Guo Feng (Calligraphy & Lens Art)',
      cameraSettings: 'Fujifilm GFX 100S • 45-100mm • ISO 400 • 1/125s • f/4.0',
      poeticNote: '烟雨濛濛，绿柳如酥。细密的春雨将苏堤笼罩在薄纱之中，仿佛宣纸上晕染开的青绿山水。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1000&q=80',
      caption: '清晨薄雾中的苏堤六桥，白雾在树梢与桥洞间缓缓流动，幽静怡人。',
      photographer: 'Lin Xi (Zen Lens Photographer)',
      cameraSettings: 'Leica SL2 • Vario-Elmarit 24-90mm • ISO 200 • 1/80s • f/8.0',
      poeticNote: '宿雾未开，晨光初照。薄雾锁住六桥垂柳，水鸟轻啼，是苏堤一天中最为空灵神秘的瞬间。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
      caption: '夜色朦胧，苏堤两侧的柔光步道灯次第亮起，将长堤剪影投射在静谧的西湖中。',
      photographer: 'Zheng Xuan (Urban Nightscape Master)',
      cameraSettings: 'Nikon Z9 • 24-70mm f/2.8 S • ISO 1600 • 1.5s • f/4.5',
      poeticNote: '明月高悬，华灯映水。夜间的苏堤少了白日的喧嚣，微风拂过湖面，送来远方古塔微弱的光影。'
    }
  },

  // 2. 柳浪闻莺 (Listening to Orioles)
  '柳浪闻莺 (Listening to Orioles)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
      caption: '阳光穿透茂密的柳树林，金光斑驳地洒在翠绿的草坪与湖畔步道上。',
      photographer: 'Wang Jie (Light & Shadow Artist)',
      cameraSettings: 'Canon EOS R5 • RF24-70mm F2.8 L • ISO 100 • 1/200s • f/2.8',
      poeticNote: '万条垂下绿丝绦，艳阳下的柳浪充满勃勃生机，雀鸟鸣啼，清风微拂。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=1000&q=80',
      caption: '春雨敲打着柳叶，黄莺在被雨水洗刷得格外翠绿的柳枝间跳跃歌唱。',
      photographer: 'Jiang Yu (Wild Bird Observer)',
      cameraSettings: 'Nikon Z8 • Nikkor 400mm f/4.5 • ISO 800 • 1/500s • f/4.5',
      poeticNote: '细雨斜风，万丝拂水。雨中的柳浪听起来更加宁静，黄莺的歌声与密集的雨声交织，宛如天籁。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1000&q=80',
      caption: '晨雾笼罩下的临湖柳林，依稀可见远方的保俶塔剪影在云雾中若隐若现。',
      photographer: 'He Shanshan (Jiangnan Culture Recorder)',
      cameraSettings: 'Hasselblad X2D • XCD 38mm F2.5 • ISO 64 • 1/60s • f/5.6',
      poeticNote: '雾绕绿洲，隐逸江南。晨雾将临湖 the giant willow grove 隔绝于尘世之外，清冷中透着古典风雅。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      caption: '夜间的柳浪庄重典雅，柳丝在庭院柔和的景观灯中呈现出迷人的金绿色光芒。',
      photographer: 'Li Mo (Ambient Lighting Designer)',
      cameraSettings: 'Sony α7S III • 50mm F1.2 GM • ISO 3200 • 1/40s • f/1.2',
      poeticNote: '晚风拂过，金丝轻飏。在静谧的夜灯照耀下，古老皇家御花园的浪漫意境被完美唤醒。'
    }
  },

  // 3. 曲院风荷 (Lotus Garden)
  '曲院风荷 (Lotus Garden)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      caption: '盛夏娇艳的粉色荷花在明媚阳光下傲然挺立，片片翠绿荷叶如大盘般盛满阳光。',
      photographer: 'Zhao Run (Flora Specialist)',
      cameraSettings: 'Canon EOS R6 Mark II • 100mm F2.8 L Macro • ISO 100 • 1/250s • f/4.0',
      poeticNote: '映日荷花别样红。阳光毫无保留地洒在荷塘之上，红白荷花宛如盛装的凌波仙子，清香随风远播。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
      caption: '骤雨打荷，大颗雨滴在翡翠般透亮的荷叶上滚动，溅起无数剔透的珍珠。',
      photographer: 'Sun Bo (Monochrome & Nature)',
      cameraSettings: 'Sony α7R IV • 70-200mm f/2.8 GM • ISO 400 • 1/400s • f/2.8',
      poeticNote: '雨打翠盘，风动幽香。微雨将十里荷花冲刷得更加清新艳丽，珠玑滚落荷塘，声声悦耳。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
      caption: '清晨的水雾自荷塘上升起，露珠缀满花瓣，整座曲院幽深寂静。',
      photographer: 'Wu Ran (West Lake Zen Art)',
      cameraSettings: 'Fujifilm X-T5 • XF50-140mm • ISO 160s • 1/100s • f/5.6',
      poeticNote: '白露未晞，荷香幽幽。晨雾和湖水自生的湿气交织在花叶间，完美展现出不胜凉风的娇羞之美。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=80',
      caption: '明月倒映在平静的荷塘中，夜色中的荷花收拢了花瓣，清香伴着夜凉袭人。',
      photographer: 'Hu Xiaoxiao (Chasing Moon Photography)',
      cameraSettings: 'Leica Q3 • Summilux 28mm f/1.7 • ISO 800 • 2s • f/2.0',
      poeticNote: '荷塘月色，暗香浮动。当喧闹退散，淡淡的星光与柔和的月晖在翠盘缝隙间流淌，意境超群。'
    }
  },

  // 4. 平湖秋月 (Summer Night View)
  '平湖秋月 (Summer Night View)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      caption: '秋日晴空万里，站在平湖秋月平台上，湖水宛如巨大的明镜，倒映着蓝天白云。',
      photographer: 'Xie Ting (Scenic Geographer)',
      cameraSettings: 'Sony α7R V • 24mm F1.4 GM • ISO 100 • 1/500s • f/8.0',
      poeticNote: '碧空无云，万顷波平。白天的平湖秋月一派天高水阔，古典轩榭与湖光山色互为借景。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      caption: '微雨落在宽阔的湖面上，击出密密麻麻、虚无缥缈的小圆点，远山在水帘后彻底朦胧。',
      photographer: 'Zhu Ge (Visual Poet)',
      cameraSettings: 'Nikon Z7 II • 50mm f/1.8 S • ISO 200 • 1/160s • f/2.8',
      poeticNote: '细雨敲波，一碧如洗。江南微雨将平湖秋月染成了一幅流动、静默的半透明水粉画。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1000&q=80',
      caption: '秋晨浓雾笼罩湖心，水天连成一片白茫茫，白堤长石板路在雾气中晶莹湿润。',
      photographer: 'Qian Kun (Landscape Aesthetics Curator)',
      cameraSettings: 'Hasselblad 907X • XCD 45mm • ISO 64 • 1/30s • f/4.0',
      poeticNote: '水天一色，白雾苍茫。浓雾将白堤、孤山与远湖缝合为一体，独具中国古典美学的“留白”气韵。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
      caption: '中秋良辰，一轮金黄圆月挂在西湖之上，月影在平静如镜的水面拉出长长的金色丝绸。',
      photographer: 'Yuan Feng (Golden Moon Seeker)',
      cameraSettings: 'Canon EOS R3 • RF70-200mm F2.8 L • ISO 800 • 1/2s • f/4.0',
      poeticNote: '万顷平波，月挂梢头。在没有风的一夜，西湖月影大放光明，是谓平湖秋月之极境。'
    }
  },

  // 5. 三潭印月 (Three Pagodas)
  '三潭印月 (Three Pagodas)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      caption: '艳阳照耀下，耸立在深碧西湖水中的三座精美石塔，塔身上的五个镂空圆洞清晰可见。',
      photographer: 'Su Min (Historic Heritage Recorder)',
      cameraSettings: 'Sony α7 IV • 70-200mm F4 G • ISO 100 • 1/250s • f/6.3',
      poeticNote: '石塔傲骨，碧波流金。艳阳下的三潭印月古朴端庄，小火轮缓缓开过，打破了千年的静谧。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1000&q=80',
      caption: '雨水顺着石塔的雕纹滑落，石塔仿佛静止不动的雨中哲人，默默守护着古老的湖心。',
      photographer: 'Chen Liang (Documentary Photographer)',
      cameraSettings: 'Fujifilm GFX 50S II • GF100-200mm • ISO 400 • 1/160s • f/5.6',
      poeticNote: '烟水茫茫，古塔依然。细雨击打西湖，唯有湖中三塔在波浪颠簸间稳健耸立，写意十足。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
      caption: '白雾升腾，三座石塔在迷蒙中只剩下若隐若现的黑色古雅轮廓，宛如仙境中的蓬莱。',
      photographer: 'Dong Fang (Zen & Space Artist)',
      cameraSettings: 'Leica M11 • Summicron 50mm f/2 • ISO 200 • 1/125s • f/2.0',
      poeticNote: '缥缈仙山，遗世独立。湖心薄雾袅袅，石塔忽隐忽现，引诱着岸边游人对蓬莱仙境的无限神往。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
      caption: '中秋夜，塔内燃烛，五个圆洞透出柔光，在湖面上印出十五个闪烁的“金色小月亮”。',
      photographer: 'Wei Lin (Lantern Festival Documenter)',
      cameraSettings: 'Sony α7R V • 85mm F1.4 GM • ISO 1600 • 1/15s • f/1.4',
      poeticNote: '一塔十五月，金辉映碧波。烛光穿孔，水月交融，演绎出千年传承不衰的西湖月夜绝景。'
    }
  },

  // 6. 雷峰夕照 (Leifeng Pagoda)
  '雷峰夕照 (Leifeng Pagoda)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1000&q=80',
      caption: '金秋澄明，夕阳西斜，夕阳金晖慷慨地铺在雷峰古塔上，折射出璀璨的金光。',
      photographer: 'Jin Yang (Sunset Hunter)',
      cameraSettings: 'Nikon Z6 II • 24-200mm f/4-6.3 • ISO 100 • 1/400s • f/6.3',
      poeticNote: '落日衔山，夕晖流金。高高耸立的雷峰宝塔在落日中散发出金碧辉煌、神圣庄严的光辉。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      caption: '细雨迷蒙中的净慈寺与雷峰塔，远山含黛，古塔在漫天雨云中略带几分沧桑古韵。',
      photographer: 'Shi Kuan (Buddhism & Art Photog)',
      cameraSettings: 'Sony α7R III • 24-105mm F4 • ISO 400 • 1/100s • f/4.0',
      poeticNote: '晚钟声远，细雨飞花。凄蒙的微雨洗去白日尘埃，让这一座千古名塔沉浸在佛国钟声的空明之中。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1000&q=80',
      caption: '晨雾自南山飘来，雷峰塔如一条巨龙在茫茫白雾中盘旋，鳞甲若现，神秘巍峨。',
      photographer: 'Fang Yan (Mountain & Fog Specialist)',
      cameraSettings: 'Canon EOS R5 • RF100-500mm • ISO 200 • 1/125s • f/5.6',
      poeticNote: '塔锁云霞，神话重现。清晨的雾海吞没古塔基座，塔尖穿云而出，重现了青蛇白蛇的浪漫变迁。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
      caption: '夜色降临，整座雷峰塔被多角度金色投光灯彻底点亮，雕梁画栋，熠熠夺目。',
      photographer: 'Guo Peng (Illumination Specialist)',
      cameraSettings: 'Sony α7 IV • 16-35mm F4 G • ISO 1600 • 1/10s • f/4.0',
      poeticNote: '浮光耀金，不夜明珠。夜空下的雷峰塔如同璀璨夺目的楼阁神殿，在漆黑南山衬托下气势如虹。'
    }
  },

  // 7. 断桥残雪 (Broken Bridge)
  '断桥残雪 (Broken Bridge)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1000&q=80',
      caption: '冬雪初晴，暖阳高照。断桥向阳一面的积雪消融露出灰色石板，背阳一面依然覆盖着皑皑白雪。',
      photographer: 'Xue Ruo (Winter Scenic Artist)',
      cameraSettings: 'Leica SL2 • Elmarit 24mm F2.8 • ISO 100 • 1/500s • f/8.0',
      poeticNote: '初晴旭日，雪作留白。阳光消融了南向雪，桥面石板斑驳初露，如长桥截断，形成“断桥残雪”奇观。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?auto=format&fit=crop&w=1000&q=80',
      caption: '冷雨夹雪落下，断桥之上伞影绰绰，行人漫步，在青石桥面上留下一汪汪湿漉的倒影。',
      photographer: 'Shao Ming (Street & Rainy Mood)',
      cameraSettings: 'Sony α7S III • 35mm F1.4 GM • ISO 800 • 1/200s • f/1.4',
      poeticNote: '春寒料峭，冬雨缠绵。雨夹雪洗净了断桥，行人撑起色彩斑斓的雨伞，让凄清的古桥添了人间烟火气。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      caption: '大雾自宝石山弥漫而下，断桥长拱桥身向里延伸，消失在未知的虚无雾海中。',
      photographer: 'Zhao Feng (Foggy Jiangnan Series)',
      cameraSettings: 'Fujifilm X-T5 • XF33mm F1.4 • ISO 200 • 1/125s • f/4.0',
      poeticNote: '白雾迷离，桥延无尽。大雾赋予了断桥更为极致的古典虚无，宛若许仙与白娘子在神秘仙雾中相遇。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
      caption: '寒夜幽深，断桥白雪在清冷的路灯与远方城市虹彩映衬下，泛出迷人的淡蓝色莹光。',
      photographer: 'Ye Han (Nightscape Enthusiast)',
      cameraSettings: 'Canon EOS R5 • RF50mm F1.2 L • ISO 3200 • 1/30s • f/1.2',
      poeticNote: '孤寂寒桥，幽光凝碧。残雪在夜灯、月光和市井璀璨灯光的三重雕刻下，莹莹发光，冷艳无双。'
    }
  },

  // 8. 孤山寻梅 (Solitary Hill)
  '孤山寻梅 (Solitary Hill)': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=1000&q=80',
      caption: '冬日红梅迎风傲放，艳红的花瓣在蔚蓝、清透的冬日晴空衬托下，显得格外明艳生动。',
      photographer: 'Zhou Lin (Plum Blossom Record)',
      cameraSettings: 'Nikon Z7 II • 105mm f/2.8 Micro S • ISO 64 • 1/160s • f/5.6',
      poeticNote: '红梅傲立，冷照晴空。阳光勾勒出梅树苍劲如铁的枝桠，红白小花在枝头怒放，芬芳袭人。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      caption: '微雨如酥落在梅林之中，花瓣上凝结着晶莹的水珠，散发出清冷孤傲的幽香。',
      photographer: 'Chen Zhi (Macro Nature Art)',
      cameraSettings: 'Canon EOS R6 II • RF100mm F2.8 Macro • ISO 400 • 1/125s • f/4.0',
      poeticNote: '疏影横斜，暗香浮动。雨水让孤山古梅花瓣更加鲜艳欲滴，落红点点，幽静冷美。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1522083165195-342750297f05?auto=format&fit=crop&w=1000&q=80',
      caption: '雾隐孤山，苍劲古老的梅树在弥漫的晨雾中隐现，梅影婆娑，宛如中国文人古画。',
      photographer: 'Wu Ge (Ink Wash Calligrapher)',
      cameraSettings: 'Hasselblad X2D • 90mm • ISO 100 • 1/80s • f/3.2',
      poeticNote: '雾绕冷艳，抱鹤遗风。大雾锁孤山，唯有隐世傲梅伸出遒劲一枝，重现北宋林和靖处士的仙骨。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=1000&q=80',
      caption: '寒夜清冷，红梅在孤山庄榭的幽柔黄灯和冷月照耀下，折射出莹澈、幽谧的绰约倩影。',
      photographer: 'Teng Hao (Traditional Mood Finder)',
      cameraSettings: 'Leica Q2 Monochrom • Summilux 28mm • ISO 1600 • 1s • f/1.7',
      poeticNote: '梅骨月影，幽幽暗香。在静无一人的孤山寒夜，一抹寒梅静默绽放，守望着千年的西湖清幽。'
    }
  },

  // 9. 杭州国际会议中心 (Conference Center / 金球)
  '杭州国际会议中心': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      caption: '蓝天白云下，金碧辉煌的国际会议中心球体熠熠生辉，光芒万丈。',
      photographer: 'Xu Hang (Architectural Master)',
      cameraSettings: 'Sony α7R V • FE 16-35mm F2.8 GM II • ISO 100 • 1/500s • f/8.0',
      poeticNote: '金阳耀日，大国重器。曲面晶莹的金色巨球如太阳升起在钱塘江畔，象征数智杭州的蓬勃朝气。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1000&q=80',
      caption: '雨水如幕滑落过金色巨型曲面，金球在雨中更显温润，折射出柔和的漫反射。',
      photographer: 'Fan Yi (Urban Rain Series)',
      cameraSettings: 'Canon EOS R5 • RF24-105mm F4 L • ISO 200 • 1/125s • f/5.6',
      poeticNote: '金碧洗翠，雨润重楼。雨水清洗了万千块幕墙玻璃，金球宛如洗净的灵珠，散发古典光华。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
      caption: '清晨的钱塘江雾将大楼笼罩，金色巨球在大雾中半遮半掩，宛如晨雾中的金色朝阳。',
      photographer: 'Qi Nuo (Aviation & Cloud)',
      cameraSettings: 'DJI Mavic 3 Pro • Hasselblad L2D-20c • ISO 100 • 1/160s • f/4.5',
      poeticNote: '云蒸霞蔚，雾里金乌。大雾锁住钱江，巨型金球悬浮于半空白雾间，宛如科幻飞船，现代震撼。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
      caption: '夜幕降临，会议中心的LED晶格点阵瞬间被点亮，数码动画与流光溢彩交相辉映。',
      photographer: 'Zou Xun (Cyber Cities)',
      cameraSettings: 'Nikon Z9 • Nikkor 14-30mm f/4 S • ISO 800 • 1/8s • f/4.0',
      poeticNote: '华灯璀璨，流光溢彩。华美的数码光影在巨球曲面上奔流跳跃，化身钱江畔最宏伟的数智霓虹。'
    }
  },

  // 10. 杭州大剧院 (Grand Theater / 银月)
  '杭州大剧院': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1000&q=80',
      caption: '烈日之下，钛合金弧形屋顶与玻璃幕墙交相辉映，银月形态舒展大气。',
      photographer: 'Cheng Bo (Geometrical Aesthetics)',
      cameraSettings: 'Sony α7R IV • 24-70mm • ISO 100 • 1/320s • f/8.0',
      poeticNote: '烈日耀银，弯月张帆。银白色的双曲面大剧院在蓝天衬托下闪烁出耀眼的金属之光，科技感十足。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=1000&q=80',
      caption: '雨幕沿斜坡屋顶冲刷，玻璃幕墙上汇成道道溪流，倒映着对面繁华的市民中心。',
      photographer: 'Xun Jie (Urban Lens)',
      cameraSettings: 'Fujifilm X-T5 • XF18-55mm • ISO 320 • 1/100s • f/4.0',
      poeticNote: '雨洗银河，琴声渐起。雨水撞击金属顶棚，宛如密集的鼓点琴音，与江水声浪奏响城市交响。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1000&q=80',
      caption: '晨雾自江面涌来，大剧院的巨大银质月牙线条在飘渺水汽中更显柔和写意。',
      photographer: 'Zhang Ru (Jiangnan Sci-Fi Record)',
      cameraSettings: 'Canon EOS R5 • RF24-70mm • ISO 100 • 1/50s • f/5.6',
      poeticNote: '晓雾凝露，冷月半隐。晨雾抚过大剧院优雅弯月，将庞大的钢铁巨兽驯服为一只诗意温婉的银弧。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
      caption: '绚烂的露天音乐喷泉在剧院前腾空而起，与剧院巨大的倒影金红蓝彩交织，如梦似幻。',
      photographer: 'Yuan Feng (Night Symphony)',
      cameraSettings: 'Sony α7R V • 35mm F1.4 • ISO 1200 • 1/25s • f/1.8',
      poeticNote: '水舞月影，交响潮音。巨型月牙屋顶在璀璨音乐喷泉的千重水浪与声光映射中，焕发无双科幻风韵。'
    }
  },

  // 11. G20峰会主会场 (G20 Summit)
  'G20峰会主会场': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      caption: '艳阳之下的国际博览中心，大气的江南飞檐斗拱高低错落，气吞山河。',
      photographer: 'Wang Gang (Grand Projects)',
      cameraSettings: 'Nikon Z8 • 14-24mm f/2.8 S • ISO 64 • 1/400s • f/8.0',
      poeticNote: '国风浩荡，飞檐倚天。蓝天下挺拔的大型钢混柱廊 and flowing roof design show the magnificent scale of national architecture.'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80',
      caption: '江南微雨清洗着巨大的广场和灰白钢柱，水波涟漪倒映着挺立的多柱殿建筑。',
      photographer: 'Li Wei (Symmetry & Order)',
      cameraSettings: 'Canon R3 • 24-70mm f/2.8 • ISO 400 • 1/160s • f/5.6',
      poeticNote: '雨润回廊，江南清秀。微雨中的会场少了一丝庄严肃穆，多了一份江南庭院的回廊细水、烟雨朦胧。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?auto=format&fit=crop&w=1000&q=80',
      caption: '白雾横江，庞大的空中花园与主场大跨度悬挑飞檐在雾海间漂浮。',
      photographer: 'Zhao Run (Zen Urban Landscapes)',
      cameraSettings: 'Sony α7R V • 50mm • ISO 100 • 1/100s • f/4.0',
      poeticNote: '雾锁天阙，浮空琼楼。重楼飞檐穿透茫茫白雾，宛如仙界的广寒琼楼，完美实现科技国风虚实相生。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80',
      caption: '夜幕下的会场飞檐华灯绽放，暖黄与天蓝冷光交互，完美重现盛世古典建筑风仪。',
      photographer: 'Zhang Shuo (Historic Nightlights)',
      cameraSettings: 'Nikon Z9 • S Line 24-70mm • ISO 1000 • 1/15s • f/4.0',
      poeticNote: '霓虹流金，飞檐生彩。金色射灯将多重檐式重楼照亮，赛博时代的钢铁巨殿彰显中华礼仪与科技的交融。'
    }
  },

  // 12. 杭州奥体中心「大莲花」 (Big Lotus)
  '杭州奥体中心「大莲花」': {
    sunny: {
      url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1000&q=80',
      caption: '骄阳照耀着大莲花，高科技白色钢结构花瓣如同真莲花一般傲立在清澈江畔。',
      photographer: 'He Shanshan (Sports Architectural Record)',
      cameraSettings: 'Sony α1 • FE 12-24mm F2.8 GM • ISO 100 • 1/800s • f/5.6',
      poeticNote: '巨莲盛放，阳光如白昼。在烈日下，白色高科技复合花瓣交错挺立，编织出富有未来力量感的庞大肌理。'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=1000&q=80',
      caption: '微雨之中，大莲花28片巨型钢结构花瓣上汇聚细密雨丝，莲叶承雨，风姿绰约。',
      photographer: 'Zhou Lin (Monochrome Architecture)',
      cameraSettings: 'Fujifilm GFX 100S • GF32-64mm • ISO 320 • 1/80s • f/4.0',
      poeticNote: '雨打清莲，柔中带刚。大莲花庞大的白色骨架经由江南冷雨冲刷，多了一份空灵与柔和，美轮美奂。'
    },
    misty: {
      url: 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1000&q=80',
      caption: '晨雾锁住钱塘江，巨大的白色体育馆花瓣高耸在白云水汽间，仿若瑶池白莲。',
      photographer: 'Wang Jie (Aerial & Abstract)',
      cameraSettings: 'DJI Inspire 3 • Zenmuse X9-8K • ISO 160 • 1/120s • f/4.0',
      poeticNote: '仙气缭绕，瑶池清莲。大雾在花瓣拼接缝隙中缓缓流过，体育馆宛若凭空盛开在仙境湖心的科技白莲。'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
      caption: '杭州亚运主体育馆在星空下亮起深邃的紫、粉、绿交互智联灯光，江影流彩。',
      photographer: 'Chen Zhi (Cyberpunk Nightlights)',
      cameraSettings: 'Sony α7S III • FE 24mm F1.4 GM • ISO 2500 • 1/30s • f/1.4',
      poeticNote: '紫荷迎宾，赛博星空。千种RGB智联节能LED点亮花瓣，大莲花瞬间变为盛开在钱塘江畔的多维科技幻彩之冠。'
    }
  }
};
