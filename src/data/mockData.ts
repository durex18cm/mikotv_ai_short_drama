import type { Character, Episode, Scene, Shot, VisualStyle, SubtitleLine, Project } from '@/types'

export const MOCK_EXISTING_PROJECTS: Project[] = [
  {
    id: 'proj-0',
    name: '长安十二时辰',
    episodes: 5,
    duration: '90-120s',
    ratio: '9:16',
    language: '中文',
    createdAt: '2026-05-08',
    status: 'exported',
  },
  {
    id: 'proj-00',
    name: '大唐盛世',
    episodes: 3,
    duration: '60-90s',
    ratio: '9:16',
    language: '中文',
    createdAt: '2026-05-05',
    status: 'in-progress',
  },
]

export const MOCK_PROJECT: Project = {
  id: 'proj-1',
  name: '霍去病之封狼居胥',
  episodes: 3,
  duration: '60-90s',
  ratio: '9:16',
  language: '中文',
  createdAt: '2026-05-10',
  status: 'in-progress',
}

export const MOCK_SCRIPT = `第一集：漠南之战

场景一：大汉军营，夜

旁白：元朔六年，年仅十八岁的霍去病第一次独立领兵。

霍去病：八百轻骑，随我深入漠南！

士兵：诺！

场景二：大漠深处，黎明前

旁白：这一夜，少年将军纵马奔驰六百里。

霍去病：（望着夜色）匈奴人在哪里，我们就去哪里。

场景三：匈奴营地，夜袭

匈奴士兵：汉军！汉军来了！

霍去病：（长刀出鞘）杀！

旁白：此战，霍去病斩杀匈奴二千余人，俘虏匈奴相国、当户，斩杀单于祖父辈的籍若侯产，俘虏单于叔父罗姑比。

场景四：大汉军营，胜利归来

汉武帝：朕赐你冠军侯！

霍去病：（单膝跪地）臣，谢陛下隆恩！

---

第二集：河西之战

场景一：河西走廊，初夏

旁白：元狩二年，霍去病西征河西。

霍去病：焉支山，拿下！

场景二：焉支山麓，激战

旁白：六天内，急行军数百里，与匈奴多次交锋。

霍去病：（策马冲锋）破阵！

匈奴将领：（惊慌失措）快撤！快撤！

场景三：匈奴浑邪王营帐

旁白：此战，歼敌近万，俘虏匈奴祭天金人，占领河西走廊。

霍去病：（望着远山）河西，从此属于大汉。

---

第三集：漠北之战

场景一：漠北大漠，旌旗猎猎

旁白：元狩四年，霍去病率五万骑兵深入漠北。

霍去病：不破匈奴，誓不回还！

场景二：瀚海草原，决战

旁白：与匈奴主力决战，斩杀七万余人。

霍去病：（仰望苍穹）封！狼！居！胥！

场景三：狼居胥山顶，封禅祭天

旁白：在狼居胥山举行祭天封礼，在姑衍山举行祭地禅礼，兵锋一直逼至瀚海。

霍去病：此山今日起，属于大汉！

旁白：年仅二十三岁的少年将军，创下了华夏军事史上最辉煌的传奇。封狼居胥，饮马瀚海，成为后世无数英雄仰望的丰碑。`

export const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char-hqb',
    name: '霍去病',
    age: '18岁',
    role: '西汉少年将领',
    appearance: '英气、锐利、少年感强，眉目如刀',
    costume: '汉代轻甲，披红色战袍，腰悬长刀',
    personality: '果敢、骄傲、冷静、极具进攻性',
    voiceType: '年轻男声',
    voiceDesc: '年轻、坚定、有压迫感',
    voiceGender: 'male',
    voiceAge: 'young',
    colorHue: 260,
    confirmed: false,
  },
  {
    id: 'char-hwd',
    name: '汉武帝',
    age: '中年',
    role: '大汉皇帝',
    appearance: '威严、深沉、目光锐利，龙颜不怒自威',
    costume: '黑金色帝王冕服，头戴十二旒冠冕',
    personality: '雄才大略、克制、威严，胸怀天下',
    voiceType: '成熟男声',
    voiceDesc: '成熟、低沉、有帝王感',
    voiceGender: 'male',
    voiceAge: 'mature',
    colorHue: 40,
    confirmed: false,
  },
  {
    id: 'char-wq',
    name: '卫青',
    age: '壮年',
    role: '大汉名将、大司马大将军',
    appearance: '面容沉稳坚毅，气宇轩昂',
    costume: '汉代将军全套铠甲，持长剑',
    personality: '稳重、谨慎、可靠，善于运筹帷幄',
    voiceType: '成熟男声',
    voiceDesc: '成熟、沉稳、令人信赖',
    voiceGender: 'male',
    voiceAge: 'mature',
    colorHue: 165,
    confirmed: false,
  },
  {
    id: 'char-xnzl',
    name: '匈奴将领',
    age: '壮年',
    role: '匈奴部族将领',
    appearance: '面貌粗犷，眼神警觉，压迫感极强',
    costume: '草原皮甲，头戴兽皮帽，腰挂弯刀',
    personality: '凶悍、多疑、善战，视汉人为猎物',
    voiceType: '低沉男声',
    voiceDesc: '低沉、沙哑、带有草原口音',
    voiceGender: 'male',
    voiceAge: 'mature',
    colorHue: 20,
    confirmed: false,
  },
  {
    id: 'char-hjsb',
    name: '汉军士兵',
    age: '青年',
    role: '汉军轻骑兵',
    appearance: '年轻面孔，眼神坚毅，风尘仆仆',
    costume: '汉代轻骑兵标准装备，手持长矛',
    personality: '忠诚、勇敢、服从命令，视死如归',
    voiceType: '年轻男声',
    voiceDesc: '年轻、有力量、整齐划一',
    voiceGender: 'male',
    voiceAge: 'young',
    colorHue: 200,
    confirmed: false,
  },
]

export const MOCK_EPISODES: Episode[] = [
  { id: 'ep1', num: 1, title: '漠南之战', sceneCount: 4, shotCount: 5, totalDuration: 75, synthesisStatus: 'idle' },
  { id: 'ep2', num: 2, title: '河西之战', sceneCount: 4, shotCount: 5, totalDuration: 80, synthesisStatus: 'idle' },
  { id: 'ep3', num: 3, title: '漠北之战', sceneCount: 4, shotCount: 5, totalDuration: 85, synthesisStatus: 'idle' },
]

export const MOCK_SCENES: Scene[] = [
  { id: 'sc1-1', episodeId: 'ep1', num: 1, title: '大汉军营，夜', location: '大汉军营', time: '夜' },
  { id: 'sc1-2', episodeId: 'ep1', num: 2, title: '大漠深处，黎明前', location: '大漠深处', time: '黎明前' },
  { id: 'sc1-3', episodeId: 'ep1', num: 3, title: '匈奴营地，夜袭', location: '匈奴营地', time: '深夜' },
  { id: 'sc1-4', episodeId: 'ep1', num: 4, title: '大汉军营，胜利归来', location: '大汉军营', time: '清晨' },
  { id: 'sc2-1', episodeId: 'ep2', num: 1, title: '河西走廊，初夏', location: '河西走廊', time: '正午' },
  { id: 'sc2-2', episodeId: 'ep2', num: 2, title: '焉支山麓，激战', location: '焉支山麓', time: '午后' },
  { id: 'sc2-3', episodeId: 'ep2', num: 3, title: '匈奴浑邪王营帐', location: '匈奴王庭', time: '夜晚' },
  { id: 'sc2-4', episodeId: 'ep2', num: 4, title: '焉支山顶，胜利', location: '焉支山顶', time: '日出' },
  { id: 'sc3-1', episodeId: 'ep3', num: 1, title: '漠北大漠，出征', location: '漠北大漠', time: '黎明' },
  { id: 'sc3-2', episodeId: 'ep3', num: 2, title: '瀚海草原，决战', location: '瀚海草原', time: '正午' },
  { id: 'sc3-3', episodeId: 'ep3', num: 3, title: '狼居胥山，封禅', location: '狼居胥山顶', time: '傍晚' },
  { id: 'sc3-4', episodeId: 'ep3', num: 4, title: '大漠，凯旋', location: '漠北大漠', time: '黄昏' },
]

export const MOCK_SHOTS: Shot[] = [
  // Episode 1
  { id: 'shot-1-1', episodeId: 'ep1', sceneId: 'sc1-1', num: 1, type: '远景', description: '大漠黄昏，汉军营帐孤立在风沙中，旌旗飘扬', characters: [], action: '镜头缓慢推进', narrator: '元朔六年，少年霍去病第一次领兵出征。', sfx: '风沙声', music: '史诗弦乐', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-1-2', episodeId: 'ep1', sceneId: 'sc1-1', num: 2, type: '中景', description: '霍去病披甲走出营帐，眼神锐利，望向远方', characters: ['霍去病'], action: '霍去病大步走出，停顿，转头看向镜头', dialogue: '八百轻骑，随我深入漠南！', sfx: '铠甲碰撞声', music: '紧张弦乐起', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-1-3', episodeId: 'ep1', sceneId: 'sc1-2', num: 3, type: '全景', description: '马蹄踏碎黄沙，骑兵大军冲入夜色，尘土飞扬', characters: ['汉军士兵'], action: '骑兵群疾驰，烟尘四起', sfx: '战鼓声、马蹄轰鸣', music: '激昂战鼓', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-1-4', episodeId: 'ep1', sceneId: 'sc1-3', num: 4, type: '近景', description: '匈奴营地火光摇曳，守军从睡梦中惊醒', characters: ['匈奴将领'], action: '匈奴士兵惊醒，四处张望', dialogue: '汉军！汉军来了！', sfx: '惊呼声、骚乱声', music: '紧张弦乐', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-1-5', episodeId: 'ep1', sceneId: 'sc1-3', num: 5, type: '特写', description: '霍去病纵马冲锋，长刀出鞘，寒光一闪', characters: ['霍去病'], action: '霍去病策马奔腾，长刀横斩', narrator: '这一夜，十八岁的少年将军撕开了大漠的防线。', sfx: '刀刃出鞘声、冲锋号角', music: '高潮弦乐', duration: 7, keyframeStatus: 'idle', videoStatus: 'idle' },
  // Episode 2
  { id: 'shot-2-1', episodeId: 'ep2', sceneId: 'sc2-1', num: 1, type: '远景', description: '河西走廊，霍去病率汉军铁骑滚滚西进，气势磅礴', characters: ['霍去病', '汉军士兵'], action: '大军向西挺进，镜头从空中俯瞰', narrator: '元狩二年，霍去病再次率军西征河西。', sfx: '马蹄声、旌旗猎猎', music: '进行曲风格弦乐', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-2-2', episodeId: 'ep2', sceneId: 'sc2-1', num: 2, type: '中景', description: '霍去病骑马立于高坡，远望连绵的焉支山脉', characters: ['霍去病'], action: '霍去病勒马停止，举目远望，神情坚定', dialogue: '焉支山，今日必取！', sfx: '山风呼啸', music: '低沉号角', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-2-3', episodeId: 'ep2', sceneId: 'sc2-2', num: 3, type: '全景', description: '汉军骑兵如潮水般冲过走廊，旌旗招展', characters: ['汉军士兵'], action: '骑兵大规模冲锋，场面宏大', sfx: '战鼓声，马蹄轰鸣，喊杀声', music: '激昂战鼓与弦乐', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-2-4', episodeId: 'ep2', sceneId: 'sc2-3', num: 4, type: '近景', description: '匈奴将领营帐，灯火骤然熄灭，慌乱逃窜', characters: ['匈奴将领'], action: '匈奴将领翻身而起，神情慌张', dialogue: '快撤！全部撤！', sfx: '营帐风声、慌乱脚步声', music: '急促弦乐', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-2-5', episodeId: 'ep2', sceneId: 'sc2-4', num: 5, type: '全景', description: '霍去病登上焉支山顶，旌旗猎猎，晨光万丈', characters: ['霍去病', '汉军士兵'], action: '霍去病立于山顶，汉军在山腰欢呼', narrator: '此战，歼敌近万，河西走廊尽归大汉版图。', sfx: '欢呼声、风声', music: '史诗弦乐高潮', duration: 7, keyframeStatus: 'idle', videoStatus: 'idle' },
  // Episode 3
  { id: 'shot-3-1', episodeId: 'ep3', sceneId: 'sc3-1', num: 1, type: '远景', description: '漠北大漠，汉军主力铁骑北上，旌旗蔽日，声势浩大', characters: ['霍去病', '汉军士兵'], action: '俯瞰大军出征，镜头拉远', narrator: '元狩四年，霍去病率五万骑兵深入漠北，与匈奴决战。', sfx: '战鼓、马蹄、号角', music: '史诗开场弦乐', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-3-2', episodeId: 'ep3', sceneId: 'sc3-2', num: 2, type: '中景', description: '霍去病与匈奴主力正面对决，杀声震天', characters: ['霍去病'], action: '霍去病持刀冲锋，英姿飒爽', dialogue: '不破匈奴，誓不回还！', sfx: '喊杀声、兵器碰撞声', music: '最强战鼓弦乐', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-3-3', episodeId: 'ep3', sceneId: 'sc3-3', num: 3, type: '全景', description: '狼居胥山顶，汉军旌旗猎猎，天地苍茫', characters: ['霍去病', '汉军士兵'], action: '霍去病登顶，面对苍天', narrator: '封狼居胥，饮马瀚海——这是华夏将士最高的荣耀。', sfx: '风声、旌旗声', music: '庄严宏大弦乐', duration: 5, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-3-4', episodeId: 'ep3', sceneId: 'sc3-3', num: 4, type: '特写', description: '霍去病仰望苍天，神情肃穆而骄傲，阳光洒在他的战甲上', characters: ['霍去病'], action: '霍去病举剑朝天，仰头大喝', dialogue: '此山今日起，属于大汉！', sfx: '风声、剑鸣声', music: '最高潮弦乐', duration: 6, keyframeStatus: 'idle', videoStatus: 'idle' },
  { id: 'shot-3-5', episodeId: 'ep3', sceneId: 'sc3-4', num: 5, type: '远景', description: '落日余晖中，汉军凯旋而归，剪影映衬在金色的大漠上', characters: ['霍去病', '汉军士兵'], action: '大军缓缓向南行进，镜头渐渐拉远', narrator: '年仅二十三岁的少年将军，创下了华夏军事史上最辉煌的传奇。', sfx: '马蹄声渐远', music: '史诗尾声弦乐', duration: 7, keyframeStatus: 'idle', videoStatus: 'idle' },
]

export const MOCK_VISUAL_STYLES: VisualStyle[] = [
  {
    id: 'realistic',
    name: '写实电影风',
    description: '画面真实，人物接近真人演员比例，光影自然，史诗质感强烈',
    tags: ['历史', '战争', '现实'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#4a90e2',
  },
  {
    id: 'epic-chinese',
    name: '国风史诗风',
    description: '强调东方美学、厚重色调、宏大场景，古典与壮美并存',
    tags: ['历史', '武侠', '神话'],
    gradient: 'linear-gradient(135deg, #2d1b00 0%, #5c3300 50%, #8b4513 100%)',
    accentColor: '#d4941a',
  },
  {
    id: 'anime',
    name: '动漫风',
    description: '角色造型更有二次元表现力，色彩鲜艳，情感张力十足',
    tags: ['幻想', '青春', '轻喜剧'],
    gradient: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #6600cc 100%)',
    accentColor: '#cc66ff',
  },
  {
    id: 'game-cg',
    name: '游戏 CG 风',
    description: '画面精致细腻，动作感强，特效震撼，适合高燃场面',
    tags: ['战争', '玄幻', '科幻'],
    gradient: 'linear-gradient(135deg, #001a33 0%, #003366 50%, #0066cc 100%)',
    accentColor: '#00aaff',
  },
  {
    id: 'ink-wash',
    name: '水墨风',
    description: '具有中国传统水墨质感，留白、意境、东方诗意融为一体',
    tags: ['古风', '诗意', '历史叙事'],
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)',
    accentColor: '#888888',
  },
  {
    id: 'short-drama',
    name: '竖屏短剧风',
    description: '节奏快，人物突出，情绪明确，为移动端短剧观看体验深度优化',
    tags: ['现代', '都市', '快节奏'],
    gradient: 'linear-gradient(135deg, #1a0a1a 0%, #33001a 50%, #660033 100%)',
    accentColor: '#ff3399',
  },
]

export const MOCK_SUBTITLES: SubtitleLine[] = [
  { id: 'sub-1', shotId: 'shot-1-1', episodeId: 'ep1', character: '旁白', text: '元朔六年，少年霍去病第一次领兵出征。', startTime: 0, endTime: 5 },
  { id: 'sub-2', shotId: 'shot-1-2', episodeId: 'ep1', character: '霍去病', text: '八百轻骑，随我深入漠南！', startTime: 5, endTime: 11 },
  { id: 'sub-3', shotId: 'shot-1-4', episodeId: 'ep1', character: '匈奴将领', text: '汉军！汉军来了！', startTime: 16, endTime: 22 },
  { id: 'sub-4', shotId: 'shot-1-5', episodeId: 'ep1', character: '旁白', text: '这一夜，十八岁的少年将军撕开了大漠的防线。', startTime: 22, endTime: 29 },
  { id: 'sub-5', shotId: 'shot-2-1', episodeId: 'ep2', character: '旁白', text: '元狩二年，霍去病再次率军西征河西。', startTime: 0, endTime: 5 },
  { id: 'sub-6', shotId: 'shot-2-2', episodeId: 'ep2', character: '霍去病', text: '焉支山，今日必取！', startTime: 5, endTime: 11 },
  { id: 'sub-7', shotId: 'shot-2-4', episodeId: 'ep2', character: '匈奴将领', text: '快撤！全部撤！', startTime: 16, endTime: 22 },
  { id: 'sub-8', shotId: 'shot-2-5', episodeId: 'ep2', character: '旁白', text: '此战，歼敌近万，河西走廊尽归大汉版图。', startTime: 22, endTime: 29 },
  { id: 'sub-9', shotId: 'shot-3-1', episodeId: 'ep3', character: '旁白', text: '元狩四年，霍去病率五万骑兵深入漠北，与匈奴决战。', startTime: 0, endTime: 5 },
  { id: 'sub-10', shotId: 'shot-3-2', episodeId: 'ep3', character: '霍去病', text: '不破匈奴，誓不回还！', startTime: 5, endTime: 11 },
  { id: 'sub-11', shotId: 'shot-3-3', episodeId: 'ep3', character: '旁白', text: '封狼居胥，饮马瀚海——这是华夏将士最高的荣耀。', startTime: 11, endTime: 16 },
  { id: 'sub-12', shotId: 'shot-3-4', episodeId: 'ep3', character: '霍去病', text: '此山今日起，属于大汉！', startTime: 16, endTime: 22 },
  { id: 'sub-13', shotId: 'shot-3-5', episodeId: 'ep3', character: '旁白', text: '年仅二十三岁的少年将军，创下了华夏军事史上最辉煌的传奇。', startTime: 22, endTime: 29 },
]

// ─── Image helpers ────────────────────────────────────────────────────────────

const CHARACTER_IMAGE_MAP: Record<string, string> = {
  '霍去病':   '/images/keyframes/huoqubing.png',
  '汉武帝':   '/images/keyframes/hanwudi.png',
  '卫青':     '/images/keyframes/weiqing.png',
  '匈奴将领': '/images/keyframes/xiongnujiangling.png',
  '汉军士兵': '/images/keyframes/hanjunshibing.png',
}

// object-position for face crop in each portrait (all are full-body 9:16 shots,
// face is in the upper ~10% of the image)
const CHARACTER_AVATAR_POSITION: Record<string, string> = {
  '霍去病':   'center 8%',
  '汉武帝':   'center 7%',
  '卫青':     'center 9%',
  '匈奴将领': 'center 11%',
  '汉军士兵': 'center 9%',
}

export function getCharacterImageUrl(name: string): string {
  return CHARACTER_IMAGE_MAP[name] ?? ''
}

export function getCharacterAvatarPosition(name: string): string {
  return CHARACTER_AVATAR_POSITION[name] ?? 'center top'
}

// For a given shot, pick the most relevant keyframe image
export function getShotImageUrl(shot: Shot): string {
  const primary = shot.characters[0]
  return CHARACTER_IMAGE_MAP[primary] ?? '/images/keyframes/huoqubing.png'
}
