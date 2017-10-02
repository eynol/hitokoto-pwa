export const ANIMATE_CONFIG_NEXT = [
  {
    opacity: [
      1, 0
    ],
    translateX: [0, 100]
  }, {
    opacity: [
      1, 0
    ],
    zIndex: -1,
    position: 'absolute',
    translateX: [0, -100]
  }
];
export const ANIMATE_CONFIG_LAST = [
  {
    opacity: [
      1, 0
    ],
    translateZ: [
      0, 20
    ],
    translateX: [0, -100]
  }, {
    opacity: [
      1, 0
    ],
    zIndex: -1,
    position: 'absolute',
    translateX: [0, 100]
  }
];

export const ANIMATE_CONFIG_HORIZON = [
  {
    opacity: [
      1, 0
    ],
    translateX: [0, -50]
  }, {
    opacity: [
      1, 0
    ],
    zIndex: -1,
    position: 'absolute',
    translateX: [0, 50]
  }
];

export const GLOBAL_ANIMATE_TYPE = ['right', 'left'];

export const FONT_MAP = {
  'default': 'inherit',
  'simsun': "'Noto Serif CJK SC', 'Source Han Serif SC', 'Source Han Serif', source-han-serif" +
      "-sc, '宋体', SimSun, '华文细黑', STXihei, serif",
  'fangsong': 'Georgia,"Times New Roman", "FangSong", "仿宋", STFangSong, "华文仿宋", serif',
  'kai': '"楷体",serif'
}